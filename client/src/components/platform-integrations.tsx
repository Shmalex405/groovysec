import { FileText, GitBranch, FolderOpen, Cloud, HardDrive, MessageSquare, BookOpen, Users, LayoutList, CheckSquare, ListTodo, Mail } from "lucide-react";
import {
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export function PlatformIntegrations() {
  const integrations = [
    {
      icon: GitBranch,
      name: "GitHub",
      description: "Code repository",
      color: "gray"
    },
    {
      icon: FileText,
      name: "Confluence",
      description: "Documentation",
      color: "blue"
    },
    {
      icon: FolderOpen,
      name: "Jira",
      description: "Project management",
      color: "blue"
    },
    {
      icon: HardDrive,
      name: "SharePoint",
      description: "Document management",
      color: "purple"
    },
    {
      icon: Cloud,
      name: "Google Drive",
      description: "Cloud storage",
      color: "green"
    },
    {
      icon: MessageSquare,
      name: "Slack",
      description: "Team messaging",
      color: "purple"
    },
    {
      icon: BookOpen,
      name: "Notion",
      description: "Knowledge base",
      color: "gray"
    },
    {
      icon: Users,
      name: "Teams",
      description: "Collaboration",
      color: "blue"
    },
    {
      icon: LayoutList,
      name: "Linear",
      description: "Issue tracking",
      color: "purple"
    },
    {
      icon: CheckSquare,
      name: "Trello",
      description: "Task boards",
      color: "blue"
    },
    {
      icon: ListTodo,
      name: "Asana",
      description: "Work management",
      color: "green"
    },
    {
      icon: Mail,
      name: "Gmail / Outlook",
      description: "Email integration",
      color: "blue"
    }
  ];

  const aiModels = [
    {
      name: "OpenAI",
      description: "ChatGPT, Platform"
    },
    {
      name: "Anthropic",
      description: "Claude, Console"
    },
    {
      name: "Google",
      description: "Gemini, AI Studio"
    },
    {
      name: "Microsoft",
      description: "Copilot, M365 Suite"
    },
    {
      name: "xAI",
      description: "Grok"
    },
    {
      name: "DeepSeek",
      description: "Chat"
    },
    {
      name: "Perplexity",
      description: "AI Search"
    },
    {
      name: "Self-Hosted",
      description: "Ollama, Local LLMs"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    gray: "bg-gray-100 text-gray-800",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600"
  };

  return (
    <section id="integrations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Enterprise Platform Integration
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Deploy Whiteout AI across your existing technology stack with native integrations and APIs.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            const colorClass = colorClasses[integration.color as keyof typeof colorClasses];

            return (
              <StaggerItem key={index}>
                <div
                  className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                  <p className="text-sm text-slate-600">{integration.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        <ScrollReveal>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Supported AI Models</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {aiModels.map((model, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-900">{model.name}</div>
                  <div className="text-sm text-slate-600">{model.description}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
