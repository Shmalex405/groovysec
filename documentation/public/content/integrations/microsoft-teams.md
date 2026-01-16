# Microsoft Teams Integration Setup Guide

This guide walks you through connecting Microsoft Teams to Whiteout AI, enabling governance and compliance monitoring for your Microsoft collaboration platform.

## Overview

The Microsoft Teams integration allows Whiteout AI to:
- Monitor team channels and chat messages
- Detect sensitive information shared in Teams
- Enforce compliance policies on communication-related AI queries
- Track which Teams content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Microsoft 365 Global Administrator** or **Teams Administrator** access
- **Azure Active Directory** admin access (for app registration)
- **Whiteout AI Admin** privileges
- Microsoft 365 Business Basic or higher (Teams must be enabled)

---

## Setup Process

### Step 1: Register an Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure the application:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI Teams Integration` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI** | Web: `https://your-whiteout-instance.com/api/integrations/teams/callback` |

5. Click **Register**
6. Note the **Application (client) ID** and **Directory (tenant) ID**

### Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Application permissions**
4. Add the following permissions:

| Permission | Type | Purpose |
|------------|------|---------|
| `Channel.ReadBasic.All` | Application | Read channel info |
| `ChannelMessage.Read.All` | Application | Read channel messages |
| `Chat.Read.All` | Application | Read chat messages |
| `Files.Read.All` | Application | Read files shared in Teams |
| `Group.Read.All` | Application | Read team/group info |
| `Team.ReadBasic.All` | Application | Read team info |
| `TeamMember.Read.All` | Application | Read team membership |
| `User.Read.All` | Application | Read user info |

5. Click **Grant admin consent for [Your Organization]**
6. Confirm all permissions show green checkmarks

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Configure:

| Field | Value |
|-------|-------|
| **Description** | `Whiteout AI Integration` |
| **Expires** | 24 months (or per your security policy) |

4. Click **Add**
5. **Immediately copy** the secret value (it won't be shown again)

### Step 4: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Microsoft Teams** and click **Connect**
4. Enter:

| Field | Value |
|-------|-------|
| **Tenant ID** | From Step 1 |
| **Client ID** | From Step 1 |
| **Client Secret** | From Step 3 |

5. Click **Save & Test Connection**

---

## Advanced: Delegated Permissions (User Context)

For scenarios requiring user-specific access:

### Configure Delegated Permissions

1. In API permissions, add **Delegated permissions**:
   - `Channel.ReadBasic.All`
   - `Chat.Read`
   - `Files.Read.All`
   - `User.Read`

2. Configure authentication flow in Whiteout AI

### User Consent Flow

1. Users will be prompted to authorize on first use
2. Configure consent settings in Azure AD > Enterprise applications

---

## Post-Setup Configuration

### Team Selection

Configure which teams Whiteout AI monitors:

1. Go to **Settings** > **Data Integrations** > **Teams** > **Configure**
2. Select **Teams** tab
3. Choose:

| Option | Description |
|--------|-------------|
| **All teams** | Monitor all teams in the organization |
| **Selected teams** | Choose specific teams |
| **Exclude teams** | Monitor all except specific teams |

### Channel Configuration

Select channel types to monitor:

| Channel Type | Description | Recommended |
|--------------|-------------|-------------|
| **Standard channels** | Regular team channels | Yes |
| **Private channels** | Private team channels | Selective |
| **Shared channels** | Cross-team channels | Yes |

### Message Types

Configure what to monitor:

| Type | Default | Notes |
|------|---------|-------|
| Channel messages | Yes | Team channel posts |
| Replies | Yes | Thread replies |
| 1:1 chats | No | Privacy considerations |
| Group chats | No | Privacy considerations |
| Meeting chats | No | Privacy considerations |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Historical import** | 90 days | Import past messages |
| **Sync interval** | 15 minutes | Check for new content |
| **Change notifications** | Enabled | Real-time updates via webhooks |

---

## Change Notifications (Webhooks)

For real-time monitoring, configure change notifications:

### Step 1: Enable Notifications in Whiteout AI

1. Go to **Configure** > **Real-time Settings**
2. Enable **Change Notifications**
3. Note the **Notification URL**

### Step 2: Certificate Configuration

Microsoft Graph requires encrypted notifications for message content:

1. Generate or obtain an encryption certificate
2. Upload the public certificate to Whiteout AI
3. Configure the certificate in Azure AD app registration

### Step 3: Subscription Management

Whiteout AI automatically manages:
- Creating subscriptions for monitored resources
- Renewing subscriptions before expiry (max 60 minutes for messages)
- Handling subscription lifecycle

---

## Compliance Features

### Microsoft 365 Compliance Integration

If using Microsoft 365 Compliance Center:

1. Go to [Microsoft 365 Compliance Center](https://compliance.microsoft.com)
2. Navigate to **Information protection** > **Labels**
3. Configure sensitivity labels
4. In Whiteout AI, enable label recognition

### eDiscovery Considerations

- Whiteout AI access respects eDiscovery holds
- Content under legal hold is flagged
- Coordinate with compliance team for retention policies

### Audit Logging

All Whiteout AI access is logged:
- In Microsoft 365 unified audit log
- In Whiteout AI audit trail
- Available for compliance review

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **Team Discovery**: Verify teams appear in Data Sources
3. **Message Access**: Confirm messages are being indexed
4. **Real-time Test**: Post a test message and check capture
5. **Query Test**: Ask the AI about Teams content

---

## Troubleshooting

### "Insufficient privileges" Error

- Verify all required permissions are granted
- Ensure admin consent was provided
- Check that the app has the correct permissions type (Application vs Delegated)

### No Teams Visible

- Confirm `Team.ReadBasic.All` permission is granted
- Check that teams exist and have active members
- Verify the service principal has access to the teams

### Messages Not Appearing

- Verify `ChannelMessage.Read.All` permission
- Check compliance recording policy isn't blocking access
- Ensure messages aren't in retention/hold status

### Rate Limiting

Microsoft Graph has throttling limits:
- Teams content: 15 requests per second
- Graph API general: Varies by resource

To handle throttling:
- Implement exponential backoff
- Increase sync intervals
- Use delta queries for efficiency

### Certificate Errors (Notifications)

- Ensure certificate is valid and not expired
- Verify certificate chain is complete
- Check that private key is accessible

### Tenant Configuration Issues

- Verify tenant allows third-party app access
- Check Azure AD conditional access policies
- Review enterprise application settings

---

## Security Considerations

### Application Permissions

- Application permissions provide broad access
- Consider using delegated permissions for user-specific needs
- Regularly audit app permission usage

### Data Sensitivity

- Be aware of sensitivity labels on content
- Respect Information Rights Management (IRM)
- Consider data residency requirements

### Access Governance

- Use Azure AD access reviews for the app
- Monitor sign-in logs for anomalies
- Implement conditional access if needed

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Messages | Indexed | Configurable |
| Files | Metadata only | N/A |
| User info | Cached | Refreshed on sync |
| Meeting transcripts | Optional | If enabled |
| Reactions | Optional | Same as messages |

---

## Best Practices

### Team Organization

1. Use consistent team naming conventions
2. Document which teams are monitored
3. Communicate monitoring policy to users
4. Regular audit of team access

### Performance

1. Limit historical import depth
2. Use change notifications for real-time updates
3. Exclude high-volume automated channels
4. Set appropriate retention periods

### Compliance

1. Align with Microsoft 365 compliance settings
2. Coordinate with legal for retention requirements
3. Document data access for audits
4. Regular review of accessed content

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **Teams** > **Disconnect**

2. **In Azure AD:**
   - Go to **App registrations** > **Whiteout AI Teams Integration**
   - Delete the application registration
   - Or: Go to **Enterprise applications** > Remove user/group assignments

3. **Clean up:**
   - Revoke client secrets
   - Remove any change notification subscriptions
   - Clear indexed data if required
   - Review Microsoft 365 audit logs
