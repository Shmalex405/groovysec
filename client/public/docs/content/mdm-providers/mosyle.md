# Mosyle MDM Setup Guide

This guide walks you through connecting Mosyle to Whiteout AI, enabling Apple device compliance management and automated deployment of AI governance agents.

## Overview

The Mosyle integration allows Whiteout AI to:
- Query device inventory and compliance status for macOS and iOS devices
- Deploy the Whiteout AI Desktop Guard through Mosyle's application management
- Push browser extension configurations to managed Macs
- Enforce AI governance policies based on Mosyle device compliance
- Sync Mosyle device groups and tags for targeted policy enforcement

## Prerequisites

Before you begin, ensure you have:
- **Mosyle Business** or **Mosyle Fuse** subscription
- **Mosyle Administrator** access
- **Whiteout AI Admin** privileges
- Devices enrolled in Mosyle via Automated Device Enrollment (ADE) or manual enrollment

---

## Setup Process

### Step 1: Enable API Access in Mosyle

1. Log in to your Mosyle account at [https://manager.mosyle.com](https://manager.mosyle.com)
2. Navigate to **Organization** > **Settings** > **API Integration**
3. Enable the **API Access** toggle if not already enabled

### Step 2: Generate an API Token

1. In the API Integration settings, click **Generate New Token**
2. Configure the token:

| Field | Value |
|-------|-------|
| **Token Name** | `Whiteout AI Integration` |

3. Under **Permissions**, enable the following:

| Permission | Access Level |
|------------|-------------|
| Devices | Read |
| Device Groups | Read |
| Applications | Read, Write (for deployment) |
| Profiles | Read, Write (for extension deployment) |
| Users | Read |
| Tags | Read |

4. Click **Generate**
5. Copy the **API Token** immediately — it will only be displayed once

### Step 3: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **MDM Providers**
3. Find **Mosyle** and click **Connect**
4. Enter the following credential:

| Field | Description |
|-------|-------------|
| **API Key** | Mosyle API token from Step 2 |

5. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Deploy Whiteout AI Desktop Guard

1. In Whiteout AI, go to **Settings** > **MDM Providers** > **Mosyle** > **Deploy**
2. Select **Desktop Guard (macOS)** as the deployment target
3. Whiteout AI will push a Custom App to Mosyle that includes:
   - The Desktop Guard installer package
   - Pre-install configuration with your Whiteout AI endpoint
4. Choose the target device group for deployment
5. Confirm the deployment

### Deploy Browser Extension Configuration

1. In the deployment panel, select **Browser Extension**
2. Whiteout AI will create a management profile in Mosyle that:
   - Force-installs the Chrome extension via managed preferences
   - Configures the extension with your organization endpoint
3. Assign the profile to the target device group

### Device Group Mapping

Map Mosyle device groups to Whiteout AI governance policies:

| Example Device Group | Whiteout AI Policy |
|----------------------|-------------------|
| All Devices | Standard AI governance |
| Engineering Team | Permissive AI governance |
| Finance Department | Strict AI governance |
| Shared Devices | Restricted AI governance |

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection** in the MDM provider settings
2. **Device Sync**: Verify that enrolled devices appear in the Whiteout AI device inventory
3. **Group Sync**: Confirm Mosyle device groups are visible in Whiteout AI
4. **Compliance Status**: Check that device compliance statuses are reflected correctly
5. **Deployment Test**: Deploy the Desktop Guard to a test device group and verify installation

---

## Troubleshooting

### "401 Unauthorized" Error

- Verify the API token is correct and has not been revoked
- Ensure the token was copied completely
- Check that API access is still enabled in **Organization** > **Settings** > **API Integration**
- Regenerate the token if needed and update Whiteout AI

### Devices Not Appearing

- Confirm devices are enrolled in Mosyle
- Verify the API token has Devices: Read permission
- Allow up to 10 minutes for the initial device sync

### Deployment Failures

- Ensure the API token has Applications: Write permission
- Verify the target device group exists and has assigned devices
- Check the Mosyle console for installation errors

### API Rate Limiting

If you encounter rate limit errors:
- Whiteout AI automatically handles rate limiting with retry logic
- For large device fleets, the initial sync may take additional time

---

## Security Considerations

- **Token Storage**: Whiteout AI encrypts the API token at rest
- **Token Rotation**: Establish a regular rotation schedule (recommended: every 6 months)
- **Dedicated Token**: Use a dedicated API token for Whiteout AI
- **Least Privilege**: Grant only the permissions listed above; restrict to read-only if deployment features are not needed
- **Network Security**: Mosyle's API is served exclusively over HTTPS with TLS 1.2+
- **Audit Logging**: Mosyle maintains SOC 2 compliance; API activity is logged
