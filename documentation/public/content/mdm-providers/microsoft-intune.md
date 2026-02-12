# Microsoft Intune MDM Setup Guide

This guide walks you through connecting Microsoft Intune to Whiteout AI, enabling device compliance enforcement and automated deployment of AI governance agents across your managed fleet.

## Overview

The Microsoft Intune integration allows Whiteout AI to:
- Query device compliance status for enrolled Windows, macOS, iOS, and Android devices
- Automatically deploy the Whiteout AI browser extension via Intune app management
- Push the Whiteout AI Desktop Guard to managed endpoints
- Enforce conditional access policies based on AI governance compliance
- Sync device inventory and user-device assignments

## Prerequisites

Before you begin, ensure you have:
- **Microsoft Intune** subscription (standalone or as part of Microsoft 365 E3/E5)
- **Azure Active Directory** Global Administrator or Intune Administrator role
- **Whiteout AI Admin** privileges
- Devices enrolled in Microsoft Intune

---

## Setup Process

### Step 1: Register an Application in Azure AD

1. Log in to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Enter application details:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI - Intune Integration` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI** | Web: `https://your-whiteout-instance.com/api/integrations/intune/callback` |

5. Click **Register**
6. On the overview page, copy the **Application (client) ID** and the **Directory (tenant) ID**

### Step 2: Create a Client Secret

1. In your registered app, navigate to **Certificates & secrets**
2. Click **New client secret**
3. Enter a description (e.g., `Whiteout AI Integration`)
4. Select an expiration period (recommended: 24 months)
5. Click **Add**
6. Copy the **Value** immediately — it will not be shown again

### Step 3: Configure API Permissions

1. Navigate to **API permissions** in your registered app
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Application permissions** and add:

| Permission | Purpose |
|------------|---------|
| `DeviceManagementManagedDevices.Read.All` | Read device compliance and inventory |
| `DeviceManagementConfiguration.Read.All` | Read device configuration profiles |
| `DeviceManagementApps.ReadWrite.All` | Deploy apps to managed devices |
| `User.Read.All` | Read user-device assignments |
| `Group.Read.All` | Read group memberships for targeting |

4. Click **Grant admin consent for [Your Organization]**
5. Verify all permissions show a green checkmark under **Status**

### Step 4: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **MDM Providers**
3. Find **Microsoft Intune** and click **Connect**
4. Enter the following credentials:

| Field | Description |
|-------|-------------|
| **Tenant ID** | Azure AD Tenant ID from Step 1 |
| **Client ID** | Azure AD Application Client ID from Step 1 |
| **Client Secret** | Client Secret value from Step 2 |

5. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Deploy Whiteout AI Browser Extension

1. In Whiteout AI, go to **Settings** > **MDM Providers** > **Intune** > **Deploy**
2. Select **Browser Extension** as the deployment target
3. Choose target groups or select **All Devices**
4. Whiteout AI will create the required app configuration in Intune automatically

### Deploy Whiteout AI Desktop Guard

1. In the deployment panel, select **Desktop Guard**
2. Choose the target platform (Windows or macOS)
3. Select target device groups
4. Confirm the deployment

### Compliance Policy Integration

Configure Intune compliance policies to check for Whiteout AI:

1. In the [Intune admin center](https://intune.microsoft.com), go to **Devices** > **Compliance policies**
2. Create a new compliance policy
3. Add a custom compliance setting to check for the Whiteout AI agent
4. Assign the policy to your target device groups

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection** in the MDM provider settings
2. **Device Sync**: Verify that enrolled devices appear in the Whiteout AI device inventory
3. **Compliance Query**: Confirm device compliance statuses are reflected correctly
4. **Deployment Test**: Deploy the browser extension to a test group and verify installation
5. **User Mapping**: Confirm user-device assignments are syncing properly

---

## Troubleshooting

### "Unauthorized" or "Access Denied" Error

- Verify the Tenant ID, Client ID, and Client Secret are correct
- Confirm admin consent has been granted for all required API permissions
- Ensure the client secret has not expired or been rotated without updating Whiteout AI

### Devices Not Appearing

- Confirm devices are enrolled in Intune (not just Azure AD joined)
- Check that `DeviceManagementManagedDevices.Read.All` permission is granted with admin consent
- Allow up to 15 minutes for the initial device sync

### Deployment Failures

- Check that `DeviceManagementApps.ReadWrite.All` permission is granted
- Verify the target device group exists and has members
- Review the Intune app deployment status in the admin center

---

## Security Considerations

- **Secret Rotation**: Set a calendar reminder to rotate the client secret before expiration
- **Least Privilege**: Grant only the API permissions listed above
- **Dedicated App Registration**: Use a dedicated app registration for Whiteout AI rather than reusing an existing one
- **Audit Logging**: Monitor Azure AD sign-in logs for the Whiteout AI service principal
- **Conditional Access**: Consider restricting the app registration's API access by IP range
