import { Link } from 'react-router-dom';
import {
  BookOpen,
  Link2,
  Shield,
  ArrowRight,
  Github,
  MessageSquare,
  FileText,
  Database,
  Radio,
  Monitor
} from 'lucide-react';

const quickLinks = [
  {
    title: 'Data Integrations',
    description: 'Connect GitHub, Slack, Confluence, and more',
    href: '/admin-guides/integrations/github',
    icon: Link2,
    color: 'text-groovy-blue',
  },
  {
    title: 'SSO Providers',
    description: 'Configure Okta, Azure AD, Google Workspace, and more',
    href: '/admin-guides/sso-providers/okta',
    icon: Shield,
    color: 'text-groovy-green',
  },
  {
    title: 'SOC/SIEM Destinations',
    description: 'Stream audit events to Splunk, Sentinel, Elasticsearch, and more',
    href: '/admin-guides/soc-destinations/webhook',
    icon: Radio,
    color: 'text-orange-500',
  },
  {
    title: 'MDM Providers',
    description: 'Deploy and manage Whiteout AI via Intune, Jamf, Kandji, and more',
    href: '/admin-guides/mdm-providers/microsoft-intune',
    icon: Monitor,
    color: 'text-purple-500',
  },
];

const popularGuides = [
  { title: 'GitHub Integration', href: '/admin-guides/integrations/github', icon: Github },
  { title: 'Slack Integration', href: '/admin-guides/integrations/slack', icon: MessageSquare },
  { title: 'Okta SSO', href: '/admin-guides/sso-providers/okta', icon: Shield },
  { title: 'Microsoft Entra ID', href: '/admin-guides/sso-providers/microsoft-entra-id', icon: Shield },
  { title: 'Confluence', href: '/admin-guides/integrations/confluence', icon: FileText },
  { title: 'Custom Integration', href: '/admin-guides/integrations/custom-integration', icon: Database },
];

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">
          Whiteout AI Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Setup guides and configuration instructions for integrating Whiteout AI
          with your organization's tools and identity providers.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 gap-6">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="group p-6 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-muted ${link.color}`}>
                <link.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {link.description}
                </p>
              </div>
              <ArrowRight
                size={20}
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Guides */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          Popular Guides
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularGuides.map((guide) => (
            <Link
              key={guide.href}
              to={guide.href}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <guide.icon size={20} className="text-muted-foreground" />
              <span className="font-medium">{guide.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin Guide Overview */}
      <div className="bg-gradient-to-br from-primary/10 to-groovy-green/10 rounded-lg p-8 border border-primary/20">
        <h2 className="text-2xl font-semibold mb-4">
          Getting Started
        </h2>
        <p className="text-muted-foreground mb-6">
          New to Whiteout AI? Start with the Admin Setup Guide to understand how to configure
          integrations and identity providers for your organization.
        </p>
        <Link
          to="/admin-guides/overview"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Read the Overview
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Help Section */}
      <div className="text-center py-8 border-t border-border">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-muted-foreground mb-4">
          Can't find what you're looking for? Contact our support team.
        </p>
        <a
          href="mailto:support@groovysec.com"
          className="text-primary hover:underline"
        >
          support@groovysec.com
        </a>
      </div>
    </div>
  );
}
