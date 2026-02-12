# VMware Workspace ONE MDM Setup Guide

This guide walks you through connecting VMware Workspace ONE (formerly AirWatch) to Whiteout AI, enabling cross-platform device compliance management and automated deployment of AI governance agents.

## Overview

The VMware Workspace ONE integration allows Whiteout AI to:
- Query device inventory and compliance status across Windows, macOS, iOS, and Android
- Deploy the Whiteout AI Desktop Guard and browser extension to managed devices
- Enforce AI governance policies based on Workspace ONE compliance state
- Sync organization groups and Smart Groups for targeted policy enforcement

## Prerequisites

Before you begin, ensure you have:
- **VMware Workspace ONE UEM** console access
- **Administrator** role with API access permissions
- **Whiteout AI Admin** privileges
- Devices enrolled in Workspace ONE UEM

---

## Setup Process

### Step 1: Enable API Access in Workspace ONE

1. Log in to your Workspace ONE UEM console
2. Navigate to **Groups & Settings** > **All Settings** > **System** > **Advanced** > **API** > **REST API**
3. Ensure the REST API is **Enabled**

### Step 2: Generate an API Key

1. In the REST API settings, click **Add**
2. Configure the API key:

| Field | Value |
|-------|-------|
| **Service** | `Whiteout AI Integration` |
| **Description** | REST API key for Whiteout AI MDM integration |
| **Account Type** | Admin |

3. Click **Save**
4. Copy the generated **API Key**

### Step 3: Create a Service Account

1. Navigate to **Accounts** > **Administrators** > **List View**
2. Click **Add** > **Add Admin**
3. Configure the account:

| Field | Value |
|-------|-------|
| **Username** | `whiteout-ai-service` |
| **Password** | Generate a strong password |
| **Role** | API role with read access to devices and groups |

4. Click **Save**

### Step 4: Note Your Console URL

Your Workspace ONE UEM console URL is typically:
- `https://asXXXX.awmdm.com` (SaaS)
- `https://uem.yourcompany.com` (on-premise)

### Step 5: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **MDM Providers**
3. Find **VMware Workspace ONE** and click **Connect**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **Server URL** | Workspace ONE UEM console URL |
| **API Key** | REST API key from Step 2 |
| **Username** | Service account username from Step 3 |
| **Password** | Service account password from Step 3 |

5. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Deploy Whiteout AI Desktop Guard

1. In Whiteout AI, go to **Settings** > **MDM Providers** > **Workspace ONE** > **Deploy**
2. Select the target platform (Windows or macOS)
3. Whiteout AI will push an application to Workspace ONE that includes:
   - The Desktop Guard installer
   - Pre-configuration with your Whiteout AI endpoint
4. Choose the target Organization Group or Smart Group
5. Confirm the deployment

### Organization Group Mapping

Map Workspace ONE Organization Groups to Whiteout AI governance policies:

| Example Organization Group | Whiteout AI Policy |
|----------------------------|-------------------|
| Global | Standard AI governance |
| Engineering | Permissive AI governance |
| Finance | Strict AI governance |
| Contractors | Restricted AI governance |

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection** in the MDM provider settings
2. **Device Sync**: Verify enrolled devices appear in the Whiteout AI device inventory
3. **Group Sync**: Confirm Organization Groups and Smart Groups are visible
4. **Compliance Status**: Check that device compliance statuses are reflected correctly
5. **Deployment Test**: Deploy the Desktop Guard to a test group and verify installation

---

## Troubleshooting

### "401 Unauthorized" Error

- Verify the API Key, Username, and Password are correct
- Ensure the service account is active and not locked
- Check that the REST API is enabled in the console settings
- Confirm the server URL is correct (include `https://`)

### Devices Not Appearing

- Confirm devices are enrolled in Workspace ONE
- Verify the service account has read access to devices
- Allow up to 10 minutes for the initial device sync

### API Key Issues

- API keys can be revoked or regenerated in the REST API settings
- Ensure the key is associated with the correct Organization Group
- Check that the API key has not expired

---

## Security Considerations

- **Password Rotation**: Rotate the service account password regularly (recommended: every 90 days)
- **Least Privilege**: Grant only the minimum API permissions needed
- **Dedicated Account**: Use a dedicated service account for Whiteout AI
- **Network Security**: For on-premise deployments, ensure the console is accessible from Whiteout AI's network
- **Audit Logging**: Monitor Workspace ONE admin audit logs for API activity
