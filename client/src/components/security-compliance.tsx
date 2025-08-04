import { Lock, Tag, Eye, Shield, UserCheck, Key, Clock } from "lucide-react";

export function SecurityCompliance() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Data Isolation",
      description: "Your Whiteout AI data is stored where you want it. AWS S3 or a Local-Lan gives complete data isolation to ensure regulatory compliance."
    },
    {
      icon: Tag,
      title: "Compliance Ready",
      description: "SOC 2 Type II certification in progress. GDPR, HIPAA, and other regulatory framework compliance support."
    },
    {
      icon: Eye,
      title: "Complete Audit Trail",
      description: "Every Whiteout AI interaction is logged with full context for compliance reporting and risk assessment."
    }
  ];

  const securityChecks = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      status: "active"
    },
    {
      icon: UserCheck,
      title: "Role-Based Access Control",
      status: "active"
    },
    {
      icon: Key,
      title: "Soon to support Enterprise SSO Integration",
      status: "active"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      status: "active"
    }
  ];

  return (
    <section id="security" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise-Grade Security
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Built with security-first architecture to meet the strictest enterprise and regulatory requirements.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const colorClasses = [
                  "bg-blue-600/10 text-blue-600",
                  "bg-green-600/10 text-green-600",
                  "bg-orange-600/10 text-orange-600"
                ];
                
                return (
                  <div key={index} className="flex items-start">
                    <div className={`w-12 h-12 ${colorClasses[index]} rounded-full flex items-center justify-center mr-4 flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Security Features</h3>
            <div className="space-y-4">
              {securityChecks.map((check, index) => {
                const Icon = check.icon;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-100">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-medium text-slate-900">{check.title}</span>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
