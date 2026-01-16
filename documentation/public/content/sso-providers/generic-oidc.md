# Generic OIDC SSO Setup Guide

This guide walks you through configuring any OpenID Connect (OIDC) compliant identity provider with Whiteout AI.

## Overview

The Generic OIDC connector allows you to integrate with any OIDC-compliant identity provider, including:
- Custom corporate identity solutions
- Identity providers not explicitly supported
- Self-hosted identity solutions (Keycloak, Authentik, etc.)
- Specialized industry IdPs

## Supported Features

| Feature | Supported |
|---------|-----------|
| OIDC Authentication | Yes |
| Authorization Code Flow | Yes |
| PKCE Support | Yes |
| Group Synchronization | Via claims |
| Just-in-Time Provisioning | Yes |
| Custom Claims | Yes |

## Prerequisites

Before you begin, ensure you have:
- **Administrator access** to your OIDC identity provider
- **Whiteout AI Admin** privileges
- Your IdP supports **OpenID Connect 1.0** protocol
- Access to IdP's OAuth/OIDC configuration

---

## Information Gathering

### Required Information from Your IdP

Before configuring Whiteout AI, gather the following from your identity provider:

| Information | Description | Example |
|-------------|-------------|---------|
| **Issuer URL** | OIDC issuer identifier | `https://idp.company.com/realms/main` |
| **Authorization Endpoint** | OAuth authorization URL | `https://idp.company.com/auth` |
| **Token Endpoint** | OAuth token URL | `https://idp.company.com/token` |
| **UserInfo Endpoint** | OIDC userinfo URL | `https://idp.company.com/userinfo` |
| **JWKS URI** | JSON Web Key Set URL | `https://idp.company.com/.well-known/jwks.json` |
| **Client ID** | Application identifier | `whiteout-ai-client` |
| **Client Secret** | Application secret | `your-secret-here` |

### Discovery Document (Recommended)

Many IdPs provide an OIDC discovery document:
```
https://your-idp.com/.well-known/openid-configuration
```

This document contains all required endpoints automatically.

---

## IdP Configuration

### Step 1: Register Application in Your IdP

Create a new OIDC application/client in your identity provider:

| Setting | Value |
|---------|-------|
| **Application Name** | `Whiteout AI` |
| **Application Type** | Web Application |
| **Grant Types** | Authorization Code |
| **Redirect URI** | `https://your-whiteout-instance.com/api/auth/callback/oidc` |
| **Post-Logout Redirect URI** | `https://your-whiteout-instance.com` |

### Step 2: Configure Scopes

Request the following OAuth scopes:

| Scope | Required | Purpose |
|-------|----------|---------|
| `openid` | Yes | Basic OIDC authentication |
| `profile` | Yes | User profile information |
| `email` | Yes | User email address |
| `groups` | Optional | Group memberships (if supported) |

### Step 3: Configure Token Claims

Ensure your IdP includes these claims in the ID token:

| Claim | Description | Required |
|-------|-------------|----------|
| `sub` | Subject identifier | Yes |
| `email` | User email | Yes |
| `name` | Display name | Recommended |
| `given_name` | First name | Recommended |
| `family_name` | Last name | Recommended |
| `groups` | Group memberships | Optional |
| `preferred_username` | Username | Optional |

### Step 4: Note Client Credentials

After creating the application, note:
- **Client ID**
- **Client Secret** (store securely)

---

## Whiteout AI Configuration

### Step 1: Access Identity Provider Settings

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **Generic OIDC**

### Step 2: Configure Basic Settings

| Field | Description | Example |
|-------|-------------|---------|
| **Display Name** | Name shown to users | `Corporate SSO` |
| **Client ID** | From IdP registration | `whiteout-ai-client` |
| **Client Secret** | From IdP registration | `your-secret` |

### Step 3: Configure Endpoints

**Option A: Discovery URL (Recommended)**

| Field | Value |
|-------|-------|
| **Discovery URL** | `https://your-idp.com/.well-known/openid-configuration` |

Whiteout AI will automatically fetch all endpoints.

**Option B: Manual Configuration**

| Field | Value |
|-------|-------|
| **Issuer URL** | `https://your-idp.com` |
| **Authorization URL** | `https://your-idp.com/authorize` |
| **Token URL** | `https://your-idp.com/token` |
| **UserInfo URL** | `https://your-idp.com/userinfo` |
| **JWKS URI** | `https://your-idp.com/.well-known/jwks.json` |

### Step 4: Configure Scopes

Enter the scopes to request (space-separated):
```
openid profile email groups
```

### Step 5: Configure Attribute Mapping

Map IdP claims to Whiteout AI attributes:

| IdP Claim | Whiteout AI Attribute |
|-----------|----------------------|
| `sub` | User ID |
| `email` | Email |
| `name` | Display Name |
| `given_name` | First Name |
| `family_name` | Last Name |
| `preferred_username` | Username |
| `groups` | Groups |

### Step 6: Save and Test

1. Click **Save & Test Connection**
2. A new window will open to test authentication
3. Verify successful login and attribute mapping

---

## Group Synchronization

### Configure Groups Claim

If your IdP supports groups:

1. Ensure `groups` scope is requested
2. Configure IdP to include groups in ID token
3. In Whiteout AI, map the groups claim

### Group Claim Formats

Different IdPs format groups differently:

**Array format:**
```json
{
  "groups": ["admin", "users", "developers"]
}
```

**Comma-separated:**
```json
{
  "groups": "admin,users,developers"
}
```

Configure the appropriate format in Whiteout AI.

### Map Groups to Roles

| IdP Group | Whiteout AI Role |
|-----------|------------------|
| `whiteout-admins` | Administrator |
| `whiteout-users` | User |
| `whiteout-auditors` | Auditor |

---

## Advanced Configuration

### PKCE (Proof Key for Code Exchange)

Enable PKCE for enhanced security:

1. In Whiteout AI, enable **Use PKCE**
2. Select code challenge method: `S256` (recommended)

### Custom Parameters

Add custom authorization parameters:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `prompt` | `login` | Force re-authentication |
| `acr_values` | `mfa` | Request MFA |
| `login_hint` | `{email}` | Pre-fill username |

### Token Validation

Configure token validation settings:

| Setting | Recommended Value |
|---------|-------------------|
| **Verify at_hash** | Enabled |
| **Verify nonce** | Enabled |
| **Clock skew (seconds)** | 120 |

### Logout Configuration

Configure single logout (SLO):

| Field | Value |
|-------|-------|
| **End Session URL** | `https://your-idp.com/logout` |
| **Include ID Token** | Yes |
| **Post-Logout Redirect** | `https://your-whiteout-instance.com` |

---

## Common IdP Configurations

### Keycloak

```yaml
Discovery URL: https://keycloak.company.com/realms/{realm}/.well-known/openid-configuration
Scopes: openid profile email
Groups claim: Configure via Protocol Mappers
```

### Authentik

```yaml
Discovery URL: https://authentik.company.com/application/o/{app-slug}/.well-known/openid-configuration
Scopes: openid profile email groups
Groups: Included automatically
```

### Dex

```yaml
Issuer: https://dex.company.com
Scopes: openid profile email groups
Configure connectors for upstream IdPs
```

### FusionAuth

```yaml
Discovery URL: https://fusionauth.company.com/.well-known/openid-configuration
Scopes: openid profile email
Groups: Configure via Lambda
```

---

## Verification

### Test Authentication Flow

1. Open Whiteout AI in incognito/private window
2. Click **Sign in with [Your IdP]**
3. Authenticate at your identity provider
4. Verify redirect back to Whiteout AI

### Verify Claims

1. Check user profile in Whiteout AI
2. Verify all expected attributes populated
3. Confirm groups/roles if configured

### Test Edge Cases

1. **Expired session**: Verify re-authentication works
2. **Invalid credentials**: Confirm error handling
3. **Group changes**: Verify group sync on login

---

## Troubleshooting

### "Invalid client" or "Unauthorized client"

- Verify Client ID is correct
- Check Client Secret hasn't been rotated
- Ensure application is enabled in IdP

### "Invalid redirect_uri"

- Verify redirect URI matches exactly (including trailing slashes)
- Check URI is registered in IdP
- Ensure protocol is HTTPS

### "Invalid issuer"

- Verify issuer URL matches IdP configuration
- Check for trailing slashes
- Ensure discovery document is accessible

### "Invalid token signature"

- Verify JWKS URI is accessible
- Check for certificate/key rotation
- Ensure clock sync between systems

### Missing User Attributes

- Verify scopes are requested
- Check IdP claim configuration
- Ensure claims are included in ID token (not just access token)
- Review attribute mapping in Whiteout AI

### Groups Not Appearing

- Verify groups scope is requested
- Check IdP includes groups in token
- Confirm groups claim name matches configuration
- Review token contents (use jwt.io to debug)

---

## Security Best Practices

### Client Security

- Use strong, random client secrets
- Rotate secrets periodically
- Enable PKCE for additional security

### Token Security

- Use short token lifetimes
- Enable token refresh
- Validate all token claims

### Network Security

- Use HTTPS for all endpoints
- Validate SSL certificates
- Consider IP restrictions if supported

---

## Revoking Access

To disconnect the Generic OIDC provider:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **[Your IdP]** > **Remove**

2. **In Your IdP:**
   - Delete or disable the Whiteout AI application
   - Revoke any active sessions

3. **Clean up:**
   - Rotate client secrets
   - Remove any custom claims/scopes
   - Notify affected users
