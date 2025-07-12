import { Button } from "@/components/ui/button";
import { Shield, Play, Calendar, CheckCircle, Cloud, Server } from "lucide-react";

export function HeroSection() {
  const scrollToDemo = () => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-6">
              <Shield className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Enterprise AI Governance Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              All-in-One
              <span className="block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                AI Governance
              </span>
              Platform
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Monitor, control, and audit how generative AI is used across your workforce. 
              Policy-first approach with complete data isolation and regulatory compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 text-[#F08C00] hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
            </div>
            
            <div className="text-sm text-slate-400 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Security certifications in progress • SOC 2 Type II pending
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700">
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-semibold mb-2">Dual-Path Architecture</h3>
                <p className="text-slate-300 text-sm">Your Data Stays With You</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center text-white">
                    <Cloud className="w-5 h-5 mr-3 text-blue-400" />
                    <span>External AI Models</span>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-orange-500 text-2xl animate-pulse">
                    <Shield className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-600/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center text-white">
                    <Server className="w-5 h-5 mr-3 text-green-400" />
                    <span>Internal Secure Model</span>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <div className="text-orange-500 font-semibold text-sm flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Policy Verified Before Send
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
