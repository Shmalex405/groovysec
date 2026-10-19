# Generic SAML (not available)

SAML sign-in is not available in Whiteout AI yet. Connect your identity provider with OpenID Connect (OIDC) instead.

## What this means

- Whiteout AI can't complete a SAML sign-in. It has no endpoint that accepts SAML responses.
- The admin app may still list **Generic SAML (Beta)** under identity providers. If you configure it, users won't be able to sign in.
- Earlier versions of these docs described SAML setup steps and a Beta. Those steps did not work and have been removed.

## Use OIDC instead

Every supported identity provider connects over OIDC:

| Provider | Guide |
|----------|-------|
| Microsoft Entra ID | [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md) |
| Okta | [Okta](./sso-providers/okta.md) |
| Google Workspace | [Google Workspace](./sso-providers/google-workspace.md) |
| OneLogin | [OneLogin](./sso-providers/onelogin.md) |
| Ping Identity | [Ping Identity](./sso-providers/ping-identity.md) |
| JumpCloud | [JumpCloud](./sso-providers/jumpcloud.md) |
| Auth0 | [Auth0](./sso-providers/auth0.md) |
| Any other OIDC provider | [Generic OIDC](./sso-providers/generic-oidc.md) |

If your identity provider only supports SAML, put a broker in front of it. For example, Auth0 can accept a SAML connection from your IdP and sign users in to Whiteout AI over OIDC. See [Auth0](./sso-providers/auth0.md).

## Need SAML?

Contact support@groovysec.com and tell us which identity provider you use. We'll update this page when SAML sign-in is available.
