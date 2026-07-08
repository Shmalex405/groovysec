export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Overview', href: '/admin-guides/overview' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { title: 'Deployment Models', href: '/admin-guides/deployment/overview' },
      { title: 'Self-Hosted AWS', href: '/admin-guides/deployment/self-hosted-aws' },
      { title: 'Zero-Touch MDM', href: '/admin-guides/deployment/zero-touch-mdm' },
      { title: 'Windows MSI', href: '/admin-guides/deployment/windows-msi' },
    ],
  },
  {
    title: 'Whiteout AI Connector',
    items: [
      { title: 'Overview', href: '/admin-guides/whiteout-ai-connector/overview' },
      { title: 'Connect an AI Assistant', href: '/admin-guides/whiteout-ai-connector/connect-ai-assistant' },
      { title: 'Connector Policy', href: '/admin-guides/whiteout-ai-connector/connector-policy' },
      { title: 'Google Workspace (Zero-Click)', href: '/admin-guides/whiteout-ai-connector/google-workspace-dwd' },
      { title: 'Google Drive', href: '/admin-guides/whiteout-ai-connector/google-drive' },
      { title: 'SharePoint', href: '/admin-guides/whiteout-ai-connector/sharepoint' },
      { title: 'OneDrive', href: '/admin-guides/whiteout-ai-connector/onedrive' },
      { title: 'Dropbox', href: '/admin-guides/whiteout-ai-connector/dropbox' },
      { title: 'Box', href: '/admin-guides/whiteout-ai-connector/box' },
      { title: 'Confluence', href: '/admin-guides/whiteout-ai-connector/confluence' },
      { title: 'Notion', href: '/admin-guides/whiteout-ai-connector/notion' },
      { title: 'Gmail', href: '/admin-guides/whiteout-ai-connector/gmail' },
      { title: 'Slack', href: '/admin-guides/whiteout-ai-connector/slack' },
      { title: 'GitHub', href: '/admin-guides/whiteout-ai-connector/github' },
      { title: 'Jira', href: '/admin-guides/whiteout-ai-connector/jira' },
      { title: 'Linear', href: '/admin-guides/whiteout-ai-connector/linear' },
      { title: 'Asana', href: '/admin-guides/whiteout-ai-connector/asana' },
      { title: 'Trello', href: '/admin-guides/whiteout-ai-connector/trello' },
    ],
  },
  {
    title: 'Data Integrations',
    items: [
      { title: 'GitHub', href: '/admin-guides/integrations/github' },
      { title: 'Confluence', href: '/admin-guides/integrations/confluence' },
      { title: 'Jira', href: '/admin-guides/integrations/jira' },
      { title: 'Notion', href: '/admin-guides/integrations/notion' },
      { title: 'Slack', href: '/admin-guides/integrations/slack' },
      { title: 'Microsoft Teams', href: '/admin-guides/integrations/microsoft-teams' },
      { title: 'Google Drive', href: '/admin-guides/integrations/google-drive' },
      { title: 'Trello', href: '/admin-guides/integrations/trello' },
      { title: 'Linear', href: '/admin-guides/integrations/linear' },
      { title: 'Asana', href: '/admin-guides/integrations/asana' },
      { title: 'SharePoint', href: '/admin-guides/integrations/sharepoint' },
      { title: 'AWS Bedrock', href: '/admin-guides/integrations/aws-bedrock' },
      { title: 'Custom Integration', href: '/admin-guides/integrations/custom-integration' },
    ],
  },
  {
    title: 'SSO & Identity',
    items: [
      { title: 'Microsoft Entra ID', href: '/admin-guides/sso-providers/microsoft-entra-id' },
      { title: 'Okta', href: '/admin-guides/sso-providers/okta' },
      { title: 'Google Workspace', href: '/admin-guides/sso-providers/google-workspace' },
      { title: 'OneLogin', href: '/admin-guides/sso-providers/onelogin' },
      { title: 'Ping Identity', href: '/admin-guides/sso-providers/ping-identity' },
      { title: 'JumpCloud', href: '/admin-guides/sso-providers/jumpcloud' },
      { title: 'Auth0', href: '/admin-guides/sso-providers/auth0' },
      { title: 'Generic OIDC', href: '/admin-guides/sso-providers/generic-oidc' },
      { title: 'Generic SAML', href: '/admin-guides/sso-providers/generic-saml' },
      { title: 'Groups, Users & SCIM', href: '/admin-guides/sso-providers/groups-users-scim' },
    ],
  },
  {
    title: 'SOC/SIEM Destinations',
    items: [
      { title: 'Webhook', href: '/admin-guides/soc-destinations/webhook' },
      { title: 'Splunk HEC', href: '/admin-guides/soc-destinations/splunk-hec' },
      { title: 'Azure Sentinel', href: '/admin-guides/soc-destinations/azure-sentinel' },
      { title: 'Elasticsearch', href: '/admin-guides/soc-destinations/elasticsearch' },
      { title: 'IBM QRadar', href: '/admin-guides/soc-destinations/ibm-qradar' },
      { title: 'AWS S3', href: '/admin-guides/soc-destinations/aws-s3' },
    ],
  },
  {
    title: 'MDM Providers',
    items: [
      { title: 'Microsoft Intune', href: '/admin-guides/mdm-providers/microsoft-intune' },
      { title: 'Jamf', href: '/admin-guides/mdm-providers/jamf' },
      { title: 'VMware Workspace ONE', href: '/admin-guides/mdm-providers/vmware-workspace-one' },
      { title: 'Kandji', href: '/admin-guides/mdm-providers/kandji' },
      { title: 'Mosyle', href: '/admin-guides/mdm-providers/mosyle' },
    ],
  },
  {
    title: 'Security & Encryption',
    items: [
      { title: 'BYOK Encryption', href: '/admin-guides/security/byok' },
      { title: 'BYOK Terraform Module', href: '/admin-guides/security/byok-terraform-module' },
    ],
  },
  {
    title: 'Developers',
    items: [
      { title: 'Python SDK', href: '/admin-guides/developers/python-sdk' },
      { title: 'Node.js SDK', href: '/admin-guides/developers/node-sdk' },
      { title: 'AWS Lambda Layer', href: '/admin-guides/developers/lambda-layer' },
    ],
  },
];
