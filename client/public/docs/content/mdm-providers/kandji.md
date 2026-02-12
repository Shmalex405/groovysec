# Kandji MDM Setup Guide

This guide walks you through connecting Kandji to Whiteout AI, enabling Apple device compliance management and automated deployment of AI governance agents.

## Overview

The Kandji integration allows Whiteout AI to:
- Query device inventory and compliance status for macOS and iOS devices
- Deploy the Whiteout AI Desktop Guard via Kandji's Auto App library
- Push browser extension configurations to managed Macs
- Enforce AI governance policies based on Kandji device compliance
- Sync Kandji Blueprints for targeted policy enforcement

## Prerequisites

Before you begin, ensure you have:
- **Kandji** subscription
- **Kandji Administrator** access
- **Whiteout AI Admin** privileges
- Devices enrolled in Kandji via Automated Device Enrollment (ADE)

---

## Setup Process

### Step 1: Generate an API Token in Kandji

1. Log in to your Kandji web app
2. Navigate to **Settings** > **Access** > **API Token**
3. Click **Add Token**
4. Configure the token:

| Field | Value |
|-------|-------|
| **Token Name** | `Whiteout AI Integration` |
| **Description** | API token for Whiteout AI MDM integration |

5. Under **Permissions**, enable the following:

| Permission | Access Level |
|------------|-------------|
| Device list | Read |
| Device details | Read |
| Device actions | Write (optional, for deployment) |
| Blueprints | Read |
| Custom apps | Read, Write (for deployment) |

6. Click **Create**
7. Copy the **API Token** immediately — it will only be displayed once

### Step 2: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **MDM Providers**
3. Find **Kandji** and click **Connect**
4. Enter the following credential:

| Field | Description |
|-------|-------------|
| **API Key** | Kandji API token from Step 1 |

5. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Deploy Whiteout AI Desktop Guard

1. In Whiteout AI, go to **Settings** > **MDM Providers** > **Kandji** > **Deploy**
2. Select **Desktop Guard (macOS)** as the deployment target
3. Whiteout AI will push a Custom App to Kandji that includes:
   - The Desktop Guard installer package
   - Pre-install configuration with your Whiteout AI endpoint
4. Choose the target Blueprint for deployment
5. Confirm the deployment

### Deploy Browser Extension Configuration

1. In the deployment panel, select **Browser Extension**
2. Whiteout AI will create a Custom Profile in Kandji that:
   - Force-installs the Chrome extension via managed preferences
   - Configures the extension with your organization endpoint
3. Assign the profile to the target Blueprint

### Blueprint Mapping

Map Kandji Blueprints to Whiteout AI governance policies:

| Example Blueprint | Whiteout AI Policy |
|-------------------|-------------------|
| Default | Standard AI governance |
| Engineering | Permissive AI governance |
| Finance | Strict AI governance |
| Shared Devices | Restricted AI governance |

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection** in the MDM provider settings
2. **Device Sync**: Verify that enrolled Mac and iOS devices appear in the Whiteout AI device inventory
3. **Blueprint Sync**: Confirm Kandji Blueprints are visible in Whiteout AI
4. **Compliance Status**: Check that device compliance statuses are reflected correctly
5. **Deployment Test**: Deploy the Desktop Guard to a test Blueprint and verify installation

---

## Troubleshooting

### "401 Unauthorized" Error

- Verify the API token is correct and has not been revoked
- Ensure the token was copied completely (no trailing spaces)
- Regenerate the token in Kandji settings if needed

### Devices Not Appearing

- Confirm devices are enrolled in Kandji
- Verify the API token has Device list and Device details read permissions
- Allow up to 10 minutes for the initial device sync

### Deployment Failures

- Ensure the API token has Custom apps write permission
- Verify the target Blueprint exists and has assigned devices
- Check the Kandji device activity log for installation errors

### API Rate Limiting

Kandji enforces API rate limits. If you encounter rate limit errors:
- Whiteout AI automatically handles rate limiting with exponential backoff
- For large fleets (1,000+ devices), the initial sync may take longer

---

## Security Considerations

- **Token Storage**: Whiteout AI encrypts the API token at rest
- **Token Rotation**: Establish a manual rotation schedule (recommended: every 6 months) since Kandji tokens do not expire automatically
- **Dedicated Token**: Use a dedicated API token for Whiteout AI
- **Least Privilege**: Grant only the permissions listed above; restrict to read-only if deployment features are not needed
- **Audit Logging**: Kandji maintains SOC 2 Type II compliance; API actions are logged
