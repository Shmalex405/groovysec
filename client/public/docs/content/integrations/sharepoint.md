# SharePoint Integration Setup Guide

This guide walks you through connecting Microsoft SharePoint to Whiteout AI, enabling governance and compliance monitoring for your enterprise document management system.

## Overview

The SharePoint integration allows Whiteout AI to:
- Index and monitor document libraries and sites
- Detect sensitive information in stored documents
- Enforce compliance policies on document-related AI queries
- Track which SharePoint content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Microsoft 365 Global Administrator** or **SharePoint Administrator** access
- **Azure Active Directory** admin access (for app registration)
- **Whiteout AI Admin** privileges
- Microsoft 365 E3/E5 or SharePoint Online Plan 2 (recommended)

---

## Setup Process

### Step 1: Register an Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI SharePoint Integration` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI** | Web: `https://your-whiteout-instance.com/api/integrations/sharepoint/callback` |

5. Click **Register**
6. Note the **Application (client) ID** and **Directory (tenant) ID**

### Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Application permissions**
4. Add these permissions:

| Permission | Type | Purpose |
|------------|------|---------|
| `Sites.Read.All` | Application | Read all SharePoint sites |
| `Files.Read.All` | Application | Read all files |
| `User.Read.All` | Application | Read user information |
| `Group.Read.All` | Application | Read group memberships |

5. Click **Add a permission** > **SharePoint**
6. Select **Application permissions**
7. Add:

| Permission | Type | Purpose |
|------------|------|---------|
| `Sites.Read.All` | Application | Read all site collections |
| `TermStore.Read.All` | Application | Read taxonomy/terms |

8. Click **Grant admin consent for [Your Organization]**
9. Verify all permissions show green checkmarks

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Configure:

| Field | Value |
|-------|-------|
| **Description** | `Whiteout AI Integration` |
| **Expires** | 24 months |

4. Click **Add**
5. **Immediately copy** the secret value

### Step 4: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **SharePoint** and click **Connect**
4. Enter:

| Field | Value |
|-------|-------|
| **Tenant ID** | From Step 1 |
| **Client ID** | From Step 1 |
| **Client Secret** | From Step 3 |
| **SharePoint URL** | `https://your-company.sharepoint.com` |

5. Click **Save & Test Connection**

---

## SharePoint On-Premises Setup

For SharePoint Server (on-premises):

### Step 1: Configure App Registration in SharePoint

1. Go to SharePoint Central Administration
2. Navigate to **Security** > **Manage app permissions**
3. Register a new app

### Step 2: Create High-Trust App

1. Generate a self-signed certificate
2. Register the certificate in SharePoint
3. Configure server-to-server authentication

### Step 3: Configure in Whiteout AI

1. Select **SharePoint On-Premises**
2. Enter site URL and app credentials
3. Upload the certificate
4. Test connection

---

## Post-Setup Configuration

### Site Collection Selection

Configure which site collections to monitor:

1. Go to **Settings** > **Data Integrations** > **SharePoint** > **Configure**
2. Select **Site Collections** tab
3. Choose:

| Option | Description |
|--------|-------------|
| **All site collections** | Monitor entire tenant |
| **Selected sites** | Choose specific site collections |
| **Hub sites** | Select by hub membership |
| **Exclude sites** | Exclude specific sites |

### Document Library Selection

Fine-tune document access:

| Option | Description |
|--------|-------------|
| **All libraries** | Index all document libraries |
| **Selected libraries** | Choose specific libraries |
| **By content type** | Filter by SharePoint content types |

### File Types

Select which file types to index:

| File Type | Extension | Recommended |
|-----------|-----------|-------------|
| Word Documents | docx, doc | Yes |
| Excel Spreadsheets | xlsx, xls | Yes |
| PowerPoint | pptx, ppt | Yes |
| PDFs | pdf | Yes |
| Text Files | txt | Yes |
| OneNote | one | Optional |
| Images | png, jpg | Metadata only |
| Videos | mp4 | Metadata only |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index |
| **Incremental sync** | 1 hour | Process changes via delta query |
| **File size limit** | 25 MB | Skip larger files |

---

## Advanced Configuration

### Search-Based Discovery

Use SharePoint search to find content:

1. Enable **Search-based indexing**
2. Configure search queries:
   ```
   ContentType:Document AND Path:https://company.sharepoint.com/sites/*
   ```

### Sensitivity Labels Integration

Integrate with Microsoft Information Protection:

1. Go to **Configure** > **Sensitivity Labels**
2. Enable label recognition
3. Map labels to Whiteout AI classifications:

| SharePoint Label | Whiteout AI Action |
|------------------|-------------------|
| Public | Index normally |
| Internal | Index with flag |
| Confidential | Exclude from index |
| Highly Confidential | Exclude + alert |

### Metadata Mapping

Map SharePoint columns to Whiteout AI:

| SharePoint Column | Whiteout AI Attribute | Purpose |
|-------------------|----------------------|---------|
| Department | `department` | Org mapping |
| Project | `project_id` | Project tracking |
| Classification | `sensitivity` | Data classification |

### Change Notifications (Webhooks)

For real-time updates:

1. Go to **Configure** > **Webhooks**
2. Enable change notifications
3. Configure subscription scope:
   - List/Library level
   - Site level
   - Drive level

**Note:** SharePoint webhooks require renewal every 180 days (handled automatically by Whiteout AI).

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **Site Discovery**: Verify site collections appear
3. **Library List**: Check document libraries are found
4. **Document Access**: Confirm files are being indexed
5. **Query Test**: Ask the AI about SharePoint document content

---

## Troubleshooting

### "Insufficient privileges" Error

- Verify all required permissions are granted
- Ensure admin consent was provided
- Check that app has Application (not Delegated) permissions
- Verify SharePoint admin access

### Missing Site Collections

- Confirm `Sites.Read.All` permission is granted
- Check site collection isn't locked or archived
- Verify site collection URL format
- Ensure site isn't in tenant recycle bin

### No Documents Appearing

- Verify `Files.Read.All` permission
- Check document library permissions
- Ensure files aren't checked out exclusively
- Review file type filters

### Rate Limiting / Throttling

SharePoint Online has throttling limits:
- Based on number of requests and resource consumption
- Varies by tenant size and license

To handle throttling:
- Implement exponential backoff
- Use delta queries for incremental sync
- Reduce sync frequency for large tenants
- Use search-based discovery for large environments

### Certificate Errors (On-Premises)

- Ensure certificate is valid and not expired
- Verify certificate is trusted by SharePoint
- Check certificate chain is complete
- Confirm private key is accessible

---

## Security Considerations

### Application Permissions

- Application permissions provide tenant-wide access
- Consider using Delegated permissions for user-specific access
- Regularly audit permission usage
- Use Azure AD access reviews

### Data Sensitivity

- Be aware of sensitivity labels on documents
- Respect Information Rights Management (IRM)
- Consider regional data residency requirements
- Handle personal sites carefully

### Access Governance

- Use Azure AD conditional access if needed
- Monitor sign-in logs for the app
- Implement alerting for suspicious activity
- Regular access review

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Document content | Indexed | Configurable |
| Metadata | Cached | Refreshed on sync |
| User info | Cached | Refreshed on sync |
| Version history | Latest only | N/A |
| Comments | Optional | Same as documents |

---

## Best Practices

### Site Organization

1. Use consistent site naming conventions
2. Implement sensitivity labeling
3. Document which sites are monitored
4. Use hub sites for logical grouping

### Performance

1. Limit to necessary site collections
2. Use delta queries for efficiency
3. Exclude large media libraries
4. Set appropriate file size limits
5. Schedule full syncs during off-hours

### Compliance

1. Align with Microsoft 365 compliance settings
2. Integrate with sensitivity labels
3. Coordinate with legal for retention requirements
4. Document data access for audits
5. Use content search for eDiscovery

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **SharePoint** > **Disconnect**

2. **In Azure AD:**
   - Go to **App registrations** > **Whiteout AI SharePoint Integration**
   - Delete the application registration
   - Or: Revoke client secrets

3. **In SharePoint Admin:**
   - Review and remove any site-specific app permissions
   - Clear webhook subscriptions

4. **Clean up:**
   - Rotate client secrets
   - Clear indexed data if required
   - Review Microsoft 365 audit logs
