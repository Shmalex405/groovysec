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
| SCIM Provisioning | Yes (see the SCIM setup guide) |

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
| **Redirect URI** | Web: `https://<your-whiteout-api-host>/auth/idp/callback` |

5. Click **Register**
6. Note the **Application (client) ID** and **Directory (tenant) ID**

> **Get the redirect URI exactly right.** It is your Whiteout **API** host
> (the same base URL your clients talk to) followed by `/auth/idp/callback` —
> for example `https://api.whiteout.example.com/auth/idp/callback`. It is not
> the admin dashboard URL, and it has no `/api` prefix. A mismatch fails at
> sign-in with `AADSTS50011: The reply URL specified in the request does not
> match the reply URLs configured for the application`. Self-hosted
> deployments: this must match the `APP_BASE_URL` your backend is configured
> with, including scheme and any non-default port.

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

Whiteout uses Entra in **two different ways**, and each needs its own kind of
permission. Granting only the first is the most common setup mistake: users can
sign in, but user and group sync silently returns nothing.

**a. Delegated permissions — interactive sign-in**

1. Go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph**
3. Select **Delegated permissions**
4. Add:

| Permission | Purpose |
|------------|---------|
| `openid` | Basic sign-in |
| `profile` | User profile information |
| `email` | User email address |
| `User.Read` | Read the signed-in user's profile |
| `GroupMember.Read.All` | Read the signed-in user's group memberships |

**b. Application permissions — directory sync**

Sync runs as a background job with no user present, using the client-credentials
flow. Delegated permissions do not apply to it, **even ones with the same name**.

5. Click **Add a permission** > **Microsoft Graph** > **Application permissions**
6. Add:

| Permission | Purpose |
|------------|---------|
| `User.Read.All` | Enumerate directory users during **Sync Users** |
| `Group.Read.All` | Enumerate groups and their members during **Sync Groups** |

7. Click **Grant admin consent for [Your Organization]**
8. Verify every permission shows a green checkmark under **Status** — an added
   but unconsented permission fails exactly like a missing one

> **Why this matters beyond group sync.** Zero-touch MDM enrollment maps each
> managed device to a user by email. If directory sync never populated your
> users, every device fails that mapping and token minting skips your entire
> fleet — with no error on the MDM side. Whiteout's **Test Connection** button
> probes both directory endpoints and fails loudly if these Application
> permissions are missing, so run it after granting consent.

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
2. Navigate to **Integrations** > **Identity Providers (SSO)**
3. Click **Add Provider**
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

1. In Whiteout AI, go to **Integrations** > **Identity Providers (SSO)** > **Microsoft Entra ID** > **Manage**
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

- The redirect URI must be `https://<your-whiteout-api-host>/auth/idp/callback`
  — the API host, with no `/api` prefix
- It must match your backend's configured `APP_BASE_URL` exactly: scheme, host,
  port, and no trailing slash
- Compare it character-for-character against the value in **Authentication** >
  **Redirect URIs**; Entra does no normalisation

### "AADSTS700016" - Application Not Found

- Verify Client ID is correct
- Check app registration exists
- Ensure app is registered in correct tenant

### "AADSTS65001" - Consent Required

- Admin consent hasn't been granted
- Go to API permissions and grant admin consent
- Or have user consent during first login

### Groups or Users Not Syncing

- Verify `User.Read.All` and `Group.Read.All` are granted as **Application**
  permissions, with admin consent. This is the usual cause: the Delegated
  permissions of the same name cover interactive sign-in only, so users can log
  in normally while sync returns nothing
- Click **Test Connection** — it probes both directory endpoints and names any
  permission that is missing
- Check the group filter isn't too restrictive
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
   - **Integrations** > **Identity Providers (SSO)** > **Microsoft Entra ID** > **Disconnect**

2. **In Azure AD:**
   - Go to **App registrations** > **Whiteout AI**
   - Delete the application registration
   - Or: Disable user assignment to block access

3. **Clean up:**
   - Remove any Conditional Access policies
   - Revoke client secrets
   - Review sign-in logs for confirmation
