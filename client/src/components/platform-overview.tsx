import { Shield, Network, TrendingUp, CheckCircle } from "lucide-react";

export function PlatformOverview() {
  const features = [
    {
      icon: Shield,
      title: "Policy-First Security",
      description: "Every AI interaction is verified against your custom policies before execution. Complete data isolation ensures sensitive information never leaves your environment.",
      benefits: [
        "Custom policy enforcement",
        "Real-time compliance monitoring",
        "Automated audit trails"
      ],
      color: "blue"
    },
    {
      icon: Network,
      title: "Seamless Integration",
      description: "Deploy to give access to your existing technology stack to internally query information. Native integrations with popular enterprise tools and platforms.",
      benefits: [
        "Jira, Confluence, GitHub",
        "Sharepoint, Googledrive, and more",
        "Enterprise SSO support"
      ],
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "Complete Visibility",
      description: "Comprehensive monitoring and analytics across your entire AI usage. Track compliance, identify risks, and optimize performance.",
      benefits: [
        "Real-time usage analytics",
        "Compliance reporting",
        "Risk assessment tools"
      ],
      color: "orange"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-600/10",
      text: "text-blue-600",
      icon: "text-blue-600"
    },
    green: {
      bg: "bg-green-600/10",
      text: "text-green-600",
      icon: "text-green-600"
    },
    orange: {
      bg: "bg-orange-600/10",
      text: "text-orange-600",
      icon: "text-orange-600"
    }
  };

  return (
    <section id="platform" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why Enterprises Choose Whiteout AI
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Complete AI governance solution designed for enterprise security, compliance, and operational excellence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            
            return (
              <div 
                key={index}
                className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 ${colors.icon}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
