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
      { title: 'Custom Integration', href: '/admin-guides/integrations/custom-integration' },
    ],
  },
  {
    title: 'SSO Providers',
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
];
