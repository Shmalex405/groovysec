# JumpCloud SSO Setup Guide

This guide walks you through configuring JumpCloud as your Single Sign-On provider for Whiteout AI.

## Overview

JumpCloud integration provides:
- **OIDC Authentication**: OpenID Connect-based secure login
- **SAML Authentication**: SAML 2.0 support
- **Group Sync**: Automatic synchronization of JumpCloud groups
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
- **JumpCloud Administrator** access
- **Whiteout AI Admin** privileges
- JumpCloud subscription with SSO support

---

## Option A: OIDC Setup (Recommended)

### Step 1: Create OIDC Application in JumpCloud

1. Log in to your JumpCloud Admin Console
2. Navigate to **SSO Applications**
3. Click **+ Add New Application**
4. Select **Custom OIDC App**
5. Click **Configure**

### Step 2: Configure OIDC Settings

**General Info:**

| Field | Value |
|-------|-------|
| **Display Label** | `Whiteout AI` |
| **Description** | `AI Governance Platform` |
| **Logo** | Upload (optional) |

**SSO Configuration:**

| Field | Value |
|-------|-------|
| **Redirect URIs** | `https://your-whiteout-instance.com/api/auth/callback/jumpcloud` |
| **Login URL** | `https://your-whiteout-instance.com/login` |
| **Client Authentication Type** | Client Secret Basic |

### Step 3: Configure Attribute Mapping

Add standard claims:

| JumpCloud Attribute | OIDC Claim |
|---------------------|------------|
| Email | `email` |
| First Name | `given_name` |
| Last Name | `family_name` |
| Username | `preferred_username` |

For groups:
| JumpCloud Attribute | OIDC Claim |
|---------------------|------------|
| Groups | `groups` |

### Step 4: Get Credentials

After saving, note:
- **Client ID**
- **Client Secret**
- **Issuer URL** (format: `https://oauth.id.jumpcloud.com/`)

### Step 5: Activate Application

1. Toggle the application to **Active**
2. Assign user groups to the application

### Step 6: Configure Whiteout AI (OIDC)

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **JumpCloud**
5. Choose **OIDC**
6. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `JumpCloud SSO` |
| **Issuer URL** | From Step 4 |
| **Client ID** | From Step 4 |
| **Client Secret** | From Step 4 |

7. Click **Save & Test Connection**

---

## Option B: SAML Setup

### Step 1: Create SAML Application in JumpCloud

1. Log in to JumpCloud Admin Console
2. Navigate to **SSO Applications**
3. Click **+ Add New Application**
4. Select **Custom SAML App**
5. Click **Configure**

### Step 2: Configure SAML Settings

**General Info:**

| Field | Value |
|-------|-------|
| **Display Label** | `Whiteout AI` |
| **Description** | `AI Governance Platform SAML` |

**SP Configuration:**

| Field | Value |
|-------|-------|
| **IdP Entity ID** | Leave default (JumpCloud generates) |
| **SP Entity ID** | `https://your-whiteout-instance.com` |
| **ACS URL** | `https://your-whiteout-instance.com/api/auth/saml/callback` |
| **SAMLSubject NameID** | email |
| **SAMLSubject NameID Format** | emailAddress |
| **Signature Algorithm** | RSA-SHA256 |

### Step 3: Configure Attribute Statements

Add attributes:

| Name | JumpCloud Attribute |
|------|---------------------|
| `email` | Email |
| `firstName` | First Name |
| `lastName` | Last Name |

For groups:
| Name | JumpCloud Attribute |
|------|---------------------|
| `groups` | Groups |

### Step 4: Download SAML Metadata

1. Save the application
2. Click **Export Metadata**
3. Download the XML file

Or note manually:
- **IdP SSO URL**
- **IdP Entity ID**
- **Certificate** (download X.509)

### Step 5: Activate and Assign

1. Toggle application to **Active**
2. Assign user groups

### Step 6: Configure Whiteout AI (SAML)

1. Navigate to **Settings** > **Identity Provider**
2. Click **Add Identity Provider**
3. Select **JumpCloud**
4. Choose **SAML**
5. Upload metadata XML or enter manually:

| Field | Value |
|-------|-------|
| **IdP SSO URL** | From Step 4 |
| **IdP Entity ID** | From Step 4 |
| **Certificate** | From Step 4 |

6. Click **Save & Test Connection**

---

## Group Synchronization

### Create Groups in JumpCloud

1. Navigate to **User Groups**
2. Create groups for Whiteout AI:
   - `WhiteoutAI-Admins`
   - `WhiteoutAI-Users`
   - `WhiteoutAI-Auditors`

### Assign Groups to Application

1. Go to your Whiteout AI application
2. Click **User Groups** tab
3. Add the created groups

### Configure Groups Attribute

For OIDC:
1. In attribute mapping, ensure `groups` claim is included
2. Groups will be sent as an array in the ID token

For SAML:
1. Add `groups` attribute statement
2. Map to JumpCloud Groups attribute

### Map Groups in Whiteout AI

1. Go to **Identity Provider** > **JumpCloud** > **Configure**
2. Enable **Sync Groups**
3. Add mappings:

| JumpCloud Group | Whiteout AI Role |
|-----------------|------------------|
| `WhiteoutAI-Admins` | Administrator |
| `WhiteoutAI-Users` | User |
| `WhiteoutAI-Auditors` | Auditor |

---

## SCIM Provisioning

### Step 1: Enable SCIM in Whiteout AI

1. Go to **Identity Provider** > **JumpCloud**
2. Enable **SCIM Provisioning**
3. Copy:
   - **SCIM Base URL**
   - **Bearer Token**

### Step 2: Configure SCIM in JumpCloud

1. In JumpCloud, go to your Whiteout AI application
2. Navigate to **Identity Management** tab
3. Enable **SCIM Provisioning**
4. Configure:

| Field | Value |
|-------|-------|
| **Base URL** | From Whiteout AI |
| **Token Type** | Bearer |
| **API Token** | From Whiteout AI |

5. Click **Test Connection**
6. Enable provisioning features:
   - [x] Create Users
   - [x] Update Users
   - [x] Deactivate Users

### Step 3: Configure Attribute Mapping

Map JumpCloud attributes to SCIM:

| JumpCloud | SCIM Attribute |
|-----------|----------------|
| Username | `userName` |
| Email | `emails[type eq "work"].value` |
| First Name | `name.givenName` |
| Last Name | `name.familyName` |
| Active | `active` |

---

## Directory Sync

### Configure Directory Insights

1. In JumpCloud, navigate to **Directory Insights**
2. Enable logging for SSO events
3. Configure alerts for:
   - Failed login attempts
   - New user provisioning
   - Group membership changes

### API Integration

For advanced integration, use JumpCloud API:

```bash
# Get users
curl -X GET "https://console.jumpcloud.com/api/v2/users" \
  -H "x-api-key: YOUR_API_KEY"

# Get groups
curl -X GET "https://console.jumpcloud.com/api/v2/usergroups" \
  -H "x-api-key: YOUR_API_KEY"
```

---

## Verification

### Test OIDC Sign-In

1. Open Whiteout AI login page
2. Click **Sign in with JumpCloud**
3. Authenticate with JumpCloud credentials
4. Verify redirect to Whiteout AI

### Test SAML Sign-In

1. **SP-initiated**: Start from Whiteout AI
2. **IdP-initiated**: Click from JumpCloud User Portal
3. Verify successful authentication

### Verify Groups

1. Trigger group sync
2. Check user's groups in Whiteout AI
3. Confirm role assignments

### Test Provisioning

1. Create user in JumpCloud
2. Assign to Whiteout AI application
3. Verify user appears in Whiteout AI

---

## Troubleshooting

### "Invalid client" Error (OIDC)

- Verify Client ID and Secret
- Check Issuer URL format
- Ensure application is active

### "Invalid signature" Error (SAML)

- Re-download certificate
- Check certificate expiration
- Verify signing algorithm matches

### User Not Provisioned

- Verify user is assigned to application
- Check group membership
- Ensure SCIM is enabled and configured

### Groups Not Appearing

- Verify groups attribute is mapped
- Check user has group memberships
- Ensure groups are assigned to application

### Connection Issues

- Verify JumpCloud service status
- Check network connectivity
- Review firewall rules

---

## Security Best Practices

### Application Security

- Use strong client secrets
- Enable MFA for all users
- Regular credential rotation

### Access Control

- Use group-based application access
- Configure conditional access policies
- Regular access reviews

### Monitoring

- Enable Directory Insights
- Set up security alerts
- Review login activity

---

## Attribute Mapping

### OIDC Claims

| JumpCloud | Whiteout AI |
|-----------|-------------|
| `sub` | User ID |
| `email` | Email |
| `given_name` | First Name |
| `family_name` | Last Name |
| `preferred_username` | Username |
| `groups` | Group Memberships |

### SAML Attributes

| SAML Attribute | Whiteout AI |
|----------------|-------------|
| `NameID` | User ID / Email |
| `email` | Email |
| `firstName` | First Name |
| `lastName` | Last Name |
| `groups` | Group Memberships |

---

## Revoking Access

To disconnect JumpCloud:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **JumpCloud** > **Remove**

2. **In JumpCloud:**
   - Deactivate or delete the application
   - Remove user/group assignments

3. **Clean up:**
   - Revoke SCIM tokens
   - Review Directory Insights logs
   - Notify affected users
