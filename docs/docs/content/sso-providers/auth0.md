# Auth0 SSO Setup Guide

This guide walks you through configuring Auth0 as your Single Sign-On provider for Whiteout AI.

## Overview

Auth0 integration provides:
- **OIDC Authentication**: OpenID Connect-based secure login
- **Universal Login**: Customizable authentication experience
- **Social Connections**: Support for social identity providers
- **Enterprise Connections**: Connect to existing enterprise IdPs

## Supported Features

| Feature | Supported |
|---------|-----------|
| OIDC Authentication | Yes |
| SAML Authentication | No (use Generic SAML) |
| Group Synchronization | Via Rules/Actions |
| Just-in-Time Provisioning | Yes |
| Social Login | Yes |

## Prerequisites

Before you begin, ensure you have:
- **Auth0 Administrator** access
- **Whiteout AI Admin** privileges
- Auth0 subscription (Free tier works for basic setup)

---

## Setup Process

### Step 1: Create Application in Auth0

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com)
2. Navigate to **Applications** > **Applications**
3. Click **+ Create Application**
4. Configure:

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI` |
| **Application Type** | Regular Web Application |

5. Click **Create**

### Step 2: Configure Application Settings

Go to the **Settings** tab:

**Basic Information:**

| Field | Value |
|-------|-------|
| **Name** | `Whiteout AI` |
| **Domain** | Note your Auth0 domain (e.g., `your-tenant.auth0.com`) |
| **Client ID** | Note this value |
| **Client Secret** | Note this value |

**Application URIs:**

| Field | Value |
|-------|-------|
| **Application Login URI** | `https://your-whiteout-instance.com/login` |
| **Allowed Callback URLs** | `https://your-whiteout-instance.com/api/auth/callback/auth0` |
| **Allowed Logout URLs** | `https://your-whiteout-instance.com` |
| **Allowed Web Origins** | `https://your-whiteout-instance.com` |

### Step 3: Configure Advanced Settings

Scroll to **Advanced Settings**:

**OAuth:**

| Setting | Value |
|---------|-------|
| **OIDC Conformant** | Enabled |
| **JSON Web Token (JWT) Signature Algorithm** | RS256 |

**Grant Types:**
Enable only:
- [x] Authorization Code
- [x] Refresh Token

### Step 4: Configure Connections

Go to the **Connections** tab:

1. Enable **Database** connections if using Auth0 user database
2. Enable **Social** connections if needed (Google, GitHub, etc.)
3. Enable **Enterprise** connections for existing IdPs

### Step 5: Configure Whiteout AI

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **Auth0**
5. Enter:

| Field | Value |
|-------|-------|
| **Display Name** | `Auth0 SSO` |
| **Domain** | Your Auth0 domain (e.g., `your-tenant.auth0.com`) |
| **Client ID** | From Step 2 |
| **Client Secret** | From Step 2 |

6. Click **Save & Test Connection**

---

## Universal Login Customization

### Enable Custom Login Page

1. In Auth0, go to **Branding** > **Universal Login**
2. Configure branding:
   - Logo
   - Colors
   - Background

### Advanced Customization

1. Go to **Universal Login** > **Advanced Options**
2. Enable **Customize Login Page**
3. Edit the HTML/CSS template

---

## Group/Role Synchronization

Auth0 doesn't have built-in groups. Use Rules or Actions to add group claims.

### Option A: Using Auth0 Authorization Extension

1. Go to **Extensions** > Install **Auth0 Authorization**
2. Configure groups and roles
3. Assign users to groups
4. Groups will be added to tokens automatically

### Option B: Using Actions

1. Go to **Actions** > **Library**
2. Click **Create Action** > **Build from scratch**
3. Name: `Add Groups to Token`
4. Add code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Add user roles/groups to the ID token
  const namespace = 'https://your-whiteout-instance.com/claims';

  // Option 1: Use Auth0 roles
  if (event.authorization && event.authorization.roles) {
    api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
  }

  // Option 2: Use user metadata
  if (event.user.app_metadata && event.user.app_metadata.groups) {
    api.idToken.setCustomClaim(`${namespace}/groups`, event.user.app_metadata.groups);
  }
};
```

5. Deploy the action
6. Go to **Actions** > **Flows** > **Login**
7. Add the action to the flow

### Option C: Using Auth0 Organizations

For B2B scenarios:

1. Go to **Organizations**
2. Create organizations for each tenant
3. Assign users to organizations
4. Organization membership is included in tokens

### Configure Group Mapping in Whiteout AI

1. Go to **Identity Provider** > **Auth0** > **Configure**
2. Enable **Sync Groups**
3. Configure the claim namespace
4. Add mappings:

| Auth0 Role/Group | Whiteout AI Role |
|------------------|------------------|
| `admin` | Administrator |
| `user` | User |
| `auditor` | Auditor |

---

## Social Login Configuration

### Enable Social Connections

1. In Auth0, go to **Authentication** > **Social**
2. Enable desired providers:
   - Google
   - Microsoft
   - GitHub
   - LinkedIn

### Configure Social Provider (Example: Google)

1. Click **Google**
2. Enter:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
3. Enable for your Whiteout AI application

---

## Enterprise Connections

### Connect to Corporate IdP

1. Go to **Authentication** > **Enterprise**
2. Choose connection type:
   - **SAML** - For SAML 2.0 IdPs
   - **Azure AD** - For Microsoft
   - **Google Workspace** - For Google
   - **OIDC** - For generic OIDC IdPs

3. Configure the connection
4. Enable for Whiteout AI application

### Home Realm Discovery

Configure automatic IdP selection based on email domain:

1. Go to **Authentication** > **Enterprise**
2. Edit connection settings
3. Add email domains for automatic routing

---

## Verification

### Test Sign-In Flow

1. Open Whiteout AI login page
2. Click **Sign in with Auth0**
3. Complete authentication (Universal Login)
4. Verify redirect to Whiteout AI

### Verify User Attributes

1. Check user profile in Whiteout AI
2. Verify email, name populated
3. Confirm roles/groups if configured

### Test Social Login

1. Click social provider button on login
2. Authenticate with social account
3. Verify user created in Whiteout AI

---

## Troubleshooting

### "Invalid client" Error

- Verify Client ID and Secret
- Check Auth0 domain format (no https://)
- Ensure application is not disabled

### "Callback URL mismatch" Error

- Verify callback URL is exactly as configured
- Check for trailing slashes
- Ensure protocol matches (https)

### User Not Created

- Check Auth0 logs for errors
- Verify connection is enabled for application
- Ensure user meets any configured rules

### Groups/Roles Not Appearing

- Verify Action/Rule is deployed and enabled
- Check claim namespace in Whiteout AI config
- Review Action logs for errors

### Social Login Failed

- Verify social provider credentials
- Check provider is enabled for application
- Review Auth0 logs for specific error

---

## Security Best Practices

### Application Security

- Enable **Rotate Client Secret** periodically
- Use RS256 for token signing
- Enable **OIDC Conformant** mode

### Brute Force Protection

1. Go to **Security** > **Attack Protection**
2. Enable:
   - Brute Force Protection
   - Bot Detection
   - Suspicious IP Throttling

### Multi-Factor Authentication

1. Go to **Security** > **Multi-factor Auth**
2. Enable MFA factors:
   - One-time Password
   - Push Notifications
   - WebAuthn

### Logging and Monitoring

1. Go to **Monitoring** > **Logs**
2. Enable log streaming to SIEM
3. Set up alerts for suspicious activity

---

## Attribute Mapping

Default claims:

| Auth0 Claim | Whiteout AI Attribute |
|-------------|----------------------|
| `sub` | User ID |
| `email` | Email |
| `given_name` | First Name |
| `family_name` | Last Name |
| `name` | Display Name |
| `picture` | Avatar URL |
| Custom namespace claims | Groups/Roles |

---

## Rate Limits

Auth0 has rate limits based on your plan:

| Plan | Rate Limit |
|------|------------|
| Free | 1,000 machine-to-machine tokens/month |
| Developer | Higher limits |
| Enterprise | Custom limits |

---

## Revoking Access

To disconnect Auth0:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **Auth0** > **Remove**

2. **In Auth0:**
   - Go to **Applications** > **Whiteout AI**
   - Delete or disable the application

3. **Clean up:**
   - Rotate client secrets
   - Remove any Actions/Rules
   - Review Auth0 logs
   - Notify affected users
