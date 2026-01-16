# Notion Integration Setup Guide

This guide walks you through connecting Notion to Whiteout AI, enabling governance and compliance monitoring for your collaborative workspace.

## Overview

The Notion integration allows Whiteout AI to:
- Index and monitor workspace content
- Detect sensitive information in pages and databases
- Enforce compliance policies on documentation-related AI queries
- Track which Notion content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Notion Admin** access to your workspace
- **Whiteout AI Admin** privileges
- Notion Team or Enterprise plan (integrations require paid plans)

---

## Setup Process

### Step 1: Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**
3. Configure the integration:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI` |
| **Logo** | Optional - upload your company logo |
| **Associated workspace** | Select your workspace |

4. Click **Submit**

### Step 2: Configure Capabilities

On the integration settings page, configure capabilities:

**Content Capabilities:**
| Capability | Setting | Purpose |
|------------|---------|---------|
| **Read content** | Enabled | Access page content |
| **Update content** | Disabled | Not needed |
| **Insert content** | Disabled | Not needed |

**User Capabilities:**
| Capability | Setting | Purpose |
|------------|---------|---------|
| **Read user information including email** | Enabled | User attribution |

**Comment Capabilities:**
| Capability | Setting |
|------------|---------|
| **Read comments** | Enabled (optional) |
| **Create comments** | Disabled |

### Step 3: Get API Credentials

1. On your integration page, find the **Secrets** section
2. Copy the **Internal Integration Token**
   - It starts with `secret_`
   - Keep this secure - it provides access to connected pages

### Step 4: Share Pages with the Integration

**Important:** Notion integrations can only access pages explicitly shared with them.

**To share individual pages:**
1. Open a Notion page
2. Click **Share** in the top-right
3. Click **Invite**
4. Search for your integration name (`Whiteout AI`)
5. Click **Invite**

**To share entire workspace (Enterprise only):**
1. Go to **Settings & Members** > **Connections**
2. Find your integration
3. Enable **Access all workspace content**

### Step 5: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Notion** and click **Connect**
4. Enter:

| Field | Value |
|-------|-------|
| **Integration Token** | The `secret_...` token from Step 3 |

5. Click **Save & Test Connection**

---

## Post-Setup Configuration

### Page Selection

After connecting, Whiteout AI will discover all pages shared with the integration.

**View Connected Pages:**
1. Go to **Settings** > **Data Integrations** > **Notion** > **Configure**
2. View the list of accessible pages and databases

**To add more pages:**
- Share additional pages with the integration in Notion
- Pages will be discovered on the next sync

### Content Types

Configure what content to index:

| Content Type | Description | Recommended |
|--------------|-------------|-------------|
| **Pages** | Standard Notion pages | Yes |
| **Databases** | Database pages and entries | Yes |
| **Database properties** | Property values | Yes |
| **Page comments** | Comments on pages | Optional |
| **Blocks** | Individual content blocks | Yes |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index |
| **Incremental sync** | 30 minutes | Check for changes |
| **Depth limit** | 10 levels | How deep to traverse child pages |

### Property Filtering

For databases, select which properties to index:

| Property Type | Recommended |
|---------------|-------------|
| Title | Yes |
| Text | Yes |
| Number | Optional |
| Select/Multi-select | Yes |
| Date | Optional |
| Checkbox | Optional |
| URL | Yes |
| Email | Caution - may contain PII |
| Phone | Caution - may contain PII |
| Formula | Optional |
| Relation | Yes |
| Rollup | Optional |
| People | User attribution |
| Files | Metadata only |

---

## Advanced Configuration

### Workspace Structure

Organize content access by workspace structure:

```
Workspace
├── Teamspace A (shared)
│   ├── Project Docs
│   └── Meeting Notes
├── Teamspace B (not shared)
│   └── Private content
└── Shared Pages (shared individually)
```

### Content Exclusion

Use page properties to exclude sensitive content:

1. Create a **Select** property called `Visibility`
2. Add options: `Public`, `Internal`, `Confidential`
3. In Whiteout AI, configure exclusion filter:
   - Exclude pages where `Visibility` = `Confidential`

### Parent Page Filtering

Index only pages under specific parent pages:

1. Share the top-level parent page
2. Child pages inherit the connection
3. Configure in Whiteout AI to limit scope to specific parent IDs

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **Page Discovery**: Verify shared pages appear in Data Sources
3. **Content Access**: Check that page content is readable
4. **Query Test**: Ask the AI about Notion content

**Test Query Examples:**
- "What's in my product roadmap?" (if roadmap page is shared)
- "Summarize recent meeting notes"
- "What tasks are assigned to me in Notion?"

---

## Troubleshooting

### "Could not find integration" Error

- Verify the integration token is correct
- Ensure the integration is still active in Notion settings
- Check that the token hasn't been regenerated

### No Pages Visible

This is the most common issue:
- Pages must be explicitly shared with the integration
- Go to each page > Share > Invite the integration
- For bulk sharing, use the parent page method

### Missing Content

- Check that the integration has "Read content" capability
- Verify page permissions allow the integration access
- Some blocks (synced blocks from other pages) may not be accessible

### Rate Limiting

Notion has API rate limits:
- **3 requests per second** average
- Increase sync intervals for large workspaces
- Use incremental syncing to reduce API calls

### Partial Database Access

- Ensure the database itself is shared, not just views
- Check that database permissions include the integration
- Verify linked databases are also shared

---

## Security Considerations

### Token Security

- **Never expose** the integration token publicly
- Store tokens encrypted at rest
- Use environment variables, not hardcoded values
- Rotate tokens periodically (regenerate in Notion)

### Access Control

- **Principle of least privilege**: Only share necessary pages
- Review shared pages regularly
- Remove integration access from sensitive pages
- Use Notion's built-in permissions for granular control

### Audit Trail

- Enable Notion's audit log (Enterprise feature)
- Monitor integration activity
- Review which pages are being accessed

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Page content | Indexed | Configurable |
| Database entries | Indexed | Configurable |
| User information | Cached | Refreshed on sync |
| File attachments | Metadata only | N/A |
| Comments | Optional | Same as pages |

---

## Best Practices

### Workspace Organization

1. **Create a "Whiteout AI Scope" page** as a parent
2. Move/link all pages you want indexed under this parent
3. Share only this parent page with the integration
4. New child pages automatically inherit access

### Database Indexing

1. Use consistent property names across databases
2. Add a `Classification` property for sensitivity levels
3. Use relations to connect related content
4. Keep database templates indexed for context

### Performance Optimization

1. Avoid sharing very large databases (10,000+ entries)
2. Use property filtering to reduce data volume
3. Set appropriate sync intervals based on update frequency
4. Consider indexing summaries rather than full content

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **Notion** > **Disconnect**

2. **In Notion:**
   - Go to **Settings & Members** > **My connections**
   - Find `Whiteout AI` and click **Remove**
   - Or delete the integration entirely from [My Integrations](https://www.notion.so/my-integrations)

3. **Clean up:**
   - Remove integration from individual page share settings
   - Regenerate any exposed tokens
   - Clear indexed data in Whiteout AI if needed
