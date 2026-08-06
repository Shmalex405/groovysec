import { useState } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { Shield, Lock, CheckCircle, X, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

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
      <div className="absolute inset-0 bg-[#0F1B2D]/40" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md text-[#51617A] hover:text-[#0F1B2D] hover:bg-[#0F1B2D]/[0.04] transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/25 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#2E7D32]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F1B2D] mb-2">Request received</h3>
            <p className="text-sm text-[#51617A] max-w-sm mx-auto mb-6">
              Thanks — we'll review your request and reach out from{" "}
              <span className="text-[#0F1B2D]">alex@groovysec.com</span> with payment
              and repository access instructions shortly.
            </p>
            <button onClick={onClose} className="w-full">
              <GradientButton variant="default" className="w-full py-3 text-sm">
                Close
              </GradientButton>
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-8 pt-8 pb-5 border-b border-[#0F1B2D]/10">
              <h3 className="text-xl font-bold text-[#0F1B2D]">Request Access</h3>
              <p className="text-sm text-[#51617A] mt-1">
                Groovy Security Skills &middot; Lifetime Access
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7B8C] mb-1.5 block">
                    First name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    required
                    className="w-full bg-white border border-[#0F1B2D]/15 rounded-md px-3 py-2.5 text-sm text-[#0F1B2D] placeholder:text-[#6E7B8C] focus:outline-none focus:border-[#2E7D32]/50 focus:ring-1 focus:ring-[#2E7D32]/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7B8C] mb-1.5 block">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    required
                    className="w-full bg-white border border-[#0F1B2D]/15 rounded-md px-3 py-2.5 text-sm text-[#0F1B2D] placeholder:text-[#6E7B8C] focus:outline-none focus:border-[#2E7D32]/50 focus:ring-1 focus:ring-[#2E7D32]/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7B8C] mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  className="w-full bg-white border border-[#0F1B2D]/15 rounded-md px-3 py-2.5 text-sm text-[#0F1B2D] placeholder:text-[#6E7B8C] focus:outline-none focus:border-[#2E7D32]/50 focus:ring-1 focus:ring-[#2E7D32]/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7B8C] mb-1.5 block">
                  Company <span className="text-[#6E7B8C] normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className="w-full bg-white border border-[#0F1B2D]/15 rounded-md px-3 py-2.5 text-sm text-[#0F1B2D] placeholder:text-[#6E7B8C] focus:outline-none focus:border-[#2E7D32]/50 focus:ring-1 focus:ring-[#2E7D32]/20 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E7B8C] mb-1.5 block">
                  Notes <span className="text-[#6E7B8C] normal-case font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={2}
                  placeholder="GitHub username, intended use, etc."
                  className="w-full bg-white border border-[#0F1B2D]/15 rounded-md px-3 py-2.5 text-sm text-[#0F1B2D] placeholder:text-[#6E7B8C] focus:outline-none focus:border-[#2E7D32]/50 focus:ring-1 focus:ring-[#2E7D32]/20 transition-colors resize-none"
                />
              </div>

              {/* Consent */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.acceptedTerms}
                    onChange={(e) => update("acceptedTerms", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#0F1B2D]/25 bg-white accent-[#2E7D32] flex-shrink-0"
                  />
                  <span className="text-xs text-[#51617A] leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E7D32] hover:text-[#256428] underline underline-offset-2"
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
                    className="mt-0.5 w-4 h-4 rounded border-[#0F1B2D]/25 bg-white accent-[#2E7D32] flex-shrink-0"
                  />
                  <span className="text-xs text-[#51617A] leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E7D32] hover:text-[#256428] underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-[#B3261E]/10 border border-[#B3261E]/25 rounded-md p-3 text-xs text-[#B3261E]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={!canSubmit} className="w-full disabled:opacity-50 disabled:cursor-not-allowed">
                <GradientButton variant="default" className="w-full py-3.5 text-sm">
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

              <p className="text-[11px] text-[#6E7B8C] text-center leading-relaxed">
                We'll review your request and email you payment & repo access instructions.
              </p>

              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="text-[11px] text-[#6E7B8C] flex items-center">
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

