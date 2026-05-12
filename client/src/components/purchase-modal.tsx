import { useState } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { Shield, Lock, CheckCircle, X, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

// Flip to `true` to cut over to direct Stripe checkout.
// While `false`, users submit a request-access form that emails alex@groovysec.com
// and they must accept Terms + Privacy first.
const USE_DIRECT_STRIPE = false;
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/dRneVcenC3qRcE31Cyew800";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  notes: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  notes: "",
  acceptedTerms: false,
  acceptedPrivacy: false,
};

export function PurchaseModal({ onClose }: { onClose: () => void }) {
  if (USE_DIRECT_STRIPE) {
    return <DirectStripeModal onClose={onClose} />;
  }
  return <RequestAccessModal onClose={onClose} />;
}

function RequestAccessModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.acceptedTerms &&
    form.acceptedPrivacy &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/skill-access", form);
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.message?.replace(/^\d+:\s*/, "") ||
          "Something went wrong. Please try again or email support@groovysec.com."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request received</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              Thanks — we'll review your request and reach out from{" "}
              <span className="text-white">alex@groovysec.com</span> with payment
              and repository access instructions shortly.
            </p>
            <button onClick={onClose} className="w-full">
              <GradientButton variant="default" className="w-full py-3 text-sm rounded-xl btn-animate-colors">
                Close
              </GradientButton>
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-8 pt-8 pb-5 border-b border-white/[0.06]">
              <h3 className="text-xl font-bold text-white">Request Access</h3>
              <p className="text-sm text-slate-400 mt-1">
                Groovy Security Skills &middot; Lifetime Access
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    First name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Company <span className="text-slate-600 normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Notes <span className="text-slate-600 normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={2}
                  placeholder="GitHub username, intended use, etc."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-colors resize-none"
                />
              </div>

              {/* Consent */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.acceptedTerms}
                    onChange={(e) => update("acceptedTerms", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] accent-emerald-500 flex-shrink-0"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                    >
                      Terms of Service
                    </a>
                    , including the no-guarantee clause for the Secure AI Skills.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.acceptedPrivacy}
                    onChange={(e) => update("acceptedPrivacy", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] accent-emerald-500 flex-shrink-0"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={!canSubmit} className="w-full disabled:opacity-50 disabled:cursor-not-allowed">
                <GradientButton variant="default" className="w-full py-3.5 text-sm rounded-xl btn-animate-colors">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" /> Request Access
                    </>
                  )}
                </GradientButton>
              </button>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                We'll review your request and email you payment & repo access instructions.
              </p>

              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="text-[11px] text-slate-500 flex items-center">
                  <Shield className="w-3 h-3 mr-1" /> Reviewed by Groovy Security
                </span>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// Legacy direct-to-Stripe flow. Kept for a smooth cutover — set
// USE_DIRECT_STRIPE = true at the top of this file to re-enable.
function DirectStripeModal({ onClose }: { onClose: () => void }) {
  const handlePurchase = () => {
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white">Groovy Security Skills</h3>
            <p className="text-sm text-slate-400">Lifetime Access for AI Agents</p>
          </div>
        </div>

        <div className="px-8 py-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            What's included
          </h4>
          <ul className="space-y-3 mb-6">
            {[
              "111 enterprise-grade security skills",
              "18 categories across security, DevOps, legal, finance & more",
              "OWASP ASI Top 10 audited",
              "All future updates & new skills",
            ].map((item, i) => (
              <li key={i} className="flex items-center text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Lifetime Access</p>
                <p className="text-xs text-slate-500">One-time payment &middot; No subscription</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">$9.99</span>
                <span className="block px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded mt-1">
                  LAUNCH PRICE
                </span>
              </div>
            </div>
          </div>

          <button onClick={handlePurchase} className="w-full">
            <GradientButton variant="default" className="w-full py-4 text-base rounded-xl btn-animate-colors">
              <Lock className="w-4 h-4 mr-2" />
              Proceed to Secure Checkout
            </GradientButton>
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-[11px] text-slate-500 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> SSL Encrypted
            </span>
            <span className="text-[11px] text-slate-500 flex items-center">
              <Shield className="w-3 h-3 mr-1" /> Powered by Stripe
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
