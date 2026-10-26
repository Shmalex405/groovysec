# Whiteout AI Admin Setup Guides

Welcome to the Whiteout AI administrator documentation. This guide will help you configure integrations and identity providers for your organization.

## Table of Contents

### Getting Started

New to Whiteout AI? Start with the walkthrough. It takes you from a new tenant to a governed pilot group, with or without SSO and an MDM.

| Guide | Description |
|-------|-------------|
| [Onboarding Walkthrough](./onboarding/overview.md) | From a new tenant to a governed pilot group, end to end |
| [Installing Without MDM or SSO](./deployment/install-without-mdm.md) | Invite people by email and have them install and sign in themselves |

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
| [AWS Bedrock](./integrations/aws-bedrock.md) | Govern Bedrock model usage across AWS accounts | [Setup Guide](./integrations/aws-bedrock.md) |
| [Custom Integration](./integrations/custom-integration.md) | Connect any REST API | [Setup Guide](./integrations/custom-integration.md) |

### Single Sign-On (SSO) Providers

Configure identity providers to enable secure authentication for your organization's users.

| Provider | Protocols Supported | Guide |
|----------|---------------------|-------|
| [Microsoft Entra ID](./sso-providers/microsoft-entra-id.md) | OIDC, Groups | [Setup Guide](./sso-providers/microsoft-entra-id.md) |
| [Okta](./sso-providers/okta.md) | OIDC, Groups | [Setup Guide](./sso-providers/okta.md) |
| [Google Workspace](./sso-providers/google-workspace.md) | OIDC, Groups | [Setup Guide](./sso-providers/google-workspace.md) |
| [OneLogin](./sso-providers/onelogin.md) | OIDC, Groups | [Setup Guide](./sso-providers/onelogin.md) |
| [Ping Identity](./sso-providers/ping-identity.md) | OIDC, Groups | [Setup Guide](./sso-providers/ping-identity.md) |
| [JumpCloud](./sso-providers/jumpcloud.md) | OIDC, Groups | [Setup Guide](./sso-providers/jumpcloud.md) |
| [Auth0](./sso-providers/auth0.md) | OIDC | [Setup Guide](./sso-providers/auth0.md) |
| [Generic OIDC](./sso-providers/generic-oidc.md) | OIDC | [Setup Guide](./sso-providers/generic-oidc.md) |
| [Generic SAML](./sso-providers/generic-saml.md) | Not available. Use OIDC | [Details](./sso-providers/generic-saml.md) |
| [Groups, Users & SCIM](./sso-providers/groups-users-scim.md) | SCIM, JIT, Group Sync | [Setup Guide](./sso-providers/groups-users-scim.md) |

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

### Deployment

Choose how Whiteout AI runs for your organization and roll it out to your device fleet.

| Guide | Description |
|-------|-------------|
| [Deployment Models](./deployment/overview.md) | SaaS, self-hosted AWS, and air-gapped options compared |
| [Self-Hosted AWS](./deployment/self-hosted-aws.md) | Run the entire platform in your own AWS account |
| [Managing a Self-Hosted Deployment](./deployment/self-hosted-operations.md) | Scaling, capacity and updates for a self-hosted deployment |
| [Zero-Touch MDM](./deployment/zero-touch-mdm.md) | Device-attested, zero-touch endpoint enrollment |
| [Installing Without MDM or SSO](./deployment/install-without-mdm.md) | Manual installs and email-and-password sign-in |
| [Windows MSI](./deployment/windows-msi.md) | Enterprise MSI deployment via GPO or Intune |

### Governance

| Guide | Description |
|-------|-------------|
| [Audit-Only Mode](./governance/audit-only-mode.md) | Full visibility into AI use without blocking anything |
| [When Whiteout Is Unavailable](./governance/when-whiteout-is-unavailable.md) | What users see and what admins get when Whiteout can't check a message |
| [Account Rules for AI Apps](./governance/account-rules.md) | Allow an AI app with work accounts only, and what people see when they use a personal one |

### AI Footprint

Find the AI on your devices and network, including AI no Whiteout surface governs.

| Guide | Description |
|-------|-------------|
| [Overview](./ai-footprint/overview.md) | What AI Footprint shows, its tabs, and how to manage findings |
| [Shadow AI Findings](./ai-footprint/shadow-ai.md) | Installed, running and active shadow AI: severity and what to do |
| [Browser Coverage](./ai-footprint/browser-coverage.md) | Browser profiles without Whiteout, and how to force-install the extension |
| [Third-Party AI Extensions](./ai-footprint/ai-browser-extensions.md) | AI extensions such as Grammarly and Sider, and how to block them |
| [Web AI Sites](./ai-footprint/web-ai-sites.md) | AI websites in use, and what the extension collects |
| [Personal and Work Accounts](./ai-footprint/account-types.md) | Which kind of account each prompt was sent from |
| [Built-In Browser AI](./ai-footprint/built-in-browser-ai.md) | Gemini in Chrome, Copilot in Edge and other browser AI, and how to turn them off with MDM |
| [AI Inside Work Apps](./ai-footprint/ai-in-work-apps.md) | Slack AI, Notion AI, Atlassian Rovo and AI writing extensions such as Grammarly |
| [AI Apps Connected With Work Accounts](./ai-footprint/connected-ai-apps.md) | AI apps people connected through Google Workspace, Microsoft 365 or Okta |
| [Vendor Audit Logs](./ai-footprint/vendor-audit-logs.md) | AI use recorded in the Microsoft 365 Copilot, Google Gemini and Slack audit logs |
| [Network Visibility](./ai-footprint/network-visibility.md) | When Desktop Guard can't see browser AI traffic, and how to fix it |
| [Importing Network Logs](./ai-footprint/network-logs.md) | Find AI use in Cisco Umbrella, Zscaler and other DNS or proxy logs |

### Security & Encryption

| Guide | Description |
|-------|-------------|
| [BYOK Encryption](./security/byok.md) | Encrypt your deployment under a KMS key you control |
| [BYOK Terraform Module](./security/byok-terraform-module.md) | Provision the customer-managed key with Terraform |

### Developers

| Guide | Description |
|-------|-------------|
| [Python SDK](./developers/python-sdk.md) | Govern LLM calls in Python services |
| [Node.js SDK](./developers/node-sdk.md) | Govern LLM calls in Node.js and TypeScript |
| [AWS Lambda Layer](./developers/lambda-layer.md) | Drop-in governance for Lambda functions |

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
