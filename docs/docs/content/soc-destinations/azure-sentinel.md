# Azure Sentinel Destination Setup Guide

This guide walks you through configuring Microsoft Sentinel as a SOC/SIEM destination in Whiteout AI, ingesting audit events into Azure Log Analytics for threat detection, investigation, and automated response.

## Overview

The Azure Sentinel destination allows Whiteout AI to:
- Ingest audit events into Microsoft Sentinel (formerly Azure Sentinel) for threat detection, investigation, and automated response using Azure Log Analytics
- Leverage Data Collection Rules (DCR) and Data Collection Endpoints (DCE) for structured event ingestion
- Enable correlation of AI governance events with other security signals in Sentinel
- Power custom analytics rules, workbooks, and automated playbooks using Whiteout AI event data

## Prerequisites

Before you begin, ensure you have:
- **Whiteout AI Admin** privileges
- An **Azure subscription** with Microsoft Sentinel enabled on a Log Analytics workspace
- **Azure AD** permissions to create app registrations (Application Administrator or Global Administrator role)
- **Contributor** or **Monitoring Metrics Publisher** role on the target Log Analytics workspace
- Familiarity with Azure Data Collection Rules and Data Collection Endpoints

---

## Third-Party Setup

### Step 1: Create a Log Analytics Custom Table

Define a custom table in your Log Analytics workspace to store Whiteout AI events:

1. Log in to the [Azure Portal](https://portal.azure.com)
2. Navigate to your **Log Analytics workspace**
3. Under **Settings**, select **Tables**
4. Click **Create** > **New custom log (DCR-based)**
5. Configure the table:

| Field | Recommended Value |
|-------|-------------------|
| **Table Name** | `WhiteoutAI_CL` |
| **Data Collection Rule** | Create new (configured in Step 3) |

6. Define the table schema with columns matching Whiteout AI event fields (e.g., `TimeGenerated`, `EventType`, `UserEmail`, `Action`, `PolicyName`, `RiskLevel`, `Details`)

### Step 2: Create a Data Collection Endpoint (DCE)

1. In the Azure Portal, search for **Data Collection Endpoints**
2. Click **Create**
3. Configure the endpoint:

| Field | Value |
|-------|-------|
| **Name** | `whiteout-ai-dce` |
| **Subscription** | Your subscription |
| **Resource Group** | Your resource group |
| **Region** | Same region as your Log Analytics workspace |

4. Click **Review + Create**, then **Create**
5. After creation, open the DCE resource and copy the **Logs ingestion endpoint URL** (e.g., `https://whiteout-ai-dce-xxxx.eastus-1.ingest.monitor.azure.com`)

### Step 3: Create a Data Collection Rule (DCR)

1. In the Azure Portal, search for **Data Collection Rules**
2. Click **Create**
3. On the **Basics** tab:

| Field | Value |
|-------|-------|
| **Rule Name** | `whiteout-ai-dcr` |
| **Subscription** | Your subscription |
| **Resource Group** | Your resource group |
| **Region** | Same region as your Log Analytics workspace |
| **Data Collection Endpoint** | Select `whiteout-ai-dce` from Step 2 |

4. Configure the **Resources** tab (add any monitored resources, or skip if using direct API ingestion)
5. On the **Collect and Deliver** tab, add a data source:
   - **Data Source Type**: Custom
   - **Destination**: Select your Log Analytics workspace and target `WhiteoutAI_CL` table
6. Click **Review + Create**, then **Create**
7. After creation, open the DCR resource and copy the **Immutable ID** from the **Overview** page (e.g., `dcr-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 4: Register an Azure AD Application

Create a service principal for Whiteout AI to authenticate:

1. Navigate to **Azure Active Directory** > **App registrations**
2. Click **New registration**
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI Event Ingestion` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI** | Leave blank |

4. Click **Register**
5. On the app's **Overview** page, copy:
   - **Application (client) ID**
   - **Directory (tenant) ID**

### Step 5: Create a Client Secret

1. In the app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Configure:

| Field | Value |
|-------|-------|
| **Description** | `Whiteout AI DCR ingestion` |
| **Expires** | 24 months (or per your security policy) |

4. Click **Add**
5. Copy the **Secret Value** immediately (it will not be shown again)

### Step 6: Assign Permissions to the DCR

Grant the service principal permission to publish data through the DCR:

1. Navigate to the Data Collection Rule created in Step 3
2. Go to **Access control (IAM)**
3. Click **Add** > **Add role assignment**
4. Select the role **Monitoring Metrics Publisher**
5. Under **Members**, select **User, group, or service principal**
6. Search for and select `Whiteout AI Event Ingestion` (the app from Step 4)
7. Click **Review + assign**

---

## Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **SOC/SIEM Destinations**
3. Click **Add Destination** and select **Azure Sentinel**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **DCE Endpoint** | Data Collection Endpoint URL (`dce_endpoint`) |
| **DCR ID** | Data Collection Rule immutable ID (`dcr_id`) |
| **Client ID** | Azure AD application (service principal) Client ID (`client_id`) |
| **Client Secret** | Azure AD application Client Secret (`client_secret`) |
| **Tenant ID** | Azure AD Tenant ID (`tenant_id`) |
| **Table Name** | Target Log Analytics custom table, e.g. `WhiteoutAI_CL` (`table_name`) |

5. Click **Save & Test Connection**

---

## Verification

Test your Azure Sentinel destination:

1. **Connection Test**: Click **Test Connection** in the destination settings. Whiteout AI will attempt to authenticate and send a test event through the DCR.
2. **Log Analytics Query**: In the Azure Portal, navigate to your Log Analytics workspace and run:
   ```kql
   WhiteoutAI_CL
   | take 10
   | order by TimeGenerated desc
   ```
3. **Ingestion Latency**: Note that Log Analytics ingestion can take 2-5 minutes. Allow time before querying.
4. **End-to-End Test**: Trigger an auditable action in Whiteout AI and verify it appears in Log Analytics.
5. **Sentinel Incidents**: If you have analytics rules configured, verify that matching events trigger incidents in Sentinel.

---

## Troubleshooting

### Authentication Errors

- Verify the **Client ID**, **Client Secret**, and **Tenant ID** are correct
- Confirm the client secret has not expired
- Ensure the app registration is in the correct Azure AD tenant

### "Forbidden" or "Authorization" Errors

- Verify the service principal has been assigned the **Monitoring Metrics Publisher** role on the DCR
- Allow up to 10 minutes for role assignments to propagate
- Check that the DCR immutable ID is correct (not the resource ID)

### Events Not Appearing in Log Analytics

- Confirm the DCE endpoint URL is correct and reachable
- Verify the DCR is correctly linked to the DCE and the target table
- Check the table schema matches the event payload structure
- Review **Azure Monitor** > **Data Collection Rules** > **Metrics** for ingestion errors

### Table Schema Mismatch

- Ensure the custom table columns match the fields in the Whiteout AI event payload
- The `TimeGenerated` column is required and must be in ISO 8601 format
- Update the table schema if new event fields have been added

### Network Connectivity Issues

- Verify that Whiteout AI can reach the DCE endpoint over HTTPS (port 443)
- If using private endpoints, ensure DNS resolution and routing are correctly configured
- Check Azure Network Security Groups and firewalls

---

## Security Considerations

- **Use Short-Lived Secrets**: Set client secret expiry to the shortest acceptable duration and rotate before expiration. Consider using certificate-based authentication for stronger security.
- **Principle of Least Privilege**: Assign only the **Monitoring Metrics Publisher** role to the service principal, scoped to the specific DCR resource, not the subscription or resource group.
- **Network Restrictions**: If possible, configure the DCE with private endpoints to restrict access to your virtual network.
- **Monitor Service Principal Activity**: Enable Azure AD sign-in logs and audit logs to monitor the service principal's activity for anomalies.
- **Protect Credentials**: Store the client secret securely. Never commit it to version control or share it in plain text.
- **Audit Role Assignments**: Periodically review IAM role assignments on the DCR to ensure no unauthorized principals have been granted access.
- **Enable Sentinel Analytics**: Create analytics rules on the `WhiteoutAI_CL` table to detect suspicious AI usage patterns, policy violations, and potential data exfiltration attempts.
