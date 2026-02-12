# Whiteout AI Admin Setup Guides

Welcome to the Whiteout AI administrator documentation. This guide will help you configure integrations and identity providers for your organization.

## Table of Contents

### Data Integrations

Connect your organization's tools to enable AI governance across your data sources. These integrations allow Whiteout AI to scan and protect sensitive information in connected applications.

| Integration | Description | Guide |
|-------------|-------------|-------|
| [GitHub](./integrations/github.md) | Source code repository integration | [Setup Guide](./integrations/github.md) |
| [Confluence](./integrations/confluence.md) | Atlassian documentation platform | [Setup Guide](./integrations/confluence.md) |
| [Jira](./integrations/jira.md) | Atlassian project management | [Setup Guide](./integrations/jira.md) |
| [Notion](./integrations/notion.md) | Collaborative workspace | [Setup Guide](./integrations/notion.md) |
| [Slack](./integrations/slack.md) | Team communication platform | [Setup Guide](./integrations/slack.md) |
| [Microsoft Teams](./integrations/microsoft-teams.md) | Microsoft collaboration platform | [Setup Guide](./integrations/microsoft-teams.md) |
| [Google Drive](./integrations/google-drive.md) | Google cloud storage | [Setup Guide](./integrations/google-drive.md) |
| [Trello](./integrations/trello.md) | Visual project management | [Setup Guide](./integrations/trello.md) |
| [Linear](./integrations/linear.md) | Modern issue tracking | [Setup Guide](./integrations/linear.md) |
| [Asana](./integrations/asana.md) | Work management platform | [Setup Guide](./integrations/asana.md) |
| [SharePoint](./integrations/sharepoint.md) | Microsoft document management | [Setup Guide](./integrations/sharepoint.md) |
| [Custom Integration](./integrations/custom-integration.md) | Connect any REST API | [Setup Guide](./integrations/custom-integration.md) |

### Single Sign-On (SSO) Providers

Configure identity providers to enable secure authentication for your organization's users.

| Provider | Protocols Supported | Guide |
|----------|---------------------|-------|
| [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md) | OIDC, Groups | [Setup Guide](./sso-providers/microsoft-entra-id.md) |
| [Okta](./sso-providers/okta.md) | OIDC, SAML, Groups | [Setup Guide](./sso-providers/okta.md) |
| [Google Workspace](./sso-providers/google-workspace.md) | OIDC, Groups | [Setup Guide](./sso-providers/google-workspace.md) |
| [OneLogin](./sso-providers/onelogin.md) | OIDC, SAML, Groups | [Setup Guide](./sso-providers/onelogin.md) |
| [Ping Identity](./sso-providers/ping-identity.md) | OIDC, SAML, Groups | [Setup Guide](./sso-providers/ping-identity.md) |
| [JumpCloud](./sso-providers/jumpcloud.md) | OIDC, SAML, Groups | [Setup Guide](./sso-providers/jumpcloud.md) |
| [Auth0](./sso-providers/auth0.md) | OIDC | [Setup Guide](./sso-providers/auth0.md) |
| [Generic OIDC](./sso-providers/generic-oidc.md) | OIDC | [Setup Guide](./sso-providers/generic-oidc.md) |
| [Generic SAML](./sso-providers/generic-saml.md) | SAML 2.0 (Beta) | [Setup Guide](./sso-providers/generic-saml.md) |

### SOC/SIEM Destinations

Stream Whiteout AI audit events to your security operations center for centralized monitoring and incident response.

| Destination | Description | Guide |
|-------------|-------------|-------|
| [Webhook](./soc-destinations/webhook.md) | Forward events to any HTTP endpoint | [Setup Guide](./soc-destinations/webhook.md) |
| [Splunk HEC](./soc-destinations/splunk-hec.md) | Stream events via HTTP Event Collector | [Setup Guide](./soc-destinations/splunk-hec.md) |
| [Azure Sentinel](./soc-destinations/azure-sentinel.md) | Ingest events into Microsoft Sentinel | [Setup Guide](./soc-destinations/azure-sentinel.md) |
| [Elasticsearch](./soc-destinations/elasticsearch.md) | Ship events for search and visualization | [Setup Guide](./soc-destinations/elasticsearch.md) |
| [IBM QRadar](./soc-destinations/ibm-qradar.md) | Forward events via syslog | [Setup Guide](./soc-destinations/ibm-qradar.md) |
| [AWS S3](./soc-destinations/aws-s3.md) | Batch-export events for archival | [Setup Guide](./soc-destinations/aws-s3.md) |

### MDM Providers

Deploy and manage Whiteout AI agents across your device fleet using your existing MDM solution.

| Provider | Description | Guide |
|----------|-------------|-------|
| [Microsoft Intune](./mdm-providers/microsoft-intune.md) | Windows and cross-platform MDM | [Setup Guide](./mdm-providers/microsoft-intune.md) |
| [Jamf](./mdm-providers/jamf.md) | Apple device management | [Setup Guide](./mdm-providers/jamf.md) |
| [VMware Workspace ONE](./mdm-providers/vmware-workspace-one.md) | Cross-platform UEM | [Setup Guide](./mdm-providers/vmware-workspace-one.md) |
| [Kandji](./mdm-providers/kandji.md) | Apple device management | [Setup Guide](./mdm-providers/kandji.md) |
| [Mosyle](./mdm-providers/mosyle.md) | Apple device management | [Setup Guide](./mdm-providers/mosyle.md) |

## Before You Begin

### Prerequisites

1. **Admin Access**: You must have administrator privileges in Whiteout AI
2. **Service Account Permissions**: For most integrations, you'll need admin access to the third-party service
3. **Network Access**: Ensure your firewall allows connections to required endpoints

### General Configuration Steps

1. Navigate to **Settings** > **Integrations** in your Whiteout AI dashboard
2. Select the integration you want to configure
3. Follow the specific setup guide for that integration
4. Test the connection
5. Configure any additional settings (scopes, permissions, etc.)

### Security Recommendations

- Use dedicated service accounts for integrations rather than personal accounts
- Apply the principle of least privilege when granting permissions
- Regularly audit integration access and rotate credentials
- Enable audit logging for all integration activities

## Support

If you encounter issues during setup, please contact Whiteout AI support or refer to our troubleshooting guides.
