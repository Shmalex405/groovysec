# Ping Identity SSO Setup Guide

This guide walks you through configuring Ping Identity (PingOne or PingFederate) as your Single Sign-On provider for Whiteout AI.

## Overview

Ping Identity integration provides:
- **OIDC Authentication**: OpenID Connect-based secure login
- **SAML Authentication**: SAML 2.0 support for enterprise requirements
- **Group Sync**: Automatic synchronization of Ping Identity groups
- **SCIM Provisioning**: Automated user provisioning

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
- **Ping Identity Administrator** access (PingOne or PingFederate)
- **Whiteout AI Admin** privileges
- Appropriate Ping Identity license

---

## PingOne Setup

### Option A: OIDC Setup (Recommended)

#### Step 1: Create OIDC Application

1. Log in to your PingOne Admin Console
2. Navigate to **Applications** > **Applications**
3. Click **+** to add a new application
4. Select **Web App**
5. Choose **OIDC** as the connection type
6. Click **Configure**

#### Step 2: Configure Application

**Application Settings:**

| Field | Value |
|-------|-------|
| **Application Name** | `Whiteout AI` |
| **Description** | `AI Governance Platform SSO` |
| **Icon** | Upload (optional) |

**OIDC Configuration:**

| Field | Value |
|-------|-------|
| **Redirect URIs** | `https://your-whiteout-instance.com/api/auth/callback/pingone` |
| **Post Logout Redirect URIs** | `https://your-whiteout-instance.com` |
| **Response Type** | Code |
| **Grant Type** | Authorization Code |
| **PKCE Enforcement** | Optional |
| **Token Endpoint Auth Method** | Client Secret Post |

#### Step 3: Configure Scopes

Enable the following scopes:

| Scope | Purpose |
|-------|---------|
| `openid` | Required for OIDC |
| `profile` | User profile information |
| `email` | User email address |

#### Step 4: Get Credentials

1. After saving, go to the **Configuration** tab
2. Note:
   - **Client ID**
   - **Client Secret**
   - **Authorization URL** (Discovery Endpoint)
   - **Environment ID**

#### Step 5: Configure Whiteout AI (OIDC)

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **Ping Identity**
5. Choose **PingOne OIDC**
6. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `Ping Identity SSO` |
| **Environment ID** | From Step 4 |
| **Client ID** | From Step 4 |
| **Client Secret** | From Step 4 |
| **Region** | Select your PingOne region |

7. Click **Save & Test Connection**

---

### Option B: SAML Setup

#### Step 1: Create SAML Application

1. Log in to PingOne Admin Console
2. Navigate to **Applications** > **Applications**
3. Click **+** to add new application
4. Select **Web App**
5. Choose **SAML** as the connection type
6. Click **Configure**

#### Step 2: Configure SAML Settings

**Application Settings:**

| Field | Value |
|-------|-------|
| **Application Name** | `Whiteout AI` |
| **Description** | `AI Governance Platform SAML SSO` |

**SAML Configuration:**

| Field | Value |
|-------|-------|
| **ACS URL** | `https://your-whiteout-instance.com/api/auth/saml/callback` |
| **Entity ID** | `https://your-whiteout-instance.com` |
| **SLO Endpoint** | `https://your-whiteout-instance.com/logout` |
| **Subject NameID Format** | Email Address |
| **Signing** | Sign Assertion |

#### Step 3: Configure Attribute Mapping

Add attribute mappings:

| PingOne Attribute | SAML Attribute Name |
|-------------------|---------------------|
| User ID | `sub` |
| Email | `email` |
| Given Name | `firstName` |
| Family Name | `lastName` |
| Group Names | `groups` |

#### Step 4: Get SAML Metadata

1. Go to **Configuration** tab
2. Download **IdP Metadata XML**
3. Or note:
   - **Issuer ID**
   - **Single Sign-On Service URL**
   - **X.509 Certificate**

#### Step 5: Configure Whiteout AI (SAML)

1. Navigate to **Settings** > **Identity Provider**
2. Click **Add Identity Provider**
3. Select **Ping Identity**
4. Choose **SAML**
5. Upload metadata XML or enter manually:

| Field | Value |
|-------|-------|
| **IdP SSO URL** | From Step 4 |
| **IdP Issuer** | From Step 4 |
| **Certificate** | From Step 4 |

6. Click **Save & Test Connection**

---

## PingFederate Setup

### OIDC Setup for PingFederate

#### Step 1: Create OAuth Client

1. Log in to PingFederate Admin Console
2. Navigate to **Applications** > **OAuth** > **Clients**
3. Click **Add Client**
4. Configure:

| Field | Value |
|-------|-------|
| **Client ID** | `whiteout-ai` |
| **Client Authentication** | Client Secret |
| **Redirect URIs** | `https://your-whiteout-instance.com/api/auth/callback/pingfederate` |
| **Allowed Grant Types** | Authorization Code |
| **Require PKCE** | Optional |

#### Step 2: Configure OIDC Policy

1. Navigate to **OAuth Settings** > **Authorization Server Settings**
2. Enable OpenID Connect
3. Configure scopes: `openid`, `profile`, `email`

#### Step 3: Configure Whiteout AI

1. Select **PingFederate** in Whiteout AI
2. Enter:

| Field | Value |
|-------|-------|
| **PingFederate URL** | `https://your-pingfederate.company.com` |
| **Client ID** | From Step 1 |
| **Client Secret** | From Step 1 |

---

### SAML Setup for PingFederate

#### Step 1: Create SP Connection

1. Navigate to **IdP Configuration** > **SP Connections**
2. Click **Create New**
3. Configure connection type:
   - **Connection Type**: Browser SSO Profiles
   - **Protocol**: SAML 2.0

#### Step 2: Configure Browser SSO

| Field | Value |
|-------|-------|
| **Assertion Consumer Service URL** | `https://your-whiteout-instance.com/api/auth/saml/callback` |
| **Entity ID** | `https://your-whiteout-instance.com` |
| **Binding** | POST |

#### Step 3: Configure Attribute Contract

Add attributes:
- `SAML_SUBJECT` (NameID)
- `email`
- `firstName`
- `lastName`
- `groups`

#### Step 4: Export Metadata

1. Go to **Protocol Settings** > **Export Metadata**
2. Download metadata file

#### Step 5: Configure in Whiteout AI

Use the exported metadata or manual configuration.

---

## Group Synchronization

### Enable Group Sync in PingOne

1. In your Whiteout AI application, go to **Attribute Mappings**
2. Add Group Names attribute
3. Map to SAML/OIDC response

### Configure Groups

1. In PingOne, navigate to **Directory** > **Groups**
2. Create groups:
   - `WhiteoutAI-Admins`
   - `WhiteoutAI-Users`
   - `WhiteoutAI-Auditors`

3. Assign users to groups

### Map Groups in Whiteout AI

| Ping Identity Group | Whiteout AI Role |
|---------------------|------------------|
| `WhiteoutAI-Admins` | Administrator |
| `WhiteoutAI-Users` | User |
| `WhiteoutAI-Auditors` | Auditor |

---

## SCIM Provisioning

### Step 1: Enable SCIM in Whiteout AI

1. Go to **Identity Provider** > **Ping Identity**
2. Enable **SCIM Provisioning**
3. Copy **SCIM URL** and **Bearer Token**

### Step 2: Configure SCIM in PingOne

1. Go to **Provisioning**
2. Enable outbound provisioning
3. Configure SCIM connection:

| Field | Value |
|-------|-------|
| **SCIM URL** | From Whiteout AI |
| **Authentication** | Bearer Token |
| **Token** | From Whiteout AI |

4. Map user attributes
5. Enable provisioning rules

---

## Verification

### Test Sign-In

1. Open Whiteout AI login page
2. Click **Sign in with Ping Identity**
3. Authenticate with Ping Identity credentials
4. Verify successful redirect

### Verify Attributes

1. Check user profile in Whiteout AI
2. Verify email, name populated
3. Confirm groups appear

### Test Provisioning

1. Create user in Ping Identity
2. Verify user appears in Whiteout AI
3. Test user updates and deactivation

---

## Troubleshooting

### "Invalid client" Error

- Verify Client ID and Secret
- Check redirect URI matches exactly
- Ensure application is enabled

### "Invalid signature" Error

- Re-download certificate
- Check certificate expiration
- Verify signing configuration

### Groups Not Syncing

- Verify group attribute is mapped
- Check user has group memberships
- Ensure groups are included in token/assertion

### Connection Timeout

- Verify network connectivity
- Check firewall rules
- Ensure PingFederate/PingOne is accessible

---

## Security Best Practices

### Application Security

- Use strong client secrets
- Enable PKCE for OIDC
- Configure appropriate token lifetimes

### Access Control

- Use group-based access
- Configure IP restrictions
- Enable MFA policies

### Monitoring

- Enable audit logging
- Set up security alerts
- Regular access reviews

---

## Attribute Mapping

### OIDC Claims

| Ping Identity Attribute | Whiteout AI Attribute |
|------------------------|----------------------|
| `sub` | User ID |
| `email` | Email |
| `given_name` | First Name |
| `family_name` | Last Name |
| `name` | Display Name |
| `groups` | Group Memberships |

### SAML Attributes

| SAML Attribute | Whiteout AI Attribute |
|----------------|----------------------|
| `NameID` | User ID / Email |
| `email` | Email |
| `firstName` | First Name |
| `lastName` | Last Name |
| `groups` | Group Memberships |

---

## Revoking Access

To disconnect Ping Identity:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **Ping Identity** > **Remove**

2. **In Ping Identity:**
   - Disable or delete the application
   - Remove user assignments

3. **Clean up:**
   - Revoke SCIM tokens
   - Delete stored credentials
   - Review audit logs
