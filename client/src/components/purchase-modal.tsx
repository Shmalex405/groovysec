import { GradientButton } from "@/components/ui/gradient-button";
import { Shield, Lock, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/dRneVcenC3qRcE31Cyew800";

export function PurchaseModal({ onClose }: { onClose: () => void }) {
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white">Groovy Security Skills</h3>
            <p className="text-sm text-slate-400">Lifetime Access for AI Agents</p>
          </div>
        </div>

        {/* What's included */}
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
