import { ScrollReveal } from "@/components/motion";

export function SecurityCompliance() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Flexible Deployment Architecture
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Deploy Whiteout AI the way your organization needs — fully managed, in your cloud, or completely air-gapped on your own network.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative flex flex-col items-center">
            {/* SVG Flow */}
            <svg
              className="w-full text-slate-700"
              viewBox="0 0 800 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="deploy-blue" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#1a5fb4" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="deploy-green" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#2e7d32" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="deploy-orange" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#c77800" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>

                <mask id="deploy-mask-1">
                  <path d="M 400 60 Q 400 100 200 120 T 130 160" stroke="white" strokeWidth="2" />
                </mask>
                <mask id="deploy-mask-2">
                  <path d="M 400 60 V 160" stroke="white" strokeWidth="2" />
                </mask>
                <mask id="deploy-mask-3">
                  <path d="M 400 60 Q 400 100 600 120 T 670 160" stroke="white" strokeWidth="2" />
                </mask>
              </defs>

              {/* Static paths */}
              <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3">
                <path d="M 400 60 Q 400 100 200 120 T 130 160" />
                <path d="M 400 60 V 160" />
                <path d="M 400 60 Q 400 100 600 120 T 670 160" />
              </g>

              {/* Animated lights */}
              <g mask="url(#deploy-mask-1)">
                <circle r="18" fill="url(#deploy-blue)">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 400 60 Q 400 100 200 120 T 130 160" />
                </circle>
              </g>
              <g mask="url(#deploy-mask-2)">
                <circle r="18" fill="url(#deploy-green)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s" path="M 400 60 V 160" />
                </circle>
              </g>
              <g mask="url(#deploy-mask-3)">
                <circle r="18" fill="url(#deploy-orange)">
                  <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path="M 400 60 Q 400 100 600 120 T 670 160" />
                </circle>
              </g>

              {/* Top center — Whiteout AI source */}
              <g>
                <rect x="340" y="16" width="120" height="44" rx="10" fill="#0f1115" stroke="currentColor" strokeWidth="0.8" />
                <image href="/icononly_transparent_nobuffer.png" x="352" y="22" width="24" height="24" />
                <text x="382" y="39" fill="white" fontSize="12" fontWeight="600">Whiteout AI</text>
                <text x="358" y="52" fill="#64748b" fontSize="8">Choose your deployment</text>
              </g>

              {/* Left — Whiteout-Hosted */}
              <g>
                <rect x="50" y="160" width="160" height="190" rx="12" fill="#0f1115" stroke="#1a5fb4" strokeWidth="1" />
                {/* Status badge */}
                <rect x="85" y="172" width="90" height="18" rx="9" fill="#1a5fb4" opacity="0.2" />
                <circle cx="95" cy="181" r="3" fill="#4ade80" />
                <text x="103" y="185" fill="#4ade80" fontSize="8" fontWeight="600">Production</text>

                <text x="130" y="210" fill="white" fontSize="13" fontWeight="700" textAnchor="middle">Whiteout-Hosted</text>

                <g fill="#94a3b8" fontSize="8">
                  <circle cx="72" cy="232" r="1.5" fill="#1a5fb4" />
                  <text x="80" y="235">Fully managed by Whiteout</text>
                  <circle cx="72" cy="248" r="1.5" fill="#1a5fb4" />
                  <text x="80" y="251">Per-org resource isolation</text>
                  <circle cx="72" cy="264" r="1.5" fill="#1a5fb4" />
                  <text x="80" y="267">Dedicated infrastructure</text>
                  <circle cx="72" cy="280" r="1.5" fill="#1a5fb4" />
                  <text x="80" y="283">Managed encryption keys</text>
                  <circle cx="72" cy="296" r="1.5" fill="#1a5fb4" />
                  <text x="80" y="299">Optional BYOK</text>
                </g>

                {/* Pulsing indicator */}
                <circle cx="130" cy="340" r="4" fill="#1a5fb4" opacity="0.6">
                  <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="130" cy="340" r="3" fill="#1a5fb4" />
              </g>

              {/* Center — Client-Hosted */}
              <g>
                <rect x="320" y="160" width="160" height="190" rx="12" fill="#0f1115" stroke="#2e7d32" strokeWidth="1" />
                {/* Status badge */}
                <rect x="355" y="172" width="90" height="18" rx="9" fill="#2e7d32" opacity="0.2" />
                <circle cx="365" cy="181" r="3" fill="#4ade80" />
                <text x="373" y="185" fill="#4ade80" fontSize="8" fontWeight="600">Production</text>

                <text x="400" y="210" fill="white" fontSize="13" fontWeight="700" textAnchor="middle">Client-Hosted</text>

                <g fill="#94a3b8" fontSize="8">
                  <circle cx="342" cy="232" r="1.5" fill="#2e7d32" />
                  <text x="350" y="235">Your cloud account</text>
                  <circle cx="342" cy="248" r="1.5" fill="#2e7d32" />
                  <text x="350" y="251">You control the network</text>
                  <circle cx="342" cy="264" r="1.5" fill="#2e7d32" />
                  <text x="350" y="267">Your encryption keys</text>
                  <circle cx="342" cy="280" r="1.5" fill="#2e7d32" />
                  <text x="350" y="283">Container images from</text>
                  <text x="350" y="299">Groovy Security registry</text>
                </g>

                <circle cx="400" cy="340" r="4" fill="#2e7d32" opacity="0.6">
                  <animate attributeName="r" values="4;8;4" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="400" cy="340" r="3" fill="#2e7d32" />
              </g>

              {/* Right — LAN-Hosted */}
              <g>
                <rect x="590" y="160" width="160" height="190" rx="12" fill="#0f1115" stroke="#c77800" strokeWidth="1" />
                {/* Status badge */}
                <rect x="621" y="172" width="98" height="18" rx="9" fill="#c77800" opacity="0.2" />
                <circle cx="631" cy="181" r="3" fill="#fbbf24" />
                <text x="639" y="185" fill="#fbbf24" fontSize="8" fontWeight="600">In Development</text>

                <text x="670" y="210" fill="white" fontSize="13" fontWeight="700" textAnchor="middle">LAN-Hosted</text>

                <g fill="#94a3b8" fontSize="8">
                  <circle cx="612" cy="232" r="1.5" fill="#c77800" />
                  <text x="620" y="235">On-premises network</text>
                  <circle cx="612" cy="248" r="1.5" fill="#c77800" />
                  <text x="620" y="251">Fully air-gapped option</text>
                  <circle cx="612" cy="264" r="1.5" fill="#c77800" />
                  <text x="620" y="267">No cloud dependency</text>
                  <circle cx="612" cy="280" r="1.5" fill="#c77800" />
                  <text x="620" y="283">Local GPU inference</text>
                  <circle cx="612" cy="296" r="1.5" fill="#c77800" />
                  <text x="620" y="299">Offline license key</text>
                </g>

                <circle cx="670" cy="340" r="4" fill="#c77800" opacity="0.6">
                  <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="670" cy="340" r="3" fill="#c77800" />
              </g>
            </svg>

            {/* Bottom summary */}
            <div className="grid md:grid-cols-3 gap-4 mt-6 w-full">
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-[#1a5fb4]/20 p-5 text-center">
                <div className="text-sm font-bold text-white mb-1">End-to-End Encryption</div>
                <p className="text-xs text-slate-500">All data encrypted in transit and at rest across every deployment model</p>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-[#2e7d32]/20 p-5 text-center">
                <div className="text-sm font-bold text-white mb-1">SOC 2 Type II</div>
                <p className="text-xs text-slate-500">Certification in progress — built for the strictest compliance requirements</p>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl border border-[#c77800]/20 p-5 text-center">
                <div className="text-sm font-bold text-white mb-1">Role-Based Access</div>
                <p className="text-xs text-slate-500">Granular RBAC with enterprise SSO integration support</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
