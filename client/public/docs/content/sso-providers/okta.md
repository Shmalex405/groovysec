# Okta SSO Setup Guide

This guide walks you through configuring Okta as your Single Sign-On provider for Whiteout AI.

## Overview

Okta integration provides:
- **OIDC Authentication**: OpenID Connect-based secure login
- **Group Sync**: Automatic synchronization of Okta groups
- **SCIM Provisioning**: Automated user provisioning (Enterprise)

## Supported Features

| Feature | Supported |
|---------|-----------|
| OIDC Authentication | Yes |
| SAML Authentication | Not available. Use OIDC |
| Group Synchronization | Yes |
| Just-in-Time Provisioning | Yes |
| SCIM Provisioning | Yes (Enterprise) |

> **Note:** SAML sign-in is not available in Whiteout AI. Connect Okta with OIDC, as described below.

## Prerequisites

Before you begin, ensure you have:
- **Okta Administrator** access
- **Whiteout AI Admin** privileges
- Okta Workforce Identity Cloud subscription

---

## OIDC Setup

### Step 1: Create OIDC Application in Okta

1. Log in to your Okta Admin Console
2. Navigate to **Applications** > **Applications**
3. Click **Create App Integration**
4. Select:
   - **Sign-in method**: OIDC - OpenID Connect
   - **Application type**: Web Application
5. Click **Next**

### Step 2: Configure OIDC Settings

| Field | Value |
|-------|-------|
| **App integration name** | `Whiteout AI` |
| **Logo** | Upload your logo (optional) |
| **Grant type** | Authorization Code |
| **Sign-in redirect URIs** | `https://your-whiteout-instance.com/api/auth/callback/okta` |
| **Sign-out redirect URIs** | `https://your-whiteout-instance.com/logout` |

### Step 3: Configure Assignments

1. Under **Assignments**, choose:
   - **Controlled access**: Limit access to selected groups
   - **Allow everyone**: All users in your organization

2. Assign users or groups as needed

### Step 4: Get Credentials

1. After saving, go to the **General** tab
2. Note the **Client ID**
3. Under **Client Secrets**, click **Generate new secret**
4. Copy the **Client secret**
5. Note your **Okta domain** (e.g., `your-company.okta.com`)

### Step 5: Configure Whiteout AI (OIDC)

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **Okta**
5. Choose **OIDC** as the protocol
6. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `Okta SSO` |
| **Okta Domain** | `your-company.okta.com` |
| **Client ID** | From Step 4 |
| **Client Secret** | From Step 4 |

7. Click **Save & Test Connection**

---

## Group Synchronization

### Enable Group Sync

1. In Whiteout AI, go to **Identity Provider** > **Okta** > **Configure**
2. Enable **Sync Groups**

### For OIDC:

Configure groups claim in Okta:

1. Go to **Security** > **API** > **Authorization Servers**
2. Select your authorization server (or `default`)
3. Go to **Claims** tab
4. Add claim:

| Field | Value |
|-------|-------|
| **Name** | `groups` |
| **Include in token type** | ID Token |
| **Value type** | Groups |
| **Filter** | Matches regex: `.*` |

### Map Groups to Roles

| Okta Group | Whiteout AI Role |
|------------|------------------|
| `WhiteoutAI-Admins` | Administrator |
| `WhiteoutAI-Users` | User |
| `WhiteoutAI-Auditors` | Auditor |

---

## SCIM Provisioning (Enterprise)

### Step 1: Enable SCIM in Whiteout AI

1. Go to **Settings** > **Identity Provider** > **Okta**
2. Enable **SCIM Provisioning**
3. Copy the **SCIM Base URL** and **Bearer Token**

### Step 2: Configure SCIM in Okta

1. In Okta, go to your Whiteout AI app
2. Go to **Provisioning** tab
3. Click **Configure API Integration**
4. Enable **Enable API integration**
5. Enter:

| Field | Value |
|-------|-------|
| **Base URL** | SCIM Base URL from Whiteout AI |
| **API Token** | Bearer Token from Whiteout AI |

6. Click **Test API Credentials**
7. Click **Save**

### Step 3: Enable Provisioning Features

1. Go to **Provisioning** > **To App**
2. Click **Edit**
3. Enable:
   - [x] Create Users
   - [x] Update User Attributes
   - [x] Deactivate Users

4. Configure attribute mappings as needed

---

## Verification

### Test OIDC Sign-In

1. Open Whiteout AI login page
2. Click **Sign in with Okta**
3. Authenticate with Okta credentials
4. Verify redirect to Whiteout AI

### Verify Group Membership

1. Trigger a group sync
2. Check user's groups in Whiteout AI
3. Confirm role assignments

---

## Troubleshooting

### "Invalid client" Error (OIDC)

- Verify Client ID and Secret are correct
- Check Okta domain format (no https://)
- Ensure app is active in Okta

### Groups Not Appearing

- **OIDC**: Verify groups claim is configured in authorization server
- Ensure user is assigned to groups in Okta

### User Not Provisioned

- Check user is assigned to app in Okta
- Verify SCIM provisioning is enabled
- Review Okta provisioning logs

---

## Security Best Practices

### Application Security

- Rotate client secrets periodically
- Use PKCE for additional OIDC security
- Enable MFA in Okta for all users

### Access Control

- Use Okta sign-on policies
- Configure session timeouts
- Enable suspicious activity detection

### Monitoring

- Enable Okta System Log
- Set up alerts for failed logins
- Regular review of app assignments

---

## Attribute Mapping

### OIDC Claims

| Okta Claim | Whiteout AI Attribute |
|------------|----------------------|
| `sub` | User ID |
| `email` | Email |
| `given_name` | First Name |
| `family_name` | Last Name |
| `name` | Display Name |
| `groups` | Group Memberships |

## Revoking Access

To disconnect Okta:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **Okta** > **Remove**

2. **In Okta:**
   - Go to **Applications** > **Whiteout AI**
   - Deactivate or delete the application
   - Remove user assignments

3. **Clean up:**
   - Revoke SCIM tokens if used
   - Review Okta system logs
   - Notify affected users
