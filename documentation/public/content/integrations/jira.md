# Jira Integration Setup Guide

This guide walks you through connecting Atlassian Jira to Whiteout AI, enabling governance and compliance monitoring for your project management and issue tracking.

## Overview

The Jira integration allows Whiteout AI to:
- Monitor issue content and project activity
- Detect sensitive information in tickets and comments
- Enforce compliance policies on project-related AI queries
- Track which Jira issues users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Jira Admin** access to your Atlassian workspace
- **Whiteout AI Admin** privileges
- Jira Cloud, Data Center, or Server instance

## Setup Methods

| Deployment | Recommended Method |
|------------|-------------------|
| Jira Cloud | OAuth 2.0 (3LO) |
| Jira Data Center | API Token or Personal Access Token |
| Jira Server | API Token or Basic Auth |

---

## Jira Cloud Setup (OAuth 2.0)

### Step 1: Create an OAuth App in Atlassian

1. Go to [Atlassian Developer Console](https://developer.atlassian.com/console/myapps/)
2. Click **Create** > **OAuth 2.0 integration**
3. Enter app details:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI Jira Integration` |
| **Description** | `Governance integration for Whiteout AI` |

### Step 2: Configure Permissions

1. In your app, go to **Permissions**
2. Click **Add** next to **Jira API**
3. Add the following scopes:

| Scope | Purpose |
|-------|---------|
| `read:jira-work` | Read issues, projects, and work data |
| `read:jira-user` | Read user information |
| `read:servicedesk-request` | Read service desk requests (if using JSM) |

4. Click **Save changes**

### Step 3: Configure Authorization

1. Go to **Authorization**
2. Click **Add** next to **OAuth 2.0 (3LO)**
3. Enter callback URL:
   ```
   https://your-whiteout-instance.com/api/integrations/jira/callback
   ```
4. Click **Save changes**

### Step 4: Get Credentials

1. Go to **Settings** in your app
2. Copy:
   - **Client ID**
   - **Client Secret**

### Step 5: Configure Whiteout AI

1. In Whiteout AI, go to **Settings** > **Data Integrations**
2. Find **Jira** and click **Connect**
3. Select **Jira Cloud**
4. Enter:

| Field | Value |
|-------|-------|
| **Client ID** | From Step 4 |
| **Client Secret** | From Step 4 |
| **Atlassian Site** | `your-domain.atlassian.net` |

5. Click **Authorize**
6. Approve access in the Atlassian authorization screen

---

## Jira Data Center/Server Setup

### Step 1: Create a Service Account

1. Log in to Jira as an administrator
2. Go to **Jira Administration** > **User Management**
3. Click **Create User**

| Field | Value |
|-------|-------|
| **Username** | `whiteout-service` |
| **Full Name** | `Whiteout AI Service Account` |
| **Email** | `whiteout-service@your-company.com` |

### Step 2: Configure Permissions

1. Go to **Jira Administration** > **Permission Schemes**
2. For each scheme used by projects you want to monitor:
   - Add the service account to a group with **Browse Projects** permission
   - Ensure **View Issue** permission is granted

**Alternative - Global Access:**
1. Add the service account to the `jira-users` group
2. Grant the group browse access to all projects

### Step 3: Generate Access Token

**For Data Center (8.14+):**
1. Log in as the service account
2. Go to **Profile** > **Personal Access Tokens**
3. Click **Create token**
4. Name: `Whiteout AI`, Expiry: Set as appropriate
5. Copy the generated token

**For Server (older versions):**
1. Use basic authentication with username/password
2. Or set up application links (see Atlassian documentation)

### Step 4: Configure Whiteout AI

1. In Whiteout AI, go to **Settings** > **Data Integrations** > **Jira**
2. Select **Data Center / Server**
3. Enter:

| Field | Value |
|-------|-------|
| **Base URL** | `https://jira.your-company.com` |
| **Username** | `whiteout-service` |
| **Access Token/Password** | From Step 3 |

4. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Project Selection

1. Go to **Settings** > **Data Integrations** > **Jira** > **Configure**
2. Select **Projects** tab
3. Choose:
   - **All projects**: Monitor all (including future) projects
   - **Selected projects**: Choose specific projects
   - **Project categories**: Select by category

### Issue Type Filtering

Configure which issue types to monitor:

| Issue Type | Recommended |
|------------|-------------|
| Bug | Yes |
| Story | Yes |
| Task | Yes |
| Epic | Yes |
| Sub-task | Optional |
| Service Request | Optional |

### Field Selection

Choose which fields to index:

| Field | Include | Notes |
|-------|---------|-------|
| Summary | Yes | Issue title |
| Description | Yes | Main content |
| Comments | Yes | Discussion history |
| Custom fields | Selective | Choose relevant fields |
| Attachments | Metadata only | File names, not content |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index |
| **Incremental sync** | 15 minutes | Recent changes only |
| **Issues per sync** | 500 | Batch size limit |

---

## Advanced Configuration

### JQL Filters

Use JQL to fine-tune which issues are indexed:

**Include filter example:**
```jql
project in (PROJ1, PROJ2) AND status != Closed AND created >= -90d
```

**Exclude filter example:**
```jql
labels not in (confidential, sensitive) AND security is EMPTY
```

### Custom Field Mapping

Map custom fields to Whiteout AI metadata:

1. Go to **Configure** > **Field Mapping**
2. Add mappings:

| Jira Field | Whiteout AI Attribute | Purpose |
|------------|----------------------|---------|
| `customfield_10001` | `department` | Classify by department |
| `customfield_10002` | `sensitivity` | Data classification |

### Webhook Configuration (Optional)

For real-time updates, configure webhooks:

1. In Jira, go to **System** > **WebHooks**
2. Create a webhook:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI` |
| **URL** | `https://your-whiteout-instance.com/api/integrations/jira/webhook` |
| **Events** | Issue: created, updated, deleted |

---

## Verification

1. **Connection Test**: Click **Test Connection**
2. **Project List**: Verify projects appear in Data Sources
3. **Issue Count**: Confirm issues are being indexed
4. **Query Test**: Ask the AI about a Jira issue

---

## Troubleshooting

### "Permission denied" Error

- Verify service account has Browse Projects permission
- Check project-level permission schemes
- Ensure the account is active and not locked

### Missing Projects

- Check project visibility settings
- Verify permission scheme assignments
- Ensure projects aren't archived

### Slow Synchronization

- Reduce the number of projects monitored
- Adjust JQL filters to limit scope
- Increase sync interval for large instances

### Rate Limiting

- Jira Cloud: Respect rate limits (avoid rapid polling)
- Reduce sync frequency
- Use webhooks for real-time updates

### SSL Certificate Errors (Server)

- Ensure valid SSL certificate
- Add certificate to Whiteout AI trust store
- Verify certificate chain is complete

---

## Security Considerations

- **Least Privilege**: Grant only Browse Projects and View Issue permissions
- **Service Account**: Never use personal accounts for integrations
- **Token Rotation**: Rotate access tokens periodically
- **Network Security**: Restrict network access if possible
- **Audit Logging**: Monitor service account activity in Jira audit logs

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Issue content | Indexed | Configurable |
| Comments | Indexed | Same as issues |
| Attachments | Metadata only | N/A |
| User info | Cached | Refreshed on sync |

---

## Revoking Access

1. In Whiteout AI: **Settings** > **Data Integrations** > **Jira** > **Disconnect**
2. In Jira:
   - **Cloud**: Revoke OAuth app access
   - **Server**: Disable service account and revoke tokens
3. Remove webhooks if configured
4. Rotate any shared secrets
