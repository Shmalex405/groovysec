import { FileText, GitBranch, FolderOpen, Cloud, HardDrive } from "lucide-react";

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
    }
  ];

  const aiModels = [
    {
      name: "OpenAI",
      description: "GPT-4, GPT-3.5"
    },
    {
      name: "Anthropic",
      description: "Claude"
    },
    {
      name: "Google",
      description: "Gemini, PaLM"
    },
    {
      name: "Custom Models",
      description: "Private & Fine-tuned"
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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise Platform Integration
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Deploy Whiteout AI across your existing technology stack with native integrations and APIs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            const colorClass = colorClasses[integration.color as keyof typeof colorClasses];
            
            return (
              <div 
                key={index}
                className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                <p className="text-sm text-slate-600">{integration.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-blue-600/10 rounded-full border border-blue-500/30">
            <span className="text-blue-600 font-medium">More integrations coming soon</span>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Supported AI Models</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiModels.map((model, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-900">{model.name}</div>
                <div className="text-sm text-slate-600">{model.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
