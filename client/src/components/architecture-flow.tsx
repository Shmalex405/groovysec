import { ScrollReveal } from "@/components/motion";
import { SpinningMarkSvg } from "@/components/ui/spinning-mark";

export function ArchitectureFlow() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
              How Whiteout AI Works
            </h2>
            <p className="text-lg text-[#51617A] max-w-2xl mx-auto mb-4">
              Every AI prompt/upload is intercepted, verified against your policies — routed if approved, blocked on the device level if not.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative flex flex-col items-center">
            {/* The diagram sits directly on the page — no card frame, no
                backdrop wash. The animated route lights alone carry the
                "live traffic" feel. */}
            <div className="relative w-full">
              {/* SVG Flow Diagram */}
              <svg
                className="relative z-10 w-full text-[#51617A]"
                viewBox="0 0 800 340"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
              <defs>
                <radialGradient id="flow-blue" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#1a5fb4" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="flow-green" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#2e7d32" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="flow-orange" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#c77800" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="flow-red" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>

                {/* Masks for light trails */}
                <mask id="mask-to-shield">
                  <path d="M 200 120 H 350" stroke="white" strokeWidth="2" />
                </mask>
                <mask id="mask-to-external">
                  <path d="M 450 120 Q 530 120 570 80 T 650 60" stroke="white" strokeWidth="2" />
                </mask>
                <mask id="mask-to-blocked">
                  <path d="M 450 120 Q 530 120 570 160 T 650 180" stroke="white" strokeWidth="2" />
                </mask>
                <mask id="mask-to-internal">
                  <path d="M 200 160 Q 250 200 350 260 T 650 280" stroke="white" strokeWidth="2" />
                </mask>
              </defs>

              {/* Static paths */}
              <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4">
                {/* User to Whiteout AI */}
                <path d="M 200 120 H 350" />
                {/* Whiteout AI to External */}
                <path d="M 450 120 Q 530 120 570 80 T 650 60" />
                {/* Whiteout AI to Blocked */}
                <path d="M 450 120 Q 530 120 570 160 T 650 180" />
                {/* User directly to Internal AI (bypass) */}
                <path d="M 200 160 Q 250 200 350 260 T 650 280" />
              </g>

              {/* Animated light: User → Whiteout AI */}
              <g mask="url(#mask-to-shield)">
                <circle r="20" fill="url(#flow-blue)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 200 120 H 350" />
                </circle>
              </g>

              {/* Animated light: Whiteout AI → External */}
              <g mask="url(#mask-to-external)">
                <circle r="18" fill="url(#flow-green)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.8s" path="M 450 120 Q 530 120 570 80 T 650 60" />
                </circle>
              </g>

              {/* Animated light: Whiteout AI → Blocked */}
              <g mask="url(#mask-to-blocked)">
                <circle r="18" fill="url(#flow-red)">
                  <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.4s" path="M 450 120 Q 530 120 570 160 T 650 180" />
                </circle>
              </g>

              {/* Animated light: User → Internal AI (direct) */}
              <g mask="url(#mask-to-internal)">
                <circle r="18" fill="url(#flow-orange)">
                  <animateMotion dur="3.5s" repeatCount="indefinite" begin="0.4s" path="M 200 160 Q 250 200 350 260 T 650 280" />
                </circle>
              </g>

              {/* User Node */}
              <g>
                <rect x="80" y="90" width="120" height="60" rx="12" fill="#FFFFFF" stroke="currentColor" strokeWidth="0.8" />
                <svg x="110" y="100" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#51617A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <text x="132" y="113" fill="#0F1B2D" fontSize="13" fontWeight="600">User</text>
                <text x="96" y="135" fill="#51617A" fontSize="9">AI prompt submitted</text>
              </g>

              {/* Whiteout AI Node — with logo */}
              <g>
                <rect x="350" y="80" width="100" height="80" rx="14" fill="#FFFFFF" stroke="#1a5fb4" strokeWidth="1" />
                {/* Logo image */}
                <SpinningMarkSvg x={388} y={86} size={24} />
                <text x="400" y="128" fill="#0F1B2D" fontSize="11" fontWeight="600" textAnchor="middle">Whiteout AI</text>
                <text x="400" y="143" fill="#51617A" fontSize="8" textAnchor="middle">Policy verification</text>
                {/* Glow */}
                <circle cx="400" cy="120" r="35" fill="url(#flow-orange)" opacity="0.12">
                  <animate attributeName="opacity" values="0.08;0.18;0.08" dur="3s" repeatCount="indefinite" />
                </circle>
              </g>

              {/* External AI Node */}
              <g>
                <rect x="640" y="32" width="130" height="56" rx="10" fill="#FFFFFF" stroke="#2e7d32" strokeWidth="0.8" />
                <circle cx="660" cy="52" r="4" fill="#2e7d32" opacity="0.8" />
                <circle cx="660" cy="52" r="6" fill="none" stroke="#2e7d32" strokeWidth="0.5" opacity="0.4">
                  <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="672" y="50" fill="#0F1B2D" fontSize="11" fontWeight="600">External AI</text>
                <text x="672" y="64" fill="#2E7D32" fontSize="8">Safe · Compliant</text>
              </g>

              {/* Blocked Node */}
              <g>
                <rect x="640" y="152" width="130" height="56" rx="10" fill="#FFFFFF" stroke="#dc2626" strokeWidth="0.8" />
                <circle cx="660" cy="172" r="4" fill="#dc2626" opacity="0.8" />
                <circle cx="660" cy="172" r="6" fill="none" stroke="#dc2626" strokeWidth="0.5" opacity="0.4">
                  <animate attributeName="r" values="6;10;6" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
                <text x="672" y="170" fill="#0F1B2D" fontSize="11" fontWeight="600">Blocked</text>
                <text x="672" y="184" fill="#B3261E" fontSize="8">Policy violation</text>
              </g>

              {/* Internal AI Node */}
              <g>
                <rect x="640" y="252" width="130" height="56" rx="10" fill="#FFFFFF" stroke="#c77800" strokeWidth="0.8" />
                <circle cx="660" cy="272" r="4" fill="#c77800" opacity="0.8" />
                <circle cx="660" cy="272" r="6" fill="none" stroke="#c77800" strokeWidth="0.5" opacity="0.4">
                  <animate attributeName="r" values="6;10;6" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <text x="672" y="270" fill="#0F1B2D" fontSize="11" fontWeight="600">Internal AI</text>
                <text x="672" y="284" fill="#A05F00" fontSize="8">Sensitive · Isolated</text>
              </g>

              {/* Label on the direct path */}
              <text x="340" y="240" fill="#51617A" fontSize="7" fontStyle="italic">data-sensitive prompts</text>
              </svg>
            </div>

            {/* Semantic callout */}
            <div className="mt-10 mb-8 text-center">
              <div className="inline-block bg-white border border-[#0F1B2D]/10 rounded-xl px-8 py-5 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)]">
                <span className="text-lg font-bold text-[#1A5FB4]">
                  No Regex. Pure Semantic.
                </span>
                <p className="text-sm text-[#51617A] mt-2 max-w-lg">
                  Unlike traditional DLP that relies on pattern matching, the Compliance Engine uses AI-powered analysis to understand the meaning and context of every prompt.
                </p>
              </div>
            </div>

            {/* Bottom summary cards */}
            <div className="grid md:grid-cols-3 gap-4 w-full">
              <div className="bg-white rounded-xl border border-[#2E7D32]/25 p-5 shadow-[0_1px_2px_rgba(15,27,45,0.05)]">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32] mr-2" />
                  <h4 className="text-[#2E7D32] font-semibold text-sm">Safe for External</h4>
                </div>
                <ul className="text-[#51617A] text-xs space-y-1.5">
                  <li>No sensitive data detected</li>
                  <li>Complies with all policies</li>
                  <li>Routed through Whiteout AI</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-[#A05F00]/25 p-5 shadow-[0_1px_2px_rgba(15,27,45,0.05)]">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#A05F00] mr-2" />
                  <h4 className="text-[#A05F00] font-semibold text-sm">Internal Only</h4>
                </div>
                <ul className="text-[#51617A] text-xs space-y-1.5">
                  <li>Sensitive data detected</li>
                  <li>Routed directly to internal AI</li>
                  <li>Data never leaves your network</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-[#B3261E]/25 p-5 shadow-[0_1px_2px_rgba(15,27,45,0.05)]">
                <div className="flex items-center mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#B3261E] mr-2" />
                  <h4 className="text-[#B3261E] font-semibold text-sm">Policy Violation</h4>
                </div>
                <ul className="text-[#51617A] text-xs space-y-1.5">
                  <li>Violates company policies</li>
                  <li>Potential security risk</li>
                  <li>Prompt blocked by Whiteout AI</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
