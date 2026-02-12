# Slack Integration Setup Guide

This guide walks you through connecting Slack to Whiteout AI, enabling governance and compliance monitoring for your team communication platform.

## Overview

The Slack integration allows Whiteout AI to:
- Monitor channel messages and threads
- Detect sensitive information shared in Slack
- Enforce compliance policies on communication-related AI queries
- Track which Slack content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Slack Workspace Owner or Admin** access
- **Whiteout AI Admin** privileges
- Slack Business+ or Enterprise Grid plan (recommended for compliance features)

---

## Setup Process

### Step 1: Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **Create New App**
3. Choose **From scratch**
4. Enter app details:

| Field | Value |
|-------|-------|
| **App Name** | `Whiteout AI` |
| **Workspace** | Select your workspace |

5. Click **Create App**

### Step 2: Configure OAuth Scopes

1. In your app settings, go to **OAuth & Permissions**
2. Scroll to **Bot Token Scopes**
3. Add the following scopes:

| Scope | Purpose |
|-------|---------|
| `channels:history` | Read public channel messages |
| `channels:read` | List public channels |
| `groups:history` | Read private channel messages |
| `groups:read` | List private channels |
| `im:history` | Read direct messages (optional) |
| `im:read` | List direct messages (optional) |
| `mpim:history` | Read group DMs (optional) |
| `mpim:read` | List group DMs (optional) |
| `users:read` | Read user information |
| `users:read.email` | Read user email addresses |
| `team:read` | Read workspace info |
| `files:read` | Read file metadata |

**Note:** `im:*` and `mpim:*` scopes for DMs are optional and require careful consideration of privacy policies.

### Step 3: Configure Event Subscriptions (Optional)

For real-time monitoring:

1. Go to **Event Subscriptions**
2. Enable Events
3. Enter Request URL:
   ```
   https://your-whiteout-instance.com/api/integrations/slack/events
   ```
4. Subscribe to bot events:
   - `message.channels` - Public channel messages
   - `message.groups` - Private channel messages
   - `member_joined_channel` - Track channel membership
   - `channel_created` - New channel notifications

### Step 4: Install the App

1. Go to **OAuth & Permissions**
2. Click **Install to Workspace**
3. Review permissions and click **Allow**
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### Step 5: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Slack** and click **Connect**
4. Enter:

| Field | Value |
|-------|-------|
| **Bot Token** | The `xoxb-...` token from Step 4 |

5. Click **Save & Test Connection**

---

## Enterprise Grid Setup

For Enterprise Grid workspaces:

### Step 1: Create an Org-Level App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Create app selecting **Enterprise Grid** organization
3. Enable **Org Wide App** in app settings

### Step 2: Configure Org-Level Scopes

Add these additional scopes:
- `admin.conversations:read` - Read all conversations
- `admin.teams:read` - Read all workspaces
- `admin.users:read` - Read all users

### Step 3: Request Org Admin Approval

1. Submit app for org admin approval
2. Once approved, install across selected workspaces

---

## Post-Setup Configuration

### Channel Selection

Configure which channels Whiteout AI monitors:

1. Go to **Settings** > **Data Integrations** > **Slack** > **Configure**
2. Select **Channels** tab
3. Choose monitoring scope:

| Option | Description |
|--------|-------------|
| **All public channels** | Monitor all public channels |
| **Selected channels** | Choose specific channels |
| **Exclude channels** | Monitor all except specific channels |

### Private Channel Access

To monitor private channels, the Whiteout AI bot must be added:

1. In Slack, open the private channel
2. Click the channel name > **Integrations** > **Add apps**
3. Search for and add `Whiteout AI`

### Message Types

Configure what message types to monitor:

| Type | Default | Notes |
|------|---------|-------|
| Channel messages | Yes | Public and private channels |
| Thread replies | Yes | Replies to messages |
| Direct messages | No | Requires explicit opt-in |
| File shares | Metadata only | File names, types |
| App messages | Optional | Bot/integration messages |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Historical import** | 90 days | Import past messages |
| **Real-time monitoring** | Enabled | Process new messages immediately |
| **Sync interval** | 5 minutes | Catch-up sync frequency |

---

## Advanced Configuration

### Channel Naming Conventions

Use channel naming to control monitoring:

```
#general          - Monitored (public)
#proj-alpha       - Monitored (public, project)
#private-hr       - Not monitored (not added to channel)
#temp-discussion  - Excluded by prefix
```

Configure prefix exclusions:
- `temp-` - Temporary channels
- `test-` - Test channels
- `personal-` - Personal channels

### Message Filtering

Create filters based on message content:

1. Go to **Configure** > **Filters**
2. Add filter rules:

| Filter | Action | Example |
|--------|--------|---------|
| Contains `CONFIDENTIAL` | Exclude | Skip confidential messages |
| From bot users | Exclude | Skip automated messages |
| Contains URLs only | Exclude | Skip link-only posts |

### User Privacy Settings

Configure user privacy options:

| Setting | Options | Recommendation |
|---------|---------|----------------|
| **Index user names** | Yes/No | Yes, for attribution |
| **Index user emails** | Yes/No | No, unless required |
| **Track user activity** | Yes/No | Yes, for audit |

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **Channel Discovery**: Verify channels appear in Data Sources
3. **Message Access**: Check message count increases
4. **Real-time Test**: Post a test message and verify it's captured
5. **Query Test**: Ask the AI about Slack content

---

## Troubleshooting

### "invalid_auth" Error

- Verify the bot token is correct and complete
- Check that the app is still installed in the workspace
- Ensure the token hasn't been revoked or rotated

### Missing Channels

- **Public channels**: Should appear automatically
- **Private channels**: Must add the bot to each channel
- Check channel permissions don't exclude apps

### No Messages Appearing

- Verify `channels:history` scope is granted
- Check that the bot has access to the channel
- For private channels, confirm bot membership
- Review any message filters that might exclude content

### Rate Limiting

Slack has rate limits:
- **Tier 1**: 1 request per second
- **Tier 2**: 20 requests per minute
- **Tier 3**: 50 requests per minute

To avoid rate limiting:
- Increase sync intervals
- Use event subscriptions for real-time updates
- Reduce historical import depth

### Events Not Received

- Verify the Request URL is correct and accessible
- Check that the Signing Secret matches
- Ensure your server responds with HTTP 200 within 3 seconds
- Review Slack's event delivery logs

---

## Security Considerations

### Token Security

- **Bot Token**: Provides full access to permitted scopes
- Store tokens encrypted
- Never commit tokens to version control
- Rotate tokens periodically

### Data Access

- Be mindful of DM monitoring (privacy implications)
- Document what channels are monitored
- Inform users about monitoring (legal requirement in many jurisdictions)
- Consider data retention policies

### Compliance

- **GDPR**: Ensure user consent for monitoring
- **HIPAA**: Be cautious with health information in Slack
- **SOC 2**: Implement appropriate controls and audit logging

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Messages | Indexed | Configurable (default: 90 days) |
| User info | Cached | Refreshed on sync |
| Files | Metadata only | N/A |
| Reactions | Optional | Same as messages |
| Threads | Indexed with parent | Same as messages |

---

## Best Practices

### Channel Organization

1. Use consistent naming conventions
2. Create a monitoring policy and communicate it
3. Consider dedicated channels for sensitive discussions
4. Review channel list regularly

### Performance

1. Limit historical import to necessary timeframe
2. Use event subscriptions rather than polling
3. Exclude high-volume bot channels
4. Set appropriate retention limits

### Privacy

1. Document monitoring scope in employee handbook
2. Get legal review for DM monitoring
3. Provide opt-out mechanisms where appropriate
4. Regular audit of accessed content

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **Slack** > **Disconnect**

2. **In Slack:**
   - Go to workspace **Settings** > **Manage apps**
   - Find `Whiteout AI` and click **Remove**
   - Or: App owner can revoke tokens in app settings

3. **Clean up:**
   - Remove bot from private channels
   - Clear indexed data if required
   - Rotate any shared secrets
