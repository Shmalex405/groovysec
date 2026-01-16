# Trello Integration Setup Guide

This guide walks you through connecting Trello to Whiteout AI, enabling governance and compliance monitoring for your visual project management boards.

## Overview

The Trello integration allows Whiteout AI to:
- Index and monitor boards, lists, and cards
- Detect sensitive information in card content
- Enforce compliance policies on project-related AI queries
- Track which Trello content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Trello Admin** access to your workspace
- **Whiteout AI Admin** privileges
- Trello Business Class or Enterprise (for workspace-wide access)

---

## Setup Process

### Step 1: Get Trello API Credentials

1. Go to [Trello Developer Portal](https://trello.com/power-ups/admin)
2. Click **New** to create a new Power-Up
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI Integration` |
| **Workspace** | Select your workspace |
| **iframe connector URL** | `https://your-whiteout-instance.com/api/integrations/trello/connector` |
| **Email** | Your admin email |
| **Support contact** | Your support email |
| **Author** | Your organization name |

4. Click **Create**
5. Note the **API Key**

### Step 2: Generate API Token

1. On the Power-Up page, click **Generate a new API Key** if needed
2. Click the **Token** link next to the API Key
3. You'll be redirected to authorize the token
4. Configure permissions:

| Permission | Setting |
|------------|---------|
| **Name** | `Whiteout AI Token` |
| **Expiration** | Never (or set as appropriate) |
| **Scope** | Read-only access to boards/cards |

5. Click **Allow**
6. Copy the generated token

### Step 3: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Trello** and click **Connect**
4. Enter:

| Field | Value |
|-------|-------|
| **API Key** | From Step 1 |
| **API Token** | From Step 2 |

5. Click **Save & Test Connection**

---

## Enterprise Setup (Server Token)

For Trello Enterprise with enhanced access:

### Step 1: Get Enterprise API Key

1. Contact Trello Enterprise support
2. Request an Enterprise API key
3. This provides elevated access and rate limits

### Step 2: Configure Enterprise Token

1. Generate token with enterprise scopes
2. Enable workspace-wide access
3. Configure in Whiteout AI with Enterprise mode enabled

---

## Post-Setup Configuration

### Board Selection

Configure which boards Whiteout AI monitors:

1. Go to **Settings** > **Data Integrations** > **Trello** > **Configure**
2. Select **Boards** tab
3. Choose:

| Option | Description |
|--------|-------------|
| **All boards** | Monitor all workspace boards |
| **Selected boards** | Choose specific boards |
| **By team** | Select boards by team membership |

### Content Types

Select what content to index:

| Content Type | Description | Recommended |
|--------------|-------------|-------------|
| **Card titles** | Card names | Yes |
| **Card descriptions** | Detailed content | Yes |
| **Checklists** | Checklist items | Yes |
| **Comments** | Card comments | Yes |
| **Attachments** | File attachments | Metadata only |
| **Custom fields** | Enterprise custom fields | Yes |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index |
| **Incremental sync** | 30 minutes | Process card changes |
| **Historical depth** | All cards | Include archived cards |

---

## Advanced Configuration

### Label-Based Filtering

Use Trello labels to control indexing:

1. Create labels in Trello boards:
   - `confidential` - Exclude from indexing
   - `public` - Include in indexing
   - `sensitive` - Flag for review

2. In Whiteout AI, configure:
   - **Include labels**: Only index cards with these labels
   - **Exclude labels**: Skip cards with these labels

### Custom Fields (Enterprise)

Map Trello custom fields to Whiteout AI attributes:

| Trello Field | Whiteout AI Attribute | Purpose |
|--------------|----------------------|---------|
| `Project Code` | `project_id` | Track by project |
| `Classification` | `sensitivity` | Data sensitivity |
| `Department` | `department` | Org structure |

### Webhook Configuration

For real-time updates:

1. Go to **Configure** > **Webhooks**
2. Enable webhook notifications
3. Whiteout AI automatically registers webhooks for:
   - Card creation
   - Card updates
   - Card comments
   - Card movement

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **Board Discovery**: Verify boards appear in Data Sources
3. **Card Access**: Confirm cards are being indexed
4. **Query Test**: Ask the AI about Trello card content

---

## Troubleshooting

### "Invalid token" Error

- Verify the API token hasn't expired
- Check that the token has required permissions
- Ensure the token was generated for the correct user

### Missing Boards

- Confirm the token owner has access to the boards
- Check board visibility settings (Private vs Workspace)
- Verify workspace membership

### No Cards Appearing

- Check that boards contain cards
- Verify card isn't archived (unless historical indexing enabled)
- Review label filters that might exclude cards

### Rate Limiting

Trello has API rate limits:
- 300 requests per 10 seconds per token
- 100 requests per 10 seconds per API key

To manage limits:
- Increase sync intervals
- Use webhooks for real-time updates
- Limit number of boards monitored

### Webhook Issues

- Verify webhook URL is publicly accessible
- Check webhook registration succeeded
- Review Trello webhook logs

---

## Security Considerations

### Token Security

- API tokens provide full read access
- Store tokens securely
- Use separate tokens for different integrations
- Rotate tokens periodically

### Access Scope

- Token inherits user's board access
- Use a dedicated service account
- Review which boards the service account can access
- Remove access when no longer needed

### Data Sensitivity

- Be aware of sensitive data in cards
- Use labels to mark confidential content
- Configure exclusion rules appropriately
- Audit card content regularly

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Card content | Indexed | Configurable |
| Card comments | Indexed | Same as cards |
| Attachments | Metadata only | N/A |
| User info | Cached | Refreshed on sync |
| Board structure | Cached | Refreshed on sync |

---

## Best Practices

### Board Organization

1. Use consistent naming conventions
2. Implement label standards across boards
3. Archive completed boards appropriately
4. Document which boards are monitored

### Performance

1. Limit to necessary boards
2. Use webhooks rather than frequent polling
3. Archive old boards to reduce sync scope
4. Set appropriate historical depth

### Compliance

1. Use labels for classification
2. Train users on sensitive data handling
3. Regular audit of card content
4. Document data access policies

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **Trello** > **Disconnect**

2. **In Trello:**
   - Go to **Settings** > **Authorized Power-Ups**
   - Revoke the Whiteout AI token
   - Or: Delete the Power-Up from admin portal

3. **Clean up:**
   - Remove webhook registrations
   - Delete stored credentials
   - Clear indexed data if required
