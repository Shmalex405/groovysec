# GitHub Integration Setup Guide

This guide walks you through connecting GitHub to Whiteout AI, enabling governance and compliance monitoring for your source code repositories.

## Overview

The GitHub integration allows Whiteout AI to:
- Monitor repository access and activity
- Scan code and comments for sensitive data
- Enforce compliance policies on code-related AI queries
- Track which repositories users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **GitHub Organization Admin** access (for organization-wide integration)
- **Whiteout AI Admin** privileges
- Access to create GitHub Apps or OAuth Apps in your organization

## Setup Options

You can connect GitHub using one of two methods:

### Option A: GitHub App (Recommended)

GitHub Apps provide fine-grained permissions and are the recommended approach for enterprise use.

### Option B: OAuth App

OAuth Apps are simpler to set up but provide broader access.

---

## Option A: GitHub App Setup

### Step 1: Create a GitHub App

1. Navigate to your GitHub organization settings
2. Go to **Settings** > **Developer settings** > **GitHub Apps**
3. Click **New GitHub App**

### Step 2: Configure Basic Information

Fill in the following fields:

| Field | Value |
|-------|-------|
| **GitHub App name** | `Whiteout AI - [Your Org Name]` |
| **Homepage URL** | `https://your-whiteout-instance.com` |
| **Callback URL** | `https://your-whiteout-instance.com/api/integrations/github/callback` |
| **Setup URL** (optional) | Leave blank |
| **Webhook URL** | `https://your-whiteout-instance.com/api/integrations/github/webhook` |
| **Webhook secret** | Generate a secure random string (save this for later) |

### Step 3: Set Permissions

Configure the following repository permissions:

| Permission | Access Level | Purpose |
|------------|--------------|---------|
| **Contents** | Read-only | Read repository files and code |
| **Metadata** | Read-only | Access repository metadata |
| **Pull requests** | Read-only | Monitor PR activity |
| **Issues** | Read-only | Track issue discussions |
| **Commit statuses** | Read-only | View CI/CD status |

Configure organization permissions:

| Permission | Access Level | Purpose |
|------------|--------------|---------|
| **Members** | Read-only | Sync organization members |
| **Administration** | Read-only | Access org settings |

### Step 4: Subscribe to Events

Enable the following webhook events:
- `push` - Code push events
- `pull_request` - PR activity
- `repository` - Repository changes
- `member` - Membership changes
- `organization` - Org-level events

### Step 5: Create the App

1. Under "Where can this GitHub App be installed?", select **Only on this account**
2. Click **Create GitHub App**
3. Note the **App ID** displayed on the confirmation page

### Step 6: Generate Private Key

1. On the GitHub App page, scroll to **Private keys**
2. Click **Generate a private key**
3. Save the downloaded `.pem` file securely

### Step 7: Install the App

1. On the GitHub App page, click **Install App** in the sidebar
2. Select your organization
3. Choose **All repositories** or **Only select repositories**
4. Click **Install**

### Step 8: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **GitHub** and click **Connect**
4. Enter the following credentials:

| Field | Value |
|-------|-------|
| **App ID** | The App ID from Step 5 |
| **Private Key** | Contents of the `.pem` file from Step 6 |
| **Webhook Secret** | The webhook secret from Step 2 |
| **Installation ID** | Found in the URL after installing (`/installations/XXXXX`) |

5. Click **Save & Test Connection**

---

## Option B: OAuth App Setup

### Step 1: Create OAuth App in GitHub

1. Go to your organization's GitHub settings
2. Navigate to **Settings** > **Developer settings** > **OAuth Apps**
3. Click **New OAuth App**

### Step 2: Configure OAuth App

| Field | Value |
|-------|-------|
| **Application name** | `Whiteout AI` |
| **Homepage URL** | `https://your-whiteout-instance.com` |
| **Authorization callback URL** | `https://your-whiteout-instance.com/api/integrations/github/oauth/callback` |

### Step 3: Get Credentials

1. After creating the app, note the **Client ID**
2. Click **Generate a new client secret**
3. Copy and securely store the **Client Secret** (it won't be shown again)

### Step 4: Configure Whiteout AI

1. In Whiteout AI, go to **Settings** > **Data Integrations** > **GitHub**
2. Select **OAuth App** as the connection method
3. Enter:
   - **Client ID**: From Step 3
   - **Client Secret**: From Step 3
4. Click **Authorize with GitHub**
5. Review and approve the requested permissions

---

## Post-Setup Configuration

### Repository Selection

After connecting, configure which repositories Whiteout AI monitors:

1. Go to **Settings** > **Data Integrations** > **GitHub** > **Configure**
2. Select **Repositories** tab
3. Choose:
   - **All repositories**: Monitor all current and future repositories
   - **Selected repositories**: Choose specific repositories to monitor

### Sync Settings

Configure how often Whiteout AI syncs with GitHub:

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete repository re-index |
| **Incremental sync** | 15 minutes | Process new events |
| **Webhook processing** | Real-time | Immediate event handling |

### Compliance Rules

Set up GitHub-specific compliance rules:

1. Navigate to **Policies** > **Data Source Rules**
2. Create rules for:
   - Detecting secrets in code references
   - Flagging references to private repositories
   - Alerting on sensitive file path mentions

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection** in integration settings
2. **Repository List**: Verify repositories appear in the **Data Sources** section
3. **Webhook Test**: Make a test commit and verify it appears in activity logs
4. **Query Test**: Use the AI assistant to ask about a repository and confirm context is provided

---

## Troubleshooting

### "Invalid credentials" Error

- Verify the App ID and Installation ID are correct
- Ensure the private key file is complete and unmodified
- Check that the app is installed on the organization

### Webhooks Not Received

- Verify the webhook URL is publicly accessible
- Check that the webhook secret matches in both GitHub and Whiteout AI
- Review GitHub's webhook delivery logs for errors

### Missing Repositories

- Confirm the app has access to the repositories (check installation settings)
- Verify repository permissions include "Contents: Read"
- Try triggering a manual sync

### Rate Limiting

GitHub has API rate limits. If you see rate limit errors:
- Enable incremental syncing to reduce API calls
- Consider using a GitHub Enterprise account for higher limits
- Reduce sync frequency for large organizations

---

## Security Considerations

- **Private Key Storage**: Store the GitHub App private key securely; it provides full app access
- **Webhook Secrets**: Always use webhook secrets to verify payload authenticity
- **Permission Scope**: Request only the minimum permissions needed
- **Token Rotation**: Rotate OAuth tokens and private keys periodically
- **Audit Logs**: Regularly review GitHub audit logs for integration activity

---

## Revoking Access

To disconnect the integration:

1. In Whiteout AI: **Settings** > **Data Integrations** > **GitHub** > **Disconnect**
2. In GitHub: **Settings** > **Applications** > Uninstall the Whiteout AI app
3. Delete any stored credentials and rotate secrets if necessary
