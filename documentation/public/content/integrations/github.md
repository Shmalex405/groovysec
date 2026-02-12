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
- **GitHub** account with access to the repositories you want to monitor
- **Whiteout AI Admin** privileges

---

## Setup Process

### Step 1: Generate a Personal Access Token

1. Go to [GitHub](https://github.com) and log in
2. Navigate to **Settings** > **Developer settings** > **Personal access tokens** > **Fine-grained tokens**
3. Click **Generate new token**
4. Configure the token:

| Field | Value |
|-------|-------|
| **Token name** | `Whiteout AI Integration` |
| **Expiration** | Set as appropriate for your security policy |
| **Repository access** | Select the repositories to monitor |

5. Under **Permissions**, grant the following repository permissions:

| Permission | Access Level | Purpose |
|------------|--------------|---------|
| **Contents** | Read-only | Read repository files and code |
| **Metadata** | Read-only | Access repository metadata |
| **Pull requests** | Read-only | Monitor PR activity |
| **Issues** | Read-only | Track issue discussions |

6. Click **Generate token**
7. Copy the generated token (starts with `ghp_...`) and store it securely

### Step 2: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **GitHub** and click **Connect**
4. Enter the following credential:

| Field | Value |
|-------|-------|
| **Personal Access Token** | The `ghp_...` token from Step 1 |

5. Click **Save & Test Connection**

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

- Verify the Personal Access Token is correct and complete
- Ensure the token has not expired or been revoked
- Check that the token has the required repository permissions

### Missing Repositories

- Confirm the token has access to the repositories (check fine-grained token settings)
- Verify repository permissions include "Contents: Read"
- Try triggering a manual sync

### Rate Limiting

GitHub has API rate limits. If you see rate limit errors:
- Enable incremental syncing to reduce API calls
- Consider using a GitHub Enterprise account for higher limits
- Reduce sync frequency for large organizations

---

## Security Considerations

- **Token Storage**: Store the Personal Access Token securely; it provides access to your repositories
- **Permission Scope**: Request only the minimum permissions needed via fine-grained token settings
- **Token Rotation**: Rotate the Personal Access Token periodically and before expiration
- **Audit Logs**: Regularly review GitHub audit logs for integration activity

---

## Revoking Access

To disconnect the integration:

1. In Whiteout AI: **Settings** > **Data Integrations** > **GitHub** > **Disconnect**
2. In GitHub: **Settings** > **Developer settings** > **Personal access tokens** > Revoke the token
3. Rotate any shared secrets if necessary
