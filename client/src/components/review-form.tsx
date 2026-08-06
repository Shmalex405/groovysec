import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { CheckCircle, ChevronDown, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const MIN_CHARS = 75;
const MAX_CHARS = 1500;

const EXPERIENCE_OPTIONS = [
  "Saw a live demo or walkthrough",
  "Ran a proof-of-concept or trial",
  "Deployed it in our environment",
  "Use it regularly",
  "Evaluated it against other tools",
  "Worked directly with the Groovy Security team",
];

const initialForm = {
  name: "",
  jobTitle: "",
  company: "",
  email: "",
  review: "",
  website: "", // honeypot — must stay empty
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function ReviewForm() {
  const [formData, setFormData] = useState(initialForm);
  const [experience, setExperience] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const reviewLen = formData.review.trim().length;
  const meetsMin = reviewLen >= MIN_CHARS;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleExperience = (option: string) => {
    setExperience((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.jobTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please add your name and job title.",
        variant: "destructive",
      });
      return;
    }
    if (!isEmail(formData.email.trim())) {
      toast({
        title: "Check your email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (!meetsMin) {
      toast({
        title: "A little more detail",
        description: `Please write at least ${MIN_CHARS} characters so your review is useful.`,
        variant: "destructive",
      });
      return;
    }
    if (!consent) {
      toast({
        title: "One more step",
        description: "Please accept the review terms so we can use your review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/reviews", {
        ...formData,
        company: formData.company.trim() || undefined,
        experience,
        consent,
      });

      if (!res.ok) {
        throw new Error("The server couldn't process your review. Please try again.");
      }

      setSubmitted(true);
      setFormData(initialForm);
      setExperience([]);
      setConsent(false);
    } catch (err: any) {
      const message =
        typeof err?.message === "string" ? err.message : "Please try again or email us directly.";
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
      console.error("Review submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "bg-white border-[#0F1B2D]/15 text-[#0F1B2D] placeholder:text-[#6E7B8C] focus:border-[#1A5FB4]/50 focus:ring-[#1A5FB4]/20 transition-colors";
  const labelClasses = "text-sm font-medium text-[#0F1B2D]";

  if (submitted) {
    return (
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-10 text-center" hover={false}>
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/25 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#2E7D32]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F1B2D] mb-3 tracking-tight">
              Thank you for your review
            </h2>
            <p className="text-[#51617A] mb-2 max-w-md mx-auto">
              We've received it. Our team reviews each submission before it's used
              publicly — we may reach out to confirm any details.
            </p>
            <p className="text-sm text-[#6E7B8C]">
              Really appreciate you taking the time.
            </p>
          </GlassCard>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-8" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Honeypot — visually hidden, never shown to real users */}
            <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className={labelClasses}>Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`mt-1.5 ${inputClasses}`}
                  required
                />
              </div>
              <div>
                <Label htmlFor="jobTitle" className={labelClasses}>Job Title *</Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  placeholder="e.g. CISO, Security Engineer"
                  className={`mt-1.5 ${inputClasses}`}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company" className={labelClasses}>Company / Organization</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className={`mt-1.5 ${inputClasses}`}
                />
              </div>
              <div>
                <Label htmlFor="email" className={labelClasses}>Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`mt-1.5 ${inputClasses}`}
                  required
                />
                <p className="text-xs text-[#6E7B8C] mt-1.5">
                  Private — used only to verify your review. Never shown publicly.
                </p>
              </div>
            </div>

            {/* Credibility checkboxes */}
            <div>
              <Label className={labelClasses}>
                Your experience with Groovy Security{" "}
                <span className="text-[#6E7B8C] font-normal">(optional — check any that apply)</span>
              </Label>
              <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
                {EXPERIENCE_OPTIONS.map((option) => {
                  const checked = experience.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 rounded-md border px-3.5 py-3 cursor-pointer transition-colors ${
                        checked
                          ? "bg-[#1A5FB4]/10 border-[#1A5FB4]/40"
                          : "bg-white border-[#0F1B2D]/10 hover:border-[#0F1B2D]/20"
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleExperience(option)}
                        className="border-[#0F1B2D]/30 data-[state=checked]:bg-[#1A5FB4] data-[state=checked]:border-[#1A5FB4]"
                      />
                      <span className="text-sm text-[#51617A]">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Review text */}
            <div>
              <Label htmlFor="review" className={labelClasses}>Your Review *</Label>
              <Textarea
                id="review"
                value={formData.review}
                onChange={(e) => handleInputChange("review", e.target.value)}
                placeholder="What problem were you trying to solve, what did you use, and what was the result? Specific details make the most credible reviews."
                className={`mt-1.5 ${inputClasses}`}
                rows={6}
                maxLength={MAX_CHARS}
              />
              <div className="mt-1.5 text-xs">
                <span className={meetsMin ? "text-[#2E7D32]" : "text-[#A05F00]"}>
                  {meetsMin
                    ? "Looks good"
                    : `${Math.max(0, MIN_CHARS - reviewLen)} more characters needed`}
                </span>
              </div>
            </div>

            {/* Marketing-use release (collapsible to save space) */}
            <div>
              <button
                type="button"
                onClick={() => setTermsOpen((o) => !o)}
                aria-expanded={termsOpen}
                aria-controls="review-terms-panel"
                className="flex w-full items-center justify-between rounded-md border border-[#0F1B2D]/10 bg-white px-3.5 py-3 text-left hover:border-[#0F1B2D]/20 transition-colors"
              >
                <span className={labelClasses}>
                  Review terms{" "}
                  <span className="text-[#6E7B8C] font-normal">
                    — how we may use your review
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-[#6E7B8C] transition-transform ${
                    termsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {termsOpen && (
                <div
                  id="review-terms-panel"
                  className="mt-2 max-h-56 overflow-y-auto rounded-md border border-[#0F1B2D]/10 bg-[#0F1B2D]/[0.02] p-4 text-xs leading-relaxed text-[#51617A] space-y-2"
                >
                  <p>
                    By submitting this review, you confirm that it reflects your own
                    genuine, truthful experience.
                  </p>
                  <p>
                    You grant Groovy Security a perpetual, worldwide, royalty-free
                    license to use, reproduce, publish, and display your review —
                    together with your name, job title, and company — across its
                    marketing and promotional materials, including its website,
                    social media, presentations, and sales materials.
                  </p>
                  <p>
                    You agree Groovy Security may lightly edit the review for
                    length, grammar, or clarity without changing its meaning. You
                    confirm you have the authority to provide this review and to
                    reference your employer where applicable. No payment or
                    compensation is provided in exchange for this review.
                  </p>
                  <p>
                    You may ask us to anonymize your review (remove your name,
                    job title, and company) or to stop using it entirely at any
                    time by emailing{" "}
                    <span className="text-[#0F1B2D]">alex@groovysec.com</span>, and
                    we will honor that request going forward, although copies
                    already distributed may remain in circulation.
                  </p>
                </div>
              )}

              <label className="mt-3 flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5 border-[#0F1B2D]/30 data-[state=checked]:bg-[#1A5FB4] data-[state=checked]:border-[#1A5FB4]"
                />
                <span className="text-sm text-[#51617A]">
                  I have read and accept the review terms — including that my name,
                  job title, and company may be used publicly — and I confirm this
                  review reflects my genuine experience. *
                </span>
              </label>
            </div>

            <div className="text-center pt-1">
              <GradientButton
                type="submit"
                variant="blue"
                disabled={isSubmitting || !meetsMin || !consent}
                className="px-12"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </GradientButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}
