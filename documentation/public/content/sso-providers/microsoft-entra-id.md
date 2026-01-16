# Microsoft Entra ID (Azure AD) SSO Setup Guide

This guide walks you through configuring Microsoft Entra ID (formerly Azure Active Directory) as your Single Sign-On provider for Whiteout AI.

## Overview

Microsoft Entra ID integration provides:
- **OIDC Authentication**: Secure OpenID Connect-based login
- **Group Sync**: Automatic synchronization of Azure AD groups
- **Conditional Access**: Leverage existing Azure AD policies
- **Seamless Experience**: Users sign in with their Microsoft 365 credentials

## Supported Features

| Feature | Supported |
|---------|-----------|
| OIDC Authentication | Yes |
| SAML Authentication | No (use Generic SAML) |
| Group Synchronization | Yes |
| Just-in-Time Provisioning | Yes |
| SCIM Provisioning | Coming Soon |

## Prerequisites

Before you begin, ensure you have:
- **Azure AD Global Administrator** or **Application Administrator** role
- **Whiteout AI Admin** privileges
- Azure AD Premium P1 or P2 (recommended for Conditional Access)

---

## Setup Process

### Step 1: Register Application in Azure AD

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** > **App registrations**
3. Click **New registration**
4. Configure:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI` |
| **Supported account types** | Accounts in this organizational directory only |
| **Redirect URI** | Web: `https://your-whiteout-instance.com/api/auth/callback/azure-ad` |

5. Click **Register**
6. Note the **Application (client) ID** and **Directory (tenant) ID**

### Step 2: Configure Authentication

1. In your app registration, go to **Authentication**
2. Under **Implicit grant and hybrid flows**, enable:
   - [x] ID tokens

3. Under **Advanced settings**:
   - Set **Allow public client flows** to **No**

4. Click **Save**

### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Configure:

| Field | Value |
|-------|-------|
| **Description** | `Whiteout AI SSO` |
| **Expires** | 24 months (or per security policy) |

4. Click **Add**
5. **Immediately copy** the secret value (shown only once)

### Step 4: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Delegated permissions**
4. Add these permissions:

| Permission | Purpose |
|------------|---------|
| `openid` | Basic sign-in |
| `profile` | User profile information |
| `email` | User email address |
| `User.Read` | Read user profile |
| `GroupMember.Read.All` | Read group memberships (for group sync) |

5. Click **Grant admin consent for [Your Organization]**
6. Verify all permissions show green checkmarks

### Step 5: Configure Token Claims (Optional)

To include additional claims in the ID token:

1. Go to **Token configuration**
2. Click **Add optional claim**
3. Select **ID** token type
4. Add claims:
   - `email`
   - `family_name`
   - `given_name`
   - `preferred_username`

### Step 6: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **Microsoft Entra ID**
5. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `Microsoft Entra ID` or `Company SSO` |
| **Client ID** | Application (client) ID from Step 1 |
| **Client Secret** | Secret value from Step 3 |
| **Tenant ID** | Directory (tenant) ID from Step 1 |

6. Click **Save & Test Connection**

---

## Group Synchronization

### Enable Group Sync

1. In Whiteout AI, go to **Identity Provider** > **Microsoft Entra ID** > **Configure**
2. Enable **Sync Groups**
3. Configure sync settings:

| Setting | Recommended Value |
|---------|-------------------|
| **Sync Frequency** | Every 1 hour |
| **Group Filter** | See below |

### Group Filtering

Choose which groups to sync:

| Option | Description |
|--------|-------------|
| **All Groups** | Sync all security groups |
| **Selected Groups** | Choose specific groups |
| **By Prefix** | Groups starting with prefix (e.g., `WhiteoutAI-`) |
| **By Group Type** | Security groups only, M365 groups, etc. |

### Map Groups to Roles

Create group-to-role mappings:

| Azure AD Group | Whiteout AI Role |
|----------------|------------------|
| `WhiteoutAI-Admins` | Administrator |
| `WhiteoutAI-Users` | User |
| `WhiteoutAI-Auditors` | Auditor (read-only) |

---

## Advanced Configuration

### Conditional Access Integration

Whiteout AI respects Azure AD Conditional Access policies:

1. Go to **Azure AD** > **Security** > **Conditional Access**
2. Create or modify policy
3. Under **Cloud apps**, add Whiteout AI app
4. Configure conditions as needed:
   - Require MFA
   - Block risky sign-ins
   - Require compliant device

### Custom Domain

If using a custom domain:

1. Add your domain to Azure AD
2. Verify domain ownership
3. Update redirect URIs in app registration

### Multiple Tenants (B2B)

For multi-tenant scenarios:

1. Change app registration to **Multitenant**
2. Configure Whiteout AI for multi-tenant mode
3. Each tenant admin must consent to the app

---

## Verification

Test your SSO configuration:

### Step 1: Test Sign-In Flow

1. Open Whiteout AI login page
2. Click **Sign in with Microsoft**
3. Authenticate with Azure AD credentials
4. Verify successful redirect to Whiteout AI

### Step 2: Verify User Attributes

1. Check user profile in Whiteout AI
2. Verify email, name, and other attributes populated
3. Confirm user was provisioned correctly

### Step 3: Test Group Membership

1. Trigger a group sync (or wait for scheduled sync)
2. Verify user's groups appear in Whiteout AI
3. Confirm role assignments based on group membership

---

## Troubleshooting

### "AADSTS50011" - Reply URL Mismatch

- Verify redirect URI in Azure AD matches exactly
- Check for trailing slashes
- Ensure protocol is HTTPS

### "AADSTS700016" - Application Not Found

- Verify Client ID is correct
- Check app registration exists
- Ensure app is registered in correct tenant

### "AADSTS65001" - Consent Required

- Admin consent hasn't been granted
- Go to API permissions and grant admin consent
- Or have user consent during first login

### Groups Not Syncing

- Verify `GroupMember.Read.All` permission is granted
- Check group filter isn't too restrictive
- Ensure groups exist and have members
- Review sync logs for errors

### User Attributes Missing

- Add optional claims in Token configuration
- Verify API permissions include required scopes
- Check user has values for those attributes in Azure AD

---

## Security Best Practices

### Application Security

- Use client secrets or certificates (certificates preferred)
- Rotate secrets before expiration
- Enable App Instance Lock for production

### Conditional Access

- Require MFA for Whiteout AI access
- Block legacy authentication protocols
- Configure risk-based policies

### Monitoring

- Enable Azure AD sign-in logs
- Set up alerts for suspicious activity
- Regular review of app access

---

## Attribute Mapping

Default attribute mapping:

| Azure AD Attribute | Whiteout AI Attribute |
|-------------------|----------------------|
| `oid` | User ID |
| `email` / `preferred_username` | Email |
| `given_name` | First Name |
| `family_name` | Last Name |
| `name` | Display Name |
| `groups` | Group Memberships |

---

## Revoking Access

To disconnect Microsoft Entra ID:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **Microsoft Entra ID** > **Remove**

2. **In Azure AD:**
   - Go to **App registrations** > **Whiteout AI**
   - Delete the application registration
   - Or: Disable user assignment to block access

3. **Clean up:**
   - Remove any Conditional Access policies
   - Revoke client secrets
   - Review sign-in logs for confirmation
