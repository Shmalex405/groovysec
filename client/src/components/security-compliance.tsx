import { ScrollReveal } from "@/components/motion";
import { SpinningMarkSvg } from "@/components/ui/spinning-mark";

export function SecurityCompliance() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              Flexible Deployment Architecture
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto">
              Deploy Whiteout AI the way your organization needs — fully managed, in your cloud, or completely air-gapped on your own network.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative flex flex-col items-center">
            {/* SVG Flow */}
            <svg
              className="w-full text-[#0F1B2D]"
              viewBox="0 0 800 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="deploy-blue" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#1a5fb4" />
                  <stop offset="100%" stopColor="#1a5fb4" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="deploy-green" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#2e7d32" />
                  <stop offset="100%" stopColor="#2e7d32" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="deploy-orange" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#c77800" />
                  <stop offset="100%" stopColor="#c77800" stopOpacity="0" />
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
                <rect x="340" y="16" width="120" height="44" rx="10" fill="#FFFFFF" stroke="#1a5fb4" strokeWidth="0.8" />
                <SpinningMarkSvg x={352} y={22} size={24} />
                <text x="382" y="39" fill="#0F1B2D" fontSize="12" fontWeight="600">Whiteout AI</text>
                <text x="358" y="52" fill="#51617A" fontSize="8">Choose your deployment</text>
              </g>

              {/* Left — Whiteout-Hosted */}
              <g>
                <rect x="50" y="160" width="160" height="190" rx="12" fill="#FFFFFF" stroke="#1a5fb4" strokeWidth="1" />
                {/* Status badge */}
                <rect x="85" y="172" width="90" height="18" rx="9" fill="#2E7D32" fillOpacity="0.1" stroke="#2E7D32" strokeOpacity="0.25" strokeWidth="1" />
                <circle cx="95" cy="181" r="3" fill="#2E7D32" />
                <text x="103" y="185" fill="#2E7D32" fontSize="8" fontWeight="600">Production</text>

                <text x="130" y="210" fill="#0F1B2D" fontSize="13" fontWeight="700" textAnchor="middle">Whiteout-Hosted</text>

                <g fill="#51617A" fontSize="8">
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
                <rect x="320" y="160" width="160" height="190" rx="12" fill="#FFFFFF" stroke="#2e7d32" strokeWidth="1" />
                {/* Status badge */}
                <rect x="355" y="172" width="90" height="18" rx="9" fill="#2E7D32" fillOpacity="0.1" stroke="#2E7D32" strokeOpacity="0.25" strokeWidth="1" />
                <circle cx="365" cy="181" r="3" fill="#2E7D32" />
                <text x="373" y="185" fill="#2E7D32" fontSize="8" fontWeight="600">Production</text>

                <text x="400" y="210" fill="#0F1B2D" fontSize="13" fontWeight="700" textAnchor="middle">Client-Hosted</text>

                <g fill="#51617A" fontSize="8">
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
                <rect x="590" y="160" width="160" height="190" rx="12" fill="#FFFFFF" stroke="#c77800" strokeWidth="1" />
                {/* Status badge */}
                <rect x="621" y="172" width="98" height="18" rx="9" fill="#A05F00" fillOpacity="0.1" stroke="#A05F00" strokeOpacity="0.25" strokeWidth="1" />
                <circle cx="631" cy="181" r="3" fill="#A05F00" />
                <text x="639" y="185" fill="#A05F00" fontSize="8" fontWeight="600">In Development</text>

                <text x="670" y="210" fill="#0F1B2D" fontSize="13" fontWeight="700" textAnchor="middle">LAN-Hosted</text>

                <g fill="#51617A" fontSize="8">
                  <circle cx="612" cy="232" r="1.5" fill="#A05F00" />
                  <text x="620" y="235">On-premises network</text>
                  <circle cx="612" cy="248" r="1.5" fill="#A05F00" />
                  <text x="620" y="251">Fully air-gapped option</text>
                  <circle cx="612" cy="264" r="1.5" fill="#A05F00" />
                  <text x="620" y="267">No cloud dependency</text>
                  <circle cx="612" cy="280" r="1.5" fill="#A05F00" />
                  <text x="620" y="283">Local GPU inference</text>
                  <circle cx="612" cy="296" r="1.5" fill="#A05F00" />
                  <text x="620" y="299">Offline license key</text>
                </g>

                <circle cx="670" cy="340" r="4" fill="#c77800" opacity="0.6">
                  <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="670" cy="340" r="3" fill="#c77800" />
              </g>
            </svg>

            {/* Who each deployment is for */}
            <div className="grid md:grid-cols-3 gap-4 mt-6 w-full">
              <div className="bg-white rounded-xl border border-[#1a5fb4]/20 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] p-5 text-center">
                <div className="text-[10px] tracking-[0.18em] font-semibold text-[#1A5FB4] mb-1.5">WHITEOUT-HOSTED</div>
                <div className="text-sm font-bold text-[#0F1B2D] mb-1">The Classic SaaS Approach</div>
                <p className="text-xs text-[#6E7B8C]">
                  Sign up, set policies, done. Groovy carries the pager — dedicated,
                  isolated infrastructure with managed keys — so your team gets
                  governance without a single server to babysit.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#2e7d32]/20 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] p-5 text-center">
                <div className="text-[10px] tracking-[0.18em] font-semibold text-[#2E7D32] mb-1.5">CLIENT-HOSTED</div>
                <div className="text-sm font-bold text-[#0F1B2D] mb-1">Maximum Data Control</div>
                <p className="text-xs text-[#6E7B8C]">
                  Your cloud, your network, your keys. Whiteout runs entirely inside
                  your own account, so the answer to "where does our data go?" is
                  simple: nowhere. You own it.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#c77800]/20 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] p-5 text-center">
                <div className="text-[10px] tracking-[0.18em] font-semibold text-[#A05F00] mb-1.5">LAN-HOSTED</div>
                <div className="text-sm font-bold text-[#0F1B2D] mb-1">For the Extremely Regulated</div>
                <p className="text-xs text-[#6E7B8C]">
                  For environments where nothing leaves the building. Fully air-gapped
                  on-premises operation with local GPU inference — built for defense,
                  government, and classified networks.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
