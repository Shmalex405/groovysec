# Google Workspace SSO Setup Guide

This guide walks you through configuring Google Workspace as your Single Sign-On provider for Whiteout AI.

## Overview

Google Workspace integration provides:
- **OIDC Authentication**: Secure OpenID Connect-based login
- **Group Sync**: Automatic synchronization of Google Groups
- **Seamless Experience**: Users sign in with their Google Workspace credentials
- **Domain Restriction**: Limit access to specific Google Workspace domains

## Supported Features

| Feature | Supported |
|---------|-----------|
| OIDC Authentication | Yes |
| SAML Authentication | No (use Generic SAML) |
| Group Synchronization | Yes |
| Just-in-Time Provisioning | Yes |
| Domain Restriction | Yes |

## Prerequisites

Before you begin, ensure you have:
- **Google Workspace Super Admin** access
- **Google Cloud Console** access
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
| **Project name** | `Whiteout AI SSO` |
| **Organization** | Select your organization |

4. Click **Create**

### Step 2: Configure OAuth Consent Screen

1. In your project, go to **APIs & Services** > **OAuth consent screen**
2. Select **Internal** (for Google Workspace users only)
3. Configure app information:

| Field | Value |
|-------|-------|
| **App name** | `Whiteout AI` |
| **User support email** | Your admin email |
| **App logo** | Upload (optional) |
| **App domain** | `https://your-whiteout-instance.com` |
| **Developer contact** | Your admin email |

4. Click **Save and Continue**

### Step 3: Configure Scopes

Add the following scopes:

| Scope | Purpose |
|-------|---------|
| `openid` | Basic sign-in |
| `email` | User email address |
| `profile` | User profile information |

For group sync, also add:
| Scope | Purpose |
|-------|---------|
| `https://www.googleapis.com/auth/admin.directory.group.readonly` | Read groups |

5. Click **Save and Continue**
6. Review and click **Back to Dashboard**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure:

| Field | Value |
|-------|-------|
| **Application type** | Web application |
| **Name** | `Whiteout AI SSO` |
| **Authorized JavaScript origins** | `https://your-whiteout-instance.com` |
| **Authorized redirect URIs** | `https://your-whiteout-instance.com/api/auth/callback/google` |

4. Click **Create**
5. Note the **Client ID** and **Client Secret**

### Step 5: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **Google Workspace**
5. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `Google Workspace` or `Company SSO` |
| **Client ID** | From Step 4 |
| **Client Secret** | From Step 4 |
| **Hosted Domain** | Your Google Workspace domain (e.g., `company.com`) |

6. Click **Save & Test Connection**

---

## Group Synchronization

### Enable Admin SDK

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for **Admin SDK API**
3. Click **Enable**

### Configure Domain-Wide Delegation

1. Go to **APIs & Services** > **Credentials**
2. Click on your OAuth client
3. Note the **Client ID** (numerical)

### Set Up Domain-Wide Delegation in Google Admin

1. Go to [Google Admin Console](https://admin.google.com)
2. Navigate to **Security** > **API Controls** > **Domain-wide Delegation**
3. Click **Add new**
4. Enter:

| Field | Value |
|-------|-------|
| **Client ID** | OAuth client ID from Google Cloud |
| **OAuth scopes** | `https://www.googleapis.com/auth/admin.directory.group.readonly` |

5. Click **Authorize**

### Configure Service Account (Alternative)

For more robust group sync:

1. In Google Cloud Console, go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | `whiteout-ai-groups` |
| **ID** | Auto-generated |

4. Grant role: **No role needed** (we'll use domain delegation)
5. Click **Done**

6. Click on the service account
7. Go to **Keys** > **Add Key** > **Create new key** > **JSON**
8. Download the key file

9. In Google Admin Console, add domain-wide delegation for the service account's client ID

### Configure Group Sync in Whiteout AI

1. Go to **Identity Provider** > **Google Workspace** > **Configure**
2. Enable **Sync Groups**
3. Upload the service account JSON key (if using service account method)
4. Enter the **Admin Email** (a super admin email for impersonation)
5. Configure group filter:

| Option | Description |
|--------|-------------|
| **All Groups** | Sync all Google Groups |
| **Selected Groups** | Choose specific groups |
| **By Prefix** | Groups with specific naming pattern |

### Map Groups to Roles

| Google Group | Whiteout AI Role |
|--------------|------------------|
| `whiteout-admins@company.com` | Administrator |
| `whiteout-users@company.com` | User |
| `whiteout-auditors@company.com` | Auditor |

---

## Advanced Configuration

### Domain Restriction

Restrict login to specific domains:

1. In Whiteout AI, go to **Identity Provider** > **Google Workspace**
2. Configure **Hosted Domain**:
   - Single domain: `company.com`
   - Multiple domains: `company.com,subsidiary.com`

### Organizational Unit Filtering

Limit access by Google Workspace organizational unit:

1. In Google Admin Console, go to **Apps** > **Web and mobile apps**
2. Add Whiteout AI as a custom SAML app (for OU-based access control)
3. Configure access by organizational unit

### Custom Claims

Add custom attributes to the ID token:

1. This requires using Google Cloud Identity Platform
2. Configure custom claims in Identity Platform settings
3. Map claims in Whiteout AI

---

## Verification

### Test Sign-In Flow

1. Open Whiteout AI login page
2. Click **Sign in with Google**
3. Select your Google Workspace account
4. Verify successful redirect to Whiteout AI

### Verify User Attributes

1. Check user profile in Whiteout AI
2. Verify email, name populated correctly
3. Confirm user was provisioned

### Test Group Sync

1. Trigger a group sync
2. Verify user's groups appear in Whiteout AI
3. Confirm role assignments based on groups

---

## Troubleshooting

### "Access blocked" Error

- Verify app is configured as Internal in OAuth consent screen
- Check user's domain matches hosted domain
- Ensure API access is enabled for users

### "Invalid client" Error

- Verify Client ID and Secret are correct
- Check redirect URI matches exactly
- Ensure OAuth client is not deleted

### "redirect_uri_mismatch" Error

- Exact match required for redirect URI
- Check for trailing slashes
- Verify protocol is HTTPS

### Groups Not Syncing

- Verify Admin SDK API is enabled
- Check domain-wide delegation is configured
- Ensure admin email has super admin access
- Verify OAuth scopes include group read permission

### "Not authorized" Error

- User's domain doesn't match hosted domain
- User's OU doesn't have app access
- Account is suspended or deleted

---

## Security Best Practices

### Application Security

- Use Internal app type to restrict to organization
- Rotate client secrets periodically
- Monitor OAuth consent grants

### Access Control

- Configure hosted domain restriction
- Use organizational unit controls
- Regular review of app access

### Monitoring

- Enable Google Workspace audit logs
- Set up alerts for suspicious sign-ins
- Review connected apps regularly

---

## Attribute Mapping

Default attribute mapping:

| Google Attribute | Whiteout AI Attribute |
|------------------|----------------------|
| `sub` | User ID |
| `email` | Email |
| `given_name` | First Name |
| `family_name` | Last Name |
| `name` | Display Name |
| `picture` | Avatar URL |
| `hd` | Domain |

---

## Revoking Access

To disconnect Google Workspace:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **Google Workspace** > **Remove**

2. **In Google Cloud Console:**
   - Go to **APIs & Services** > **Credentials**
   - Delete the OAuth client

3. **In Google Admin Console:**
   - Remove domain-wide delegation entry
   - Revoke service account access

4. **Clean up:**
   - Delete service account keys
   - Review admin console audit logs
   - Notify affected users
