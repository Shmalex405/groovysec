# Google Drive Integration Setup Guide

This guide walks you through connecting Google Drive to Whiteout AI, enabling governance and compliance monitoring for your cloud file storage.

## Overview

The Google Drive integration allows Whiteout AI to:
- Index and monitor documents, spreadsheets, and files
- Detect sensitive information in stored content
- Enforce compliance policies on document-related AI queries
- Track which Drive content users reference in AI conversations

## Prerequisites

Before you begin, ensure you have:
- **Google Workspace Admin** access
- **Whiteout AI Admin** privileges
- Google Workspace Business, Enterprise, or Education edition

---

## Setup Process

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown > **New Project**
3. Configure:

| Field | Value |
|-------|-------|
| **Project name** | `Whiteout AI Integration` |
| **Organization** | Select your organization |
| **Location** | Select appropriate folder |

4. Click **Create**

### Step 2: Enable Required APIs

1. In your project, go to **APIs & Services** > **Library**
2. Search for and enable:
   - **Google Drive API**
   - **Admin SDK API** (for domain-wide delegation)

### Step 3: Create a Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Configure:

| Field | Value |
|-------|-------|
| **Service account name** | `whiteout-ai-drive` |
| **Service account ID** | Auto-generated |
| **Description** | `Service account for Whiteout AI Drive integration` |

4. Click **Create and Continue**
5. Skip role assignment (click **Continue**)
6. Click **Done**

### Step 4: Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** format
5. Click **Create**
6. **Save the downloaded JSON file securely**

### Step 5: Enable Domain-Wide Delegation

1. In the service account details, click **Show Advanced Settings**
2. Click **Enable Google Workspace Domain-Wide Delegation**
3. Note the **Unique ID** (Client ID)

### Step 6: Configure Domain-Wide Delegation in Google Admin

1. Go to [Google Admin Console](https://admin.google.com)
2. Navigate to **Security** > **API Controls** > **Domain-wide Delegation**
3. Click **Add new**
4. Enter:

| Field | Value |
|-------|-------|
| **Client ID** | The Unique ID from Step 5 |
| **OAuth Scopes** | See below |

**Required OAuth Scopes:**
```
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/drive.metadata.readonly
https://www.googleapis.com/auth/admin.directory.user.readonly
https://www.googleapis.com/auth/admin.directory.group.readonly
```

5. Click **Authorize**

### Step 7: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Data Integrations**
3. Find **Google Drive** and click **Connect**
4. Upload the JSON key file from Step 4
5. Enter:

| Field | Value |
|-------|-------|
| **Domain** | `your-company.com` |
| **Admin Email** | A super admin email for impersonation |

6. Click **Save & Test Connection**

---

## Alternative: OAuth 2.0 Setup (User Consent)

For limited access without domain-wide delegation:

### Step 1: Create OAuth 2.0 Credentials

1. In Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure:

| Field | Value |
|-------|-------|
| **Application type** | Web application |
| **Name** | `Whiteout AI` |
| **Authorized redirect URIs** | `https://your-whiteout-instance.com/api/integrations/google-drive/callback` |

4. Click **Create**
5. Note the **Client ID** and **Client Secret**

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **Internal** (for workspace users only)
3. Configure app information:
   - App name: `Whiteout AI`
   - User support email: Your admin email
   - Developer contact: Your email

4. Add scopes:
   - `.../auth/drive.readonly`
   - `.../auth/drive.metadata.readonly`

5. Save and publish

### Step 3: Configure in Whiteout AI

1. Select **OAuth 2.0** method
2. Enter Client ID and Client Secret
3. Authorize access

---

## Post-Setup Configuration

### Folder Selection

Configure which folders/drives to monitor:

1. Go to **Settings** > **Data Integrations** > **Google Drive** > **Configure**
2. Select scope:

| Option | Description |
|--------|-------------|
| **All My Drives** | All user drives in domain |
| **Shared Drives** | Team/shared drives only |
| **Specific Folders** | Select specific folders |
| **User Selection** | Drives of specific users |

### File Type Filtering

Select which file types to index:

| File Type | Extension | Recommended |
|-----------|-----------|-------------|
| Google Docs | gdoc | Yes |
| Google Sheets | gsheet | Yes |
| Google Slides | gslide | Yes |
| PDFs | pdf | Yes |
| Word Documents | docx, doc | Yes |
| Excel Spreadsheets | xlsx, xls | Yes |
| Text Files | txt, md | Yes |
| Images | png, jpg | Metadata only |
| Videos | mp4, mov | Metadata only |

### Sync Settings

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| **Full sync interval** | 24 hours | Complete re-index |
| **Incremental sync** | 1 hour | Process changes |
| **File size limit** | 10 MB | Skip larger files |

---

## Advanced Configuration

### Shared Drive Access

For Shared Drives (formerly Team Drives):

1. Create a Google Group for the service account
2. Add the service account email to the group
3. Grant the group "Content Manager" access to Shared Drives

### Labels and Metadata

Use Drive labels for classification:

1. Create labels in Google Admin > Drive Labels
2. Apply labels to sensitive files
3. Configure Whiteout AI to recognize labels

### Query Filtering

Use Drive search queries to filter content:

**Include specific folders:**
```
'FOLDER_ID' in parents
```

**Exclude specific users:**
```
not 'user@company.com' in owners
```

**Modified date range:**
```
modifiedTime > '2024-01-01'
```

---

## Verification

Test your integration:

1. **Connection Test**: Click **Test Connection**
2. **File Discovery**: Verify files appear in Data Sources
3. **Content Access**: Check document content is readable
4. **Query Test**: Ask the AI about a Drive document

---

## Troubleshooting

### "Invalid credentials" Error

- Verify the JSON key file is complete
- Ensure the service account exists and is active
- Check domain-wide delegation is properly configured

### "Access denied" Error

- Verify OAuth scopes match exactly
- Check the admin email has super admin privileges
- Ensure the client ID in Admin Console matches

### No Files Appearing

- Confirm Drive API is enabled
- Check service account has domain-wide delegation
- Verify the admin email can access target files
- For Shared Drives, ensure service account has access

### Partial File Access

- Some files may have restricted sharing settings
- Check file-level permissions
- Verify no DLP policies are blocking access

### Rate Limiting

Google Drive has quotas:
- 1,000,000 queries per day
- 12,000 queries per user per minute

To manage quotas:
- Increase sync intervals
- Limit users/folders monitored
- Use incremental sync with change tokens

---

## Security Considerations

### Service Account Security

- **Protect the JSON key file** - it provides full access
- Store keys in secure vault
- Rotate keys periodically
- Limit who has access to the key file

### Domain-Wide Delegation Risks

- Service account can impersonate any user
- Limit scopes to minimum required
- Monitor usage in Cloud Console audit logs
- Consider using per-user OAuth for sensitive environments

### Data Classification

- Use Google Drive labels for sensitivity classification
- Configure Whiteout AI to respect classification
- Implement appropriate handling for each classification level

---

## Data Handling

| Data Type | Storage | Retention |
|-----------|---------|-----------|
| Document content | Indexed | Configurable |
| File metadata | Cached | Refreshed on sync |
| User info | Cached | Refreshed on sync |
| Permissions | Cached | Refreshed on sync |
| Revision history | Not indexed | N/A |

---

## Best Practices

### Organization

1. Use Shared Drives for team content
2. Implement folder structure policies
3. Use labels for classification
4. Document monitoring scope

### Performance

1. Limit to necessary folders/users
2. Use appropriate file size limits
3. Implement incremental syncing
4. Schedule full syncs during off-hours

### Compliance

1. Align with Google Vault retention policies
2. Coordinate with legal for eDiscovery
3. Document data access for audits
4. Respect regional data residency

---

## Revoking Access

To disconnect the integration:

1. **In Whiteout AI:**
   - **Settings** > **Data Integrations** > **Google Drive** > **Disconnect**

2. **In Google Cloud:**
   - Delete or disable the service account
   - Remove API credentials

3. **In Google Admin:**
   - Remove domain-wide delegation entry for the client ID

4. **Clean up:**
   - Delete downloaded key files
   - Clear indexed data if required
   - Review Cloud Console audit logs
