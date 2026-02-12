# Jamf MDM Setup Guide

This guide walks you through connecting Jamf Pro to Whiteout AI, enabling Apple device compliance management and automated deployment of AI governance agents.

## Overview

The Jamf integration allows Whiteout AI to:
- Query device inventory and compliance status for macOS and iOS devices
- Deploy the Whiteout AI Desktop Guard through Jamf's package management
- Push browser extension configurations to managed Macs
- Enforce AI governance policies based on Jamf device compliance
- Sync Jamf Smart Groups for targeted policy enforcement

## Prerequisites

Before you begin, ensure you have:
- **Jamf Pro** instance (cloud or on-premise)
- **Jamf Pro Administrator** access
- **Whiteout AI Admin** privileges
- Devices enrolled in Jamf Pro via Automated Device Enrollment (ADE) or manual enrollment

---

## Setup Process

### Step 1: Create API Credentials in Jamf Pro

Jamf Pro supports API Roles and Clients for secure server-to-server authentication.

1. Log in to your Jamf Pro instance
2. Navigate to **Settings** > **System** > **API Roles and Clients**
3. Click the **API Roles** tab and create a new role:

| Field | Value |
|-------|-------|
| **Display Name** | `Whiteout AI Integration` |

4. Grant the following privileges:

| Privilege | Purpose |
|-----------|---------|
| Read Computers | Query macOS device inventory |
| Read Mobile Devices | Query iOS/iPadOS device inventory |
| Read Smart Computer Groups | Sync device groups |
| Read Smart Mobile Device Groups | Sync mobile device groups |
| Create Packages | Deploy Desktop Guard (optional) |
| Create macOS Configuration Profiles | Deploy browser extension config (optional) |

5. Click **Save**

### Step 2: Create an API Client

1. Click the **API Clients** tab
2. Click **New**
3. Configure the client:

| Field | Value |
|-------|-------|
| **Display Name** | `Whiteout AI` |
| **API Role** | Select the role from Step 1 |
| **Access Token Lifetime** | 30 minutes (default) |
| **Enable Client** | Checked |

4. Click **Save**
5. Copy the **Client ID** and generate a **Client Secret** — store both securely

### Step 3: Note Your Jamf Pro URL

Your Jamf Pro server URL is typically:
- **Cloud**: `https://yourcompany.jamfcloud.com`
- **On-premise**: `https://jamf.yourcompany.com`

### Step 4: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **MDM Providers**
3. Find **Jamf** and click **Connect**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **Server URL** | Jamf Pro server URL, e.g. `https://yourcompany.jamfcloud.com` |
| **Client ID** | Jamf Pro API Client ID from Step 2 |
| **Client Secret** | Jamf Pro API Client Secret from Step 2 |

5. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Deploy Whiteout AI Desktop Guard

1. In Whiteout AI, go to **Settings** > **MDM Providers** > **Jamf** > **Deploy**
2. Select **Desktop Guard (macOS)** as the deployment target
3. Whiteout AI will push a package and policy to Jamf that:
   - Uploads the Desktop Guard installer
   - Creates a policy scoped to your target Smart Group
4. Choose the target Smart Group for deployment
5. Confirm the deployment

### Deploy Browser Extension Configuration

1. In the deployment panel, select **Browser Extension**
2. Whiteout AI will create a macOS Configuration Profile that:
   - Force-installs the Chrome extension via managed preferences
   - Configures the extension with your Whiteout AI organization endpoint
3. Assign the profile to the target Smart Group

### Smart Group Mapping

Map Jamf Smart Groups to Whiteout AI governance policies:

| Example Smart Group | Whiteout AI Policy |
|---------------------|-------------------|
| All Managed Macs | Standard AI governance |
| Engineering Department | Permissive AI governance |
| Finance Department | Strict AI governance |
| Shared Devices | Restricted AI governance |

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection** in the MDM provider settings
2. **Device Sync**: Verify that enrolled Macs and iOS devices appear in the Whiteout AI device inventory
3. **Group Sync**: Confirm Jamf Smart Groups are visible in Whiteout AI
4. **Compliance Status**: Check that device compliance statuses are reflected correctly
5. **Deployment Test**: Deploy the Desktop Guard to a test Smart Group and verify installation

---

## Troubleshooting

### "401 Unauthorized" Error

- Verify the Client ID and Client Secret are correct
- Ensure the API Client is enabled in Jamf Pro
- Check that the server URL is correct (include `https://`)
- Confirm the API Role has the required privileges

### Devices Not Appearing

- Confirm devices are enrolled in Jamf Pro (check **Computers** in the Jamf console)
- Verify the API Role has Read Computers and Read Mobile Devices privileges
- Allow up to 10 minutes for the initial device sync

### Deployment Failures

- Ensure the API Role has Create Packages and Create Policies privileges
- Verify the target Smart Group exists and has members
- Check Jamf Pro policy logs for installation errors

---

## Security Considerations

- **Secret Rotation**: Rotate the Client Secret periodically (recommended: every 6 months)
- **Least Privilege**: Grant only the API Role privileges listed above
- **Dedicated Client**: Use a dedicated API Client for Whiteout AI
- **Network Security**: For on-premise Jamf Pro, ensure the instance is accessible from Whiteout AI's network
- **Audit Logging**: Monitor Jamf Pro audit logs for API activity
