import { User, Search, Shield, CheckCircle, Clock } from "lucide-react";

export function PolicyWorkflow() {
  const steps = [
    {
      icon: User,
      title: "1. User Request",
      description: "User submits AI prompt",
      color: "blue"
    },
    {
      icon: Search,
      title: "2. Policy Check",
      description: "Request analyzed against organizations security policies",
      color: "orange"
    },
    {
      icon: Shield,
      title: "3. Data Protection",
      description: "Sensitive data filtered and secured before processing",
      color: "green"
    },
    {
      icon: CheckCircle,
      title: "4. Secure Response",
      description: "If no policy violation, AI prompt sent with full audit trail",
      color: "blue"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-600/10",
      icon: "text-blue-600"
    },
    orange: {
      bg: "bg-orange-600/10",
      icon: "text-orange-600"
    },
    green: {
      bg: "bg-green-600/10",
      icon: "text-green-600"
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Policy Verification Workflow
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See how Whiteout AI ensures every AI interaction meets your security and compliance requirements.
          </p>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colors = colorClasses[step.color as keyof typeof colorClasses];
              
              return (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              );
            })}
          </div>
          
      
            
          
        </div>
      </div>
    </section>
  );
}
