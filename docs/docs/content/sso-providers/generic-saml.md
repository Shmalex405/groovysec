# Generic SAML SSO Setup Guide (Beta)

This guide walks you through configuring any SAML 2.0 compliant identity provider with Whiteout AI.

> **Note:** Generic SAML support is currently in Beta. We recommend using OIDC when possible for a more streamlined experience. If your IdP only supports SAML, or you have specific SAML requirements, this guide will help you configure it.

## Overview

The Generic SAML connector allows you to integrate with any SAML 2.0 compliant identity provider, including:
- Legacy enterprise identity systems
- Government/regulatory-required IdPs
- Industry-specific identity providers
- On-premises identity solutions

## Supported Features

| Feature | Supported |
|---------|-----------|
| SAML 2.0 SSO | Yes |
| SP-Initiated SSO | Yes |
| IdP-Initiated SSO | Yes |
| Single Logout (SLO) | Yes (if IdP supports) |
| Encrypted Assertions | Yes |
| Signed Requests | Yes |
| Group Synchronization | Via attributes |

## Prerequisites

Before you begin, ensure you have:
- **Administrator access** to your SAML identity provider
- **Whiteout AI Admin** privileges
- Your IdP supports **SAML 2.0** protocol
- Access to IdP metadata or configuration details

---

## Information Gathering

### Required Information from Your IdP

Gather the following from your identity provider:

| Information | Description |
|-------------|-------------|
| **IdP Entity ID** | Unique identifier for the IdP |
| **SSO URL** | Single Sign-On service URL |
| **SLO URL** | Single Logout URL (optional) |
| **X.509 Certificate** | IdP signing certificate |
| **NameID Format** | User identifier format |

### Whiteout AI Service Provider Information

You'll need to provide your IdP with:

| Information | Value |
|-------------|-------|
| **SP Entity ID** | `https://your-whiteout-instance.com` |
| **ACS URL** | `https://your-whiteout-instance.com/api/auth/saml/callback` |
| **SLO URL** | `https://your-whiteout-instance.com/api/auth/saml/logout` |

---

## IdP Configuration

### Step 1: Create Service Provider in Your IdP

Create a new SAML Service Provider configuration:

| Setting | Value |
|---------|-------|
| **SP Name** | `Whiteout AI` |
| **SP Entity ID** | `https://your-whiteout-instance.com` |
| **ACS URL** | `https://your-whiteout-instance.com/api/auth/saml/callback` |
| **ACS Binding** | HTTP-POST |
| **NameID Format** | `emailAddress` (recommended) |
| **Sign Requests** | Optional |
| **Encrypt Assertions** | Optional |

### Step 2: Configure Attribute Statements

Configure your IdP to release the following attributes:

| Attribute Name | IdP Source | Required |
|----------------|------------|----------|
| `email` | User's email address | Yes |
| `firstName` or `givenName` | User's first name | Recommended |
| `lastName` or `surname` | User's last name | Recommended |
| `displayName` | Full display name | Optional |
| `groups` | Group memberships | Optional |

### Step 3: Configure NameID

Choose the appropriate NameID format:

| Format | URI | Use Case |
|--------|-----|----------|
| **Email** | `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress` | Most common |
| **Persistent** | `urn:oasis:names:tc:SAML:2.0:nameid-format:persistent` | Stable user ID |
| **Unspecified** | `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified` | IdP decides |

### Step 4: Download IdP Metadata

Export your IdP's metadata as:
- **XML file** - Download metadata.xml
- **Metadata URL** - Copy the metadata endpoint URL

---

## Whiteout AI Configuration

### Step 1: Access SAML Settings

1. Log in to Whiteout AI as an administrator
2. Navigate to **Settings** > **Identity Provider**
3. Click **Add Identity Provider**
4. Select **Generic SAML**

### Step 2: Configure IdP Settings

**Option A: Metadata URL (Recommended)**

| Field | Value |
|-------|-------|
| **Metadata URL** | `https://your-idp.com/saml/metadata` |

Click **Fetch Metadata** to auto-populate settings.

**Option B: Metadata File Upload**

1. Click **Upload Metadata**
2. Select your IdP's metadata XML file
3. Settings will be auto-populated

**Option C: Manual Configuration**

| Field | Description | Example |
|-------|-------------|---------|
| **Display Name** | Name shown to users | `Corporate SSO` |
| **IdP Entity ID** | IdP's entity identifier | `https://idp.company.com/saml` |
| **SSO URL** | Single Sign-On URL | `https://idp.company.com/saml/sso` |
| **SLO URL** | Single Logout URL (optional) | `https://idp.company.com/saml/slo` |
| **Certificate** | X.509 certificate (PEM format) | Paste certificate content |

### Step 3: Configure SP Settings

| Field | Value |
|-------|-------|
| **SP Entity ID** | `https://your-whiteout-instance.com` |
| **NameID Format** | Match IdP configuration |
| **Signature Algorithm** | `RSA-SHA256` (recommended) |

### Step 4: Configure Attribute Mapping

Map SAML attributes to Whiteout AI fields:

| SAML Attribute | Whiteout AI Attribute |
|----------------|----------------------|
| `NameID` or custom | User ID |
| `email` | Email |
| `firstName` / `givenName` | First Name |
| `lastName` / `surname` | Last Name |
| `displayName` | Display Name |
| `groups` | Groups |

### Step 5: Save and Test

1. Click **Save Configuration**
2. Click **Test Connection**
3. Verify authentication works

---

## Download SP Metadata

After configuration, download Whiteout AI's SP metadata:

1. Go to **Identity Provider** > **Generic SAML** > **SP Metadata**
2. Download the XML file
3. Import into your IdP if required

---

## Group Synchronization

### Configure Groups Attribute

1. In your IdP, configure group/role release
2. Name the attribute `groups` (or map accordingly)
3. Include group names as values

### Attribute Format

**Multiple values:**
```xml
<saml:Attribute Name="groups">
  <saml:AttributeValue>Admins</saml:AttributeValue>
  <saml:AttributeValue>Users</saml:AttributeValue>
</saml:Attribute>
```

**Single value (comma-separated):**
```xml
<saml:Attribute Name="groups">
  <saml:AttributeValue>Admins,Users</saml:AttributeValue>
</saml:Attribute>
```

### Map Groups to Roles

| SAML Group | Whiteout AI Role |
|------------|------------------|
| `WhiteoutAI-Admins` | Administrator |
| `WhiteoutAI-Users` | User |
| `WhiteoutAI-Auditors` | Auditor |

---

## Advanced Configuration

### Request Signing

Enable request signing for additional security:

1. Enable **Sign Authentication Requests**
2. Download SP certificate from Whiteout AI
3. Import certificate into your IdP
4. Configure IdP to verify signatures

### Assertion Encryption

Enable encrypted assertions:

1. Enable **Encrypted Assertions**
2. Download SP encryption certificate
3. Configure IdP to encrypt assertions with this certificate

### Force Authentication

Force re-authentication for each login:

| Field | Value |
|-------|-------|
| **Force Authn** | Enabled |

### Authentication Context

Request specific authentication strength:

| Field | Value |
|-------|-------|
| **AuthnContextClassRef** | `urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport` |

For MFA:
```
urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorContract
```

---

## Single Logout (SLO)

### Configure SLO

1. Enable **Single Logout**
2. Enter IdP SLO URL
3. Configure logout binding (POST or Redirect)

### Logout Flow

1. User initiates logout from Whiteout AI
2. Whiteout AI sends LogoutRequest to IdP
3. IdP terminates session
4. IdP sends LogoutResponse to Whiteout AI
5. User is logged out

---

## IdP-Initiated SSO

### Enable IdP-Initiated Flow

1. In Whiteout AI, enable **Allow IdP-Initiated SSO**
2. Configure **Default RelayState** if needed

### Security Considerations

IdP-initiated SSO is less secure than SP-initiated:
- No request validation
- Potential for replay attacks

Consider enabling additional protections:
- Short assertion validity
- One-time assertion enforcement

---

## Verification

### Test SP-Initiated Flow

1. Open Whiteout AI login page
2. Click **Sign in with [Your IdP]**
3. Authenticate at identity provider
4. Verify redirect back to Whiteout AI

### Test IdP-Initiated Flow

1. Log in to your identity provider
2. Click the Whiteout AI application tile
3. Verify direct login to Whiteout AI

### Verify Attributes

1. Check user profile in Whiteout AI
2. Verify all expected attributes populated
3. Confirm groups/roles appear correctly

---

## Troubleshooting

### "Invalid signature"

- Re-download IdP certificate
- Check certificate hasn't expired
- Verify certificate is in PEM format
- Ensure signature algorithm matches

### "Invalid audience"

- Verify SP Entity ID matches in both systems
- Check for protocol differences (http vs https)
- Look for trailing slashes

### "Invalid destination"

- Verify ACS URL is correct
- Check for URL encoding issues
- Ensure binding type matches (POST vs Redirect)

### "Invalid NameID"

- Verify NameID format matches configuration
- Check IdP is sending NameID
- Ensure format is supported

### Missing Attributes

- Verify attribute names match mapping
- Check IdP is releasing attributes
- Ensure attribute statements are configured

### "Response expired"

- Check system clocks are synchronized
- Increase clock skew tolerance
- Verify assertion validity period

### Debug SAML Messages

Use browser developer tools or SAML tracer extension:

1. Install SAML Tracer browser extension
2. Attempt login
3. Review SAML Request and Response
4. Check for errors or missing data

---

## Security Best Practices

### Certificate Management

- Use certificates with appropriate validity
- Monitor certificate expiration
- Plan for certificate rotation
- Use strong key sizes (RSA 2048+)

### Assertion Security

- Enable assertion signing
- Consider assertion encryption
- Use short validity periods
- Verify audience restriction

### Network Security

- Use HTTPS for all endpoints
- Validate SSL certificates
- Consider IP restrictions

---

## Common IdP-Specific Notes

### ADFS (Active Directory Federation Services)

- Entity ID format: `http://` (ADFS default)
- May require specific claim rules
- Use AD attributes for user info

### Shibboleth

- Entity ID often matches metadata URL
- Configure attribute release policies
- Use eduPerson attributes if available

### SimpleSAMLphp

- Check authentication source configuration
- Configure attribute mapping in authsources
- Verify metadata exchange

---

## Revoking Access

To disconnect the Generic SAML provider:

1. **In Whiteout AI:**
   - **Settings** > **Identity Provider** > **[Your IdP]** > **Remove**

2. **In Your IdP:**
   - Delete or disable the Whiteout AI Service Provider
   - Remove any active sessions

3. **Clean up:**
   - Rotate signing certificates if needed
   - Remove attribute release configurations
   - Notify affected users

---

## Beta Limitations

Current beta limitations:

| Feature | Status |
|---------|--------|
| Multiple certificates | Not supported |
| Artifact binding | Not supported |
| SCIM provisioning | Not supported |
| Attribute queries | Not supported |

These features may be added in future releases. For advanced requirements, please contact support.
