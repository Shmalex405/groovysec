# Linear Integration Setup Guide

This guide walks you through connecting Linear to Whiteout AI, enabling governance and compliance monitoring for your modern issue tracking system.

## Overview

The Linear integration allows Whiteout AI to:
- Index and monitor issues, projects, and cycles
- Detect sensitive information in issue content
- Enforce compliance policies on project-related AI queries
- Track which Linear content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Linear Admin** access to your workspace
- **Whiteout AI Admin** privileges
- Linear Pro or Enterprise plan (for API access and webhooks)

---

## Setup Process

### Step 1: Create a Linear OAuth Application

1. Go to [Linear Settings](https://linear.app/settings) > **API** > **OAuth Applications**
2. Click **Create OAuth Application**
3. Configure:

| Field | Value |
|-------|-------|
| **Application name** | `Whiteout AI` |
| **Application URL** | `https://your-whiteout-instance.com` |
| **Redirect callback URLs** | `https://your-whiteout-instance.com/api/integrations/linear/callback` |
| **Description** | `Governance integration for Whiteout AI` |

4. Click **Create**
5. Note the **Client ID** and **Client Secret**

### Step 2: Configure OAuth Scopes

Select the following scopes:

| Scope | Purpose |
|-------|---------|
| `read` | Read issues, projects, teams |
| `issues:read` | Read issue details |
| `comments:read` | Read issue comments |

### Step 3: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Linear** and click **Connect**
4. Enter:

| Field | Value |
|-------|-------|
| **API Key** | The Linear API key (see below) |

5. Click **Save & Test Connection**

### Generating a Linear API Key

1. Go to [Linear Settings](https://linear.app/settings) > **API** > **Personal API keys**
2. Click **Create key**
3. Configure:

| Field | Value |
|-------|-------|
| **Label** | `Whiteout AI Integration` |
| **Scopes** | Read (issues, comments, projects) |

4. Copy the generated key and enter it in the Whiteout AI configuration above

---

## Post-Setup Configuration

### Team Selection

Configure which teams Whiteout AI monitors:

1. Go to **Settings** > **Data Integrations** > **Linear** > **Configure**
2. Select **Teams** tab
3. Choose:

| Option | Description |
|--------|-------------|
| **All teams** | Monitor all workspace teams |
| **Selected teams** | Choose specific teams |
| **By project** | Select specific projects |

### Content Types

Select what content to index:

| Content Type | Description | Recommended |
|--------------|-------------|-------------|
| **Issue titles** | Issue names | Yes |
| **Issue descriptions** | Detailed content | Yes |
| **Comments** | Issue comments | Yes |
| **Sub-issues** | Child issues | Yes |
| **Attachments** | File attachments | Metadata only |

### Issue Filters

Configure which issues to include:

| Filter | Options | Example |
|--------|---------|---------|
| **State** | Open, Closed, All | All |
| **Priority** | Urgent, High, Medium, Low, None | All |
| **Labels** | Include/Exclude by label | Exclude `confidential` |
| **Cycle** | Current, Past, All | All |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index |
| **Incremental sync** | 15 minutes | Process recent changes |
| **Historical depth** | 90 days | How far back to index |

---

## Advanced Configuration

### Label-Based Filtering

Use Linear labels to control indexing:

1. Create labels in Linear:
   - `confidential` - Exclude from indexing
   - `public` - Always include
   - `sensitive` - Flag for review

2. Configure in Whiteout AI:
   ```
   Exclude labels: confidential, internal-only
   Include labels: (all by default)
   ```

### Project Filtering

Index specific projects only:

1. List projects to include/exclude
2. Use project prefixes for pattern matching
3. Configure cycle-based filtering

### Webhook Configuration

For real-time updates:

1. Go to **Configure** > **Webhooks**
2. Enable webhook notifications
3. Whiteout AI auto-registers for:
   - Issue created
   - Issue updated
   - Comment created
   - Issue deleted

**Webhook URL:**
```
https://your-whiteout-instance.com/api/integrations/linear/webhook
```

### Custom Properties

Map Linear custom properties:

| Linear Property | Whiteout AI Attribute |
|----------------|----------------------|
| Customer | `customer_id` |
| Epic | `epic` |
| Sprint Points | `effort` |

---

## GraphQL Query Customization

Linear uses GraphQL. Advanced users can customize queries:

**Default issues query:**
```graphql
query {
  issues(first: 100, filter: { team: { id: { eq: "TEAM_ID" } } }) {
    nodes {
      id
      title
      description
      state { name }
      labels { nodes { name } }
      comments { nodes { body } }
    }
  }
}
```

**Filtered query example:**
```graphql
query {
  issues(
    first: 100
    filter: {
      state: { type: { nin: ["canceled", "completed"] } }
      labels: { name: { nin: ["confidential"] } }
    }
  ) {
    nodes { ... }
  }
}
```

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **Team Discovery**: Verify teams appear in Data Sources
3. **Issue Access**: Confirm issues are being indexed
4. **Query Test**: Ask the AI about Linear issue content

---

## Troubleshooting

### "Authentication failed" Error

- Verify OAuth credentials are correct
- Check that the OAuth app is still active
- Ensure redirect URLs match exactly
- For API keys, verify the key hasn't been revoked

### Missing Teams/Projects

- Confirm the authenticating user has access
- Check team visibility settings
- Verify project permissions

### No Issues Appearing

- Check issue filters aren't too restrictive
- Verify state filters include desired states
- Review label exclusion rules
- Ensure issues exist in selected teams

### Rate Limiting

Linear has API rate limits:
- 3,000 requests per hour (standard)
- Higher limits for Enterprise

To manage limits:
- Use webhooks for real-time updates
- Increase sync intervals
- Reduce historical depth

### Webhook Issues

- Verify webhook URL is publicly accessible
- Check webhook signature validation
- Review Linear webhook logs in settings

---

## Security Considerations

### OAuth Security

- Store client secrets securely
- Use OAuth over API keys for production
- Implement token refresh logic
- Revoke access when no longer needed

### Data Access

- OAuth inherits authorizing user's permissions
- Use admin account for full workspace access
- Review accessible teams/projects

### Sensitive Data

- Be aware of sensitive data in issues
- Use labels to mark confidential content
- Configure exclusion rules
- Audit issue content regularly

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Issue content | Indexed | Configurable |
| Comments | Indexed | Same as issues |
| Attachments | Metadata only | N/A |
| User info | Cached | Refreshed on sync |
| Project structure | Cached | Refreshed on sync |

---

## Best Practices

### Organization

1. Use consistent labeling across teams
2. Implement confidentiality labels
3. Document which teams are monitored
4. Regular audit of indexed content

### Performance

1. Limit to necessary teams/projects
2. Use webhooks for real-time updates
3. Set appropriate historical depth
4. Filter out completed/canceled issues if not needed

### Compliance

1. Use labels for data classification
2. Train team on sensitive data handling
3. Regular audit of issue content
4. Document data access policies

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **Linear** > **Disconnect**

2. **In Linear:**
   - Go to **Settings** > **API** > **Authorized Applications**
   - Revoke access for Whiteout AI
   - Or: Delete the OAuth application

3. **Clean up:**
   - Remove webhook registrations
   - Revoke any personal API keys
   - Clear indexed data if required
