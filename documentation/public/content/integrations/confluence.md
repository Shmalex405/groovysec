# Confluence Integration Setup Guide

This guide walks you through connecting Atlassian Confluence to Whiteout AI, enabling governance and compliance monitoring for your documentation and knowledge base.

## Overview

The Confluence integration allows Whiteout AI to:
- Index and monitor documentation content
- Detect sensitive information in pages and spaces
- Enforce compliance policies on documentation-related AI queries
- Track which Confluence content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Confluence Admin** access to your Atlassian workspace
- **Whiteout AI Admin** privileges
- Confluence Cloud or Data Center instance (Server version requires additional configuration)

## Setup Methods

Choose the appropriate method based on your Confluence deployment:

| Deployment | Recommended Method |
|------------|-------------------|
| Confluence Cloud | OAuth 2.0 (3LO) |
| Confluence Data Center | API Token or OAuth |
| Confluence Server | API Token |

---

## Confluence Cloud Setup

### Step 1: Note Your Atlassian Site URL

Your Confluence Cloud site URL is typically `https://your-domain.atlassian.net`.

### Step 2: Generate an API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Enter a label: `Whiteout AI Integration`
4. Click **Create**
5. Copy the generated API token — it will only be shown once

### Step 3: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Confluence** and click **Connect**
4. Select **Confluence Cloud**
5. Enter your credentials:

| Field | Value |
|-------|-------|
| **Base URL** | `https://your-domain.atlassian.net` |
| **Email** | Your Atlassian account email |
| **API Token** | The API token from Step 2 |

6. Click **Save & Test Connection**

---

## Confluence Data Center/Server Setup (API Token)

### Step 1: Create a Service Account

1. Log in to Confluence as an administrator
2. Go to **Confluence Administration** > **Users**
3. Create a new user for the integration:

| Field | Value |
|-------|-------|
| **Username** | `whiteout-service` |
| **Full Name** | `Whiteout AI Service Account` |
| **Email** | `whiteout-service@your-company.com` |

4. Set a strong password and save it securely

### Step 2: Assign Permissions

1. Go to **Space Admin** for each space you want to monitor
2. Navigate to **Space Permissions**
3. Add the service account with **View** permission
4. Repeat for all relevant spaces

**For Global Access:**
1. Go to **Confluence Administration** > **Global Permissions**
2. Add the service account to a group with read access to all spaces

### Step 3: Generate API Token

**For Confluence Cloud Service Account:**
1. Log in as the service account
2. Go to [API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
3. Click **Create API token**
4. Name it `Whiteout AI` and copy the token

**For Data Center/Server:**
1. API tokens are not available; use basic authentication with the service account credentials

### Step 4: Configure Whiteout AI

1. In Whiteout AI, go to **Settings** > **Data Integrations** > **Confluence**
2. Select **Data Center / Server**
3. Enter:

| Field | Value |
|-------|-------|
| **Base URL** | `https://confluence.your-company.com` |
| **Email** | Service account email |
| **API Token** | API Token from Step 3 |

4. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Space Selection

Configure which spaces Whiteout AI monitors:

1. Go to **Settings** > **Data Integrations** > **Confluence** > **Configure**
2. Select **Spaces** tab
3. Choose:
   - **All spaces**: Monitor all spaces (including future ones)
   - **Selected spaces**: Choose specific spaces
   - **Exclude spaces**: Exclude specific spaces from monitoring

### Content Types

Select which content types to index:

| Content Type | Description | Recommended |
|--------------|-------------|-------------|
| **Pages** | Standard Confluence pages | Yes |
| **Blog posts** | Blog-style content | Optional |
| **Comments** | Page comments | Optional |
| **Attachments** | File attachments (metadata only) | Optional |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index of all content |
| **Incremental sync** | 30 minutes | Process recent changes |
| **Page limit per sync** | 1000 | Maximum pages per sync batch |

### Label-Based Filtering

Use Confluence labels to control what gets indexed:

1. **Include labels**: Only index pages with specific labels
2. **Exclude labels**: Skip pages with specific labels (e.g., `confidential`, `draft`)

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection** in integration settings
2. **Space Discovery**: Verify spaces appear in the **Data Sources** section
3. **Content Index**: Check that page count increases during sync
4. **Query Test**: Use the AI assistant to ask about Confluence content

---

## Troubleshooting

### "Authentication failed" Error

- **Cloud**: Verify Client ID and Secret are correct
- **Server**: Confirm username and password are valid
- Check that the service account is not locked or disabled

### Missing Spaces

- Verify the service account has view permissions on the space
- Check space restrictions in Confluence admin
- Ensure the space is not archived

### Incomplete Content Indexing

- Check for page-level restrictions
- Verify API rate limits aren't being hit
- Review sync logs for errors on specific pages

### Connection Timeout

- Verify the Confluence URL is accessible from Whiteout AI
- Check firewall rules allow outbound HTTPS
- For Data Center, ensure the load balancer allows API connections

### Rate Limiting (Cloud)

Atlassian Cloud has API rate limits:
- Reduce sync frequency
- Use incremental syncing
- Contact Atlassian for enterprise rate limit increases

---

## Security Considerations

- **Service Account**: Use a dedicated service account, not personal credentials
- **API Token Security**: Store API tokens securely; treat them like passwords
- **Minimal Permissions**: Grant only read access to required spaces
- **Network Security**: Use HTTPS for all connections
- **Audit Trail**: Enable Confluence audit logging for the service account

---

## Data Handling

Whiteout AI handles Confluence data as follows:

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Page content | Indexed for search | Configurable (default: 90 days) |
| User information | Cached | Refreshed on sync |
| Attachments | Metadata only | N/A |
| Comments | Optional indexing | Same as pages |

---

## Revoking Access

To disconnect the integration:

1. In Whiteout AI: **Settings** > **Data Integrations** > **Confluence** > **Disconnect**
2. In Atlassian:
   - **Cloud**: Go to Admin > Apps > Revoke app access
   - **Server**: Disable or delete the service account
3. Rotate any API tokens or credentials
