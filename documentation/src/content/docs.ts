// This file exports documentation content
// In production, these could be loaded from MDX files or a CMS

export const docs: Record<string, string> = {
  'overview': `# Whiteout AI Admin Setup Guides

Welcome to the Whiteout AI administrator documentation. This guide will help you configure integrations and identity providers for your organization.

## Quick Navigation

### Data Integrations

Connect your organization's tools to enable AI governance across your data sources:

- **GitHub** - Source code repository integration
- **Confluence** - Atlassian documentation platform
- **Jira** - Atlassian project management
- **Notion** - Collaborative workspace
- **Slack** - Team communication platform
- **Microsoft Teams** - Microsoft collaboration platform
- **Google Drive** - Google cloud storage
- **Trello** - Visual project management
- **Linear** - Modern issue tracking
- **Asana** - Work management platform
- **SharePoint** - Microsoft document management
- **Custom Integration** - Connect any REST API

### Single Sign-On (SSO) Providers

Configure identity providers for secure authentication:

- **Microsoft Entra ID** - OIDC, Groups
- **Okta** - OIDC, SAML, Groups
- **Google Workspace** - OIDC, Groups
- **OneLogin** - OIDC, SAML, Groups
- **Ping Identity** - OIDC, SAML, Groups
- **JumpCloud** - OIDC, SAML, Groups
- **Auth0** - OIDC
- **Generic OIDC** - Any OIDC-compliant provider
- **Generic SAML** - Any SAML 2.0 provider (Beta)

## Prerequisites

1. **Admin Access**: You must have administrator privileges in Whiteout AI
2. **Service Account Permissions**: For most integrations, you'll need admin access to the third-party service
3. **Network Access**: Ensure your firewall allows connections to required endpoints

## General Configuration Steps

1. Navigate to **Settings** > **Integrations** in your Whiteout AI dashboard
2. Select the integration you want to configure
3. Follow the specific setup guide for that integration
4. Test the connection
5. Configure any additional settings (scopes, permissions, etc.)

## Security Recommendations

- Use dedicated service accounts for integrations rather than personal accounts
- Apply the principle of least privilege when granting permissions
- Regularly audit integration access and rotate credentials
- Enable audit logging for all integration activities

## Support

If you encounter issues during setup, please contact support@groovysec.com or refer to our troubleshooting guides.
`,
};

// Function to load additional docs dynamically
export async function loadDoc(path: string): Promise<string | null> {
  try {
    const response = await fetch(`/content/${path}.md`);
    if (response.ok) {
      return await response.text();
    }
    return null;
  } catch {
    return null;
  }
}
