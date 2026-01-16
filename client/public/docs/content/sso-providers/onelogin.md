# OneLogin SSO Setup Guide

This guide walks you through configuring OneLogin as your Single Sign-On provider for Whiteout AI.

## Overview

OneLogin integration provides:
- **OIDC Authentication**: OpenID Connect-based secure login
- **SAML Authentication**: SAML 2.0 support for enterprise requirements
- **Group Sync**: Automatic synchronization of OneLogin groups/roles
- **SCIM Provisioning**: Automated user lifecycle management

## Supported Features

| Feature | Supported |
|---------|-----------|
| OIDC Authentication | Yes |
| SAML Authentication | Yes |
| Group Synchronization | Yes |
| Just-in-Time Provisioning | Yes |
| SCIM Provisioning | Yes |

## Prerequisites

Before you begin, ensure you have:
- **OneLogin Super User** or **Administrator** access
- **Whiteout AI Admin** privileges
- OneLogin subscription with OIDC/SAML support

---

## Option A: OIDC Setup (Recommended)

### Step 1: Create OIDC Application in OneLogin

1. Log in to your OneLogin Admin portal
2. Navigate to **Applications** > **Applications**
3. Click **Add App**
4. Search for "OpenID Connect" and select **OpenId Connect (OIDC)**
5. Click **Save**

### Step 2: Configure OIDC Application

Go to the **Configuration** tab:

| Field | Value |
|-------|-------|
| **Login Url** | `https://your-whiteout-instance.com/login` |
| **Redirect URI's** | `https://your-whiteout-instance.com/api/auth/callback/onelogin` |
| **Post Logout Redirect URI** | `https://your-whiteout-instance.com` |
| **Token Endpoint** | POST |
| **Application Type** | Web |

### Step 3: Configure Token Settings

Go to the **SSO** tab:

| Field | Recommended Value |
|-------|-------------------|
| **Token Lifetime (minutes)** | 60 |
| **Refresh Token Lifetime (minutes)** | 10080 (7 days) |

### Step 4: Get Credentials

On the **SSO** tab, note:
- **Client ID**
- **Client Secret** (click to reveal)
- **Issuer URL** (e.g., `https://your-company.onelogin.com/oidc/2`)

### Step 5: Assign Users

1. Go to **Users** tab
2. Add users or roles to the application

### Step 6: Configure Whiteout AI (OIDC)

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **OneLogin**
5. Choose **OIDC** as the protocol
6. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `OneLogin SSO` |
| **Issuer URL** | From Step 4 |
| **Client ID** | From Step 4 |
| **Client Secret** | From Step 4 |

7. Click **Save & Test Connection**

---

## Option B: SAML Setup

### Step 1: Create SAML Application in OneLogin

1. Log in to your OneLogin Admin portal
2. Navigate to **Applications** > **Applications**
3. Click **Add App**
4. Search for "SAML Custom Connector" and select **SAML Custom Connector (Advanced)**
5. Enter display name: `Whiteout AI`
6. Click **Save**

### Step 2: Configure SAML Application

Go to the **Configuration** tab:

| Field | Value |
|-------|-------|
| **Audience (EntityID)** | `https://your-whiteout-instance.com` |
| **ACS (Consumer) URL** | `https://your-whiteout-instance.com/api/auth/saml/callback` |
| **ACS URL Validator** | `^https:\/\/your-whiteout-instance\.com\/api\/auth\/saml\/callback$` |
| **Single Logout URL** | `https://your-whiteout-instance.com/logout` |
| **SAML nameID format** | Email |
| **SAML signature element** | Both |

### Step 3: Configure Parameters

Go to the **Parameters** tab and add:

| Field Name | Value | Include in SAML |
|------------|-------|-----------------|
| `email` | Email | Yes |
| `firstName` | First Name | Yes |
| `lastName` | Last Name | Yes |

For groups (optional):
| Field Name | Value | Include in SAML |
|------------|-------|-----------------|
| `groups` | User Roles | Yes |

### Step 4: Get SAML Metadata

Go to the **SSO** tab:
1. Note the **Issuer URL**
2. Note the **SAML 2.0 Endpoint (HTTP)**
3. Download **X.509 Certificate** (click "View Details")

Or copy the **Metadata URL** for automatic configuration.

### Step 5: Configure Whiteout AI (SAML)

1. Navigate to **Settings** > **Identity Provider**
2. Click **Add Identity Provider**
3. Select **OneLogin**
4. Choose **SAML** as the protocol
5. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `OneLogin SSO (SAML)` |
| **IdP SSO URL** | SAML 2.0 Endpoint from Step 4 |
| **IdP Issuer** | Issuer URL from Step 4 |
| **Certificate** | Upload certificate from Step 4 |

Or use metadata:

| Field | Value |
|-------|-------|
| **Metadata URL** | OneLogin metadata URL |

6. Click **Save & Test Connection**

---

## Group Synchronization

### Configure Groups/Roles in OneLogin

1. Go to **Users** > **Roles**
2. Create roles for Whiteout AI access:
   - `WhiteoutAI-Admin`
   - `WhiteoutAI-User`
   - `WhiteoutAI-Auditor`

### For OIDC - Add Groups Claim

1. Go to your Whiteout AI app in OneLogin
2. Navigate to **Parameters**
3. Add a parameter:

| Field | Value |
|-------|-------|
| **Field name** | `groups` |
| **Value** | User Roles |
| **Include in Token** | Yes |

### For SAML - Add Groups Attribute

Already configured in Step 3 of SAML setup.

### Map Groups to Roles in Whiteout AI

1. Go to **Identity Provider** > **OneLogin** > **Configure**
2. Enable **Sync Groups**
3. Add mappings:

| OneLogin Role | Whiteout AI Role |
|---------------|------------------|
| `WhiteoutAI-Admin` | Administrator |
| `WhiteoutAI-User` | User |
| `WhiteoutAI-Auditor` | Auditor |

---

## SCIM Provisioning

### Step 1: Enable SCIM in Whiteout AI

1. Go to **Settings** > **Identity Provider** > **OneLogin**
2. Enable **SCIM Provisioning**
3. Copy:
   - **SCIM Base URL**
   - **Bearer Token**

### Step 2: Configure SCIM in OneLogin

1. In OneLogin, go to your Whiteout AI app
2. Navigate to **Configuration** tab
3. Under **API Connection**, enter:

| Field | Value |
|-------|-------|
| **SCIM Base URL** | From Whiteout AI |
| **SCIM Bearer Token** | From Whiteout AI |

4. Click **Enable** for API connection

### Step 3: Configure Provisioning

1. Go to **Provisioning** tab
2. Enable provisioning workflows:
   - [x] Create user
   - [x] Delete user
   - [x] Update user
   - [x] Sync roles

3. Configure attribute mappings

---

## Verification

### Test OIDC Sign-In

1. Open Whiteout AI login page
2. Click **Sign in with OneLogin**
3. Authenticate with OneLogin credentials
4. Verify redirect to Whiteout AI

### Test SAML Sign-In

1. **SP-initiated**: Start from Whiteout AI login
2. **IdP-initiated**: Click Whiteout AI from OneLogin portal
3. Verify successful authentication

### Verify Groups

1. Trigger a group sync
2. Check user's groups in Whiteout AI
3. Confirm role assignments

---

## Troubleshooting

### "Invalid client" Error (OIDC)

- Verify Client ID and Secret
- Check Issuer URL format
- Ensure app is enabled in OneLogin

### "Invalid signature" Error (SAML)

- Re-download certificate from OneLogin
- Check certificate hasn't expired
- Verify correct certificate uploaded

### "User not found" Error

- Verify user is assigned to the app
- Check user status is active
- Ensure proper role assignment

### Groups Not Appearing

- Verify groups parameter is configured
- Check user has roles assigned
- Ensure "Include in Token/SAML" is enabled

### Provisioning Failures

- Verify SCIM credentials are correct
- Check API connection status in OneLogin
- Review provisioning logs

---

## Security Best Practices

### Application Security

- Rotate client secrets regularly
- Use strong authentication policies
- Enable MFA for all users

### Access Control

- Use role-based app assignments
- Configure IP restrictions if needed
- Regular review of user access

### Monitoring

- Enable OneLogin events
- Set up security alerts
- Review login activity regularly

---

## Attribute Mapping

### OIDC Claims

| OneLogin Claim | Whiteout AI Attribute |
|----------------|----------------------|
| `sub` | User ID |
| `email` | Email |
| `given_name` | First Name |
| `family_name` | Last Name |
| `name` | Display Name |
| `groups` | Group Memberships |

### SAML Attributes

| SAML Attribute | Whiteout AI Attribute |
|----------------|----------------------|
| `NameID` | Email / User ID |
| `email` | Email |
| `firstName` | First Name |
| `lastName` | Last Name |
| `groups` | Group Memberships |

---

## Revoking Access

To disconnect OneLogin:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **OneLogin** > **Remove**

2. **In OneLogin:**
   - Go to **Applications** > **Whiteout AI**
   - Delete or disable the application
   - Remove user assignments

3. **Clean up:**
   - Revoke SCIM tokens
   - Review OneLogin events
   - Notify affected users
