import { User, Shield, CheckCircle, X, Cloud, Server, ArrowRight, AlertTriangle } from "lucide-react";

export function ArchitectureFlow() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            How Whiteout AI Works
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Users work directly within the Whiteout platform where every prompt is verified and routed to ensure data security and compliance.
          </p>
        </div>
        
        <div className="relative">
          {/* Main flow container */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              
              {/* Step 1: User in Whiteout Platform */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500 relative">
                  <User className="w-10 h-10 text-blue-400" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">User</h3>
                <p className="text-slate-300 text-sm">Submits AI prompt via Whiteout platform</p>
              </div>
              
              {/* Arrow 1 */}
              <div className="flex justify-center">
                <ArrowRight className="w-8 h-8 text-slate-400 hidden lg:block" />
              </div>
              
              {/* Step 2: Whiteout AI */}
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500 relative">
                  <Shield className="w-10 h-10 text-orange-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-white font-semibold mb-2">Whiteout AI</h3>
                <p className="text-slate-300 text-sm">Policy verification & routing engine</p>
              </div>
              
              {/* Arrow 2 */}
              <div className="flex justify-center">
                <ArrowRight className="w-8 h-8 text-slate-400 hidden lg:block" />
              </div>
              
              {/* Step 3: Decision Flow */}
              <div className="text-center">
                <div className="space-y-4">
                  {/* External AI Path */}
                  <div className="flex items-center justify-center space-x-3 p-3 bg-green-600/20 rounded-lg border border-green-500/30">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <Cloud className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">External AI</span>
                  </div>
                  
                  {/* Internal AI Path */}
                  <div className="flex items-center justify-center space-x-3 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                    <Server className="w-6 h-6 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Internal AI</span>
                  </div>
                  
                  {/* Blocked Path */}
                  <div className="flex items-center justify-center space-x-3 p-3 bg-red-600/20 rounded-lg border border-red-500/30">
                    <X className="w-6 h-6 text-red-400" />
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Blocked</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Policy Rules Display */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-green-600/10 p-6 rounded-xl border border-green-500/30">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <h4 className="text-green-400 font-semibold">Safe for External</h4>
                </div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• No sensitive data detected</li>
                  <li>• Complies with all policies</li>
                  <li>• Routed to external AI models</li>
                </ul>
              </div>
              
              <div className="bg-blue-600/10 p-6 rounded-xl border border-blue-500/30">
                <div className="flex items-center mb-3">
                  <Server className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="text-blue-400 font-semibold">Internal Only</h4>
                </div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Contains sensitive data</li>
                  <li>• Requires isolation</li>
                  <li>• Processed internally</li>
                </ul>
              </div>
              
              <div className="bg-red-600/10 p-6 rounded-xl border border-red-500/30">
                <div className="flex items-center mb-3">
                  <X className="w-5 h-5 text-red-400 mr-2" />
                  <h4 className="text-red-400 font-semibold">Policy Violation</h4>
                </div>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Violates company policies</li>
                  <li>• Potential security risk</li>
                  <li>• Request blocked</li>
                </ul>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-slate-400">Audit Coverage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">Zero</div>
                  <div className="text-sm text-slate-400">Data Leakage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}