# Asana Integration Setup Guide

This guide walks you through connecting Asana to Whiteout AI, enabling governance and compliance monitoring for your work management platform.

## Overview

The Asana integration allows Whiteout AI to:
- Index and monitor workspaces, projects, and tasks
- Detect sensitive information in task content
- Enforce compliance policies on project-related AI queries
- Track which Asana content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Asana Admin** access to your organization
- **Whiteout AI Admin** privileges
- Asana Business or Enterprise plan (for advanced API features)

---

## Setup Process

### Step 1: Create an Asana App

1. Go to [Asana Developer Console](https://app.asana.com/0/my-apps)
2. Click **Create New App**
3. Configure:

| Field | Value |
|-------|-------|
| **App Name** | `Whiteout AI Integration` |
| **What kind of app?** | Internal integration |

4. Click **Create app**

### Step 2: Configure OAuth

1. In your app settings, go to **OAuth**
2. Add redirect URL:
   ```
   https://your-whiteout-instance.com/api/integrations/asana/callback
   ```
3. Note the **Client ID** and **Client Secret**

### Step 3: Set App Permissions

Configure the app's default permissions:

| Permission | Setting |
|------------|---------|
| **Read-only access** | Enabled |
| **Write access** | Disabled |

### Step 4: Install the App

1. Go to **Install your app**
2. Select your workspace
3. Click **Install**
4. Authorize the requested permissions

### Step 5: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Asana** and click **Connect**
4. Enter:

| Field | Value |
|-------|-------|
| **Personal Access Token** | The token from Step 1 below |

5. Click **Save & Test Connection**

### Generating a Personal Access Token

1. Go to [Asana Developer Console](https://app.asana.com/0/my-apps)
2. Click **Create New Personal Access Token**
3. Enter a description: `Whiteout AI Integration`
4. Click **Create Token**
5. Copy the generated token and enter it in the Whiteout AI configuration above

---

## Service Account Setup (Enterprise)

For enterprise deployments with dedicated service access:

### Step 1: Create Service Account

1. Contact Asana Enterprise support
2. Request a service account for integrations
3. Configure appropriate workspace access

### Step 2: Generate Service Account Token

1. Log in as the service account
2. Generate a Personal Access Token
3. Use this token in Whiteout AI

---

## Post-Setup Configuration

### Workspace Selection

Configure which workspaces Whiteout AI monitors:

1. Go to **Settings** > **Data Integrations** > **Asana** > **Configure**
2. Select **Workspaces** tab
3. Choose:

| Option | Description |
|--------|-------------|
| **All workspaces** | Monitor all accessible workspaces |
| **Selected workspaces** | Choose specific workspaces |
| **By team** | Select specific teams |

### Project Selection

Fine-tune project access:

| Option | Description |
|--------|-------------|
| **All projects** | Include all projects |
| **Public projects only** | Exclude private projects |
| **Selected projects** | Manually select projects |
| **By portfolio** | Select by portfolio membership |

### Content Types

Select what content to index:

| Content Type | Description | Recommended |
|--------------|-------------|-------------|
| **Task names** | Task titles | Yes |
| **Task descriptions** | Task details | Yes |
| **Comments** | Task comments | Yes |
| **Subtasks** | Child tasks | Yes |
| **Custom fields** | Project custom fields | Yes |
| **Attachments** | File attachments | Metadata only |

### Task Filters

Configure which tasks to include:

| Filter | Options |
|--------|---------|
| **Completed tasks** | Include/Exclude |
| **Archived projects** | Include/Exclude |
| **Date range** | Last N days |
| **Assignee** | Specific users |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index |
| **Incremental sync** | 30 minutes | Process changes |
| **Historical depth** | 90 days | How far back to index |

---

## Advanced Configuration

### Custom Field Mapping

Map Asana custom fields to Whiteout AI:

| Asana Custom Field | Whiteout AI Attribute | Purpose |
|-------------------|----------------------|---------|
| Priority | `priority` | Task prioritization |
| Classification | `sensitivity` | Data classification |
| Department | `department` | Organizational mapping |

### Tag-Based Filtering

Use Asana tags to control indexing:

1. Create tags in Asana:
   - `confidential` - Exclude from indexing
   - `public` - Always include
   - `sensitive` - Flag for review

2. Configure in Whiteout AI:
   ```
   Exclude tags: confidential, internal-only
   Include tags: (all by default)
   ```

### Webhook Configuration

For real-time updates:

1. Go to **Configure** > **Webhooks**
2. Enable webhook notifications
3. Configure webhook filters:
   - Task created
   - Task updated
   - Task completed
   - Comment added

**Webhook URL:**
```
https://your-whiteout-instance.com/api/integrations/asana/webhook
```

### Section Filtering

Filter by project sections:

| Section Pattern | Action |
|-----------------|--------|
| `Done` | Exclude |
| `In Progress` | Include |
| `Confidential` | Exclude |

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **Workspace Discovery**: Verify workspaces appear
3. **Project List**: Check projects are discovered
4. **Task Access**: Confirm tasks are being indexed
5. **Query Test**: Ask the AI about Asana task content

---

## Troubleshooting

### "Invalid token" Error

- Verify the OAuth credentials or PAT is correct
- Check that the token hasn't expired
- Ensure the app is still installed in the workspace
- For OAuth, verify redirect URL matches exactly

### Missing Workspaces

- Confirm the authenticating user has workspace access
- Check organization membership
- Verify workspace isn't deactivated

### No Tasks Appearing

- Check project visibility settings
- Verify task filters aren't too restrictive
- Ensure projects contain tasks
- Review completed task filter settings

### Rate Limiting

Asana has API rate limits:
- 1,500 requests per minute per user
- Higher limits for Enterprise

To manage limits:
- Use webhooks for real-time updates
- Increase sync intervals
- Reduce number of projects monitored

### Webhook Issues

- Verify webhook URL is publicly accessible
- Check HTTPS certificate is valid
- Ensure webhooks are enabled in Asana
- Review Asana webhook delivery logs

---

## Security Considerations

### Token Security

- Store tokens encrypted at rest
- Use OAuth over PAT for production
- Rotate tokens periodically
- Limit token scope where possible

### Access Scope

- PAT inherits user's full access
- Use service accounts for consistent access
- Review project permissions regularly
- Audit which content is accessible

### Sensitive Data

- Be aware of sensitive data in tasks
- Use tags to mark confidential content
- Configure exclusion rules
- Regular audit of task content

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Task content | Indexed | Configurable |
| Comments | Indexed | Same as tasks |
| Attachments | Metadata only | N/A |
| User info | Cached | Refreshed on sync |
| Project structure | Cached | Refreshed on sync |

---

## Best Practices

### Organization

1. Use consistent tagging across projects
2. Implement confidentiality tags
3. Document which workspaces are monitored
4. Regular audit of indexed content

### Performance

1. Limit to necessary workspaces/projects
2. Use webhooks for real-time updates
3. Exclude completed/archived content if not needed
4. Set appropriate historical depth

### Compliance

1. Use custom fields for data classification
2. Train team on sensitive data handling
3. Regular audit of task content
4. Document data access policies

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **Asana** > **Disconnect**

2. **In Asana:**
   - Go to **My Settings** > **Apps**
   - Revoke access for Whiteout AI
   - Or: Delete the app from Developer Console

3. **Clean up:**
   - Remove webhook registrations
   - Revoke any personal access tokens
   - Clear indexed data if required
