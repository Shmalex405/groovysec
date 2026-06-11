import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Calendar, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const BOOKING_URL = "https://calendar.app.google/YtmkmpRJNZaap1y56";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  role: "",
  companySize: "",
  useCase: "",
};

export function LeadCapture() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ role?: boolean; companySize?: boolean }>({});
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "role" || field === "companySize") {
      setFieldErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = {
      role: !formData.role,
      companySize: !formData.companySize,
    };
    if (errors.role || errors.companySize) {
      setFieldErrors(errors);
      toast({
        title: "Missing Information",
        description: "Please select your role and company size.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest("POST", "/leads", formData);

      if (!res.ok) {
        throw new Error("The server couldn't process your request. Please try again.");
      }

      setSubmitted(true);
      setFormData(initialForm);
    } catch (err: any) {
      const message =
        typeof err?.message === "string" ? err.message : "Please try again or contact us directly.";
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
      console.error("Lead submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-blue-500/40 focus:ring-blue-500/20 transition-colors";
  const labelClasses = "text-sm font-medium text-slate-300";
  const errorClasses = "border-red-500/50";

  if (submitted) {
    return (
      <section id="demo" className="py-24 bg-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-10 text-center" hover={false} glowColor="rgba(16,185,129,0.06)">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
              Demo Request Submitted
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Thanks — we've received your request. Pick a time that works for
              you and we'll take care of the rest.
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex">
              <GradientButton variant="blue">
                <Calendar className="w-4 h-4 mr-2" />
                Book Your Time
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </GradientButton>
            </a>
          </GlassCard>
        </div>
      </section>
    );
  }

  return (
    <section id="demo" className="py-24 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
            Request a Demo
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Schedule a personalized demo and see how Groovy Security's products can help your organization.
          </p>
        </div>

        <GlassCard className="p-8" hover={false} glowColor="rgba(59,130,246,0.04)">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className={labelClasses}>First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`mt-1.5 ${inputClasses}`}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className={labelClasses}>Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`mt-1.5 ${inputClasses}`}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className={labelClasses}>Work Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`mt-1.5 ${inputClasses}`}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company" className={labelClasses}>Company *</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className={`mt-1.5 ${inputClasses}`}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="role" className={labelClasses}>Your Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className={`mt-1.5 ${inputClasses} ${fieldErrors.role ? errorClasses : ""}`}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/[0.08]">
                    <SelectItem value="cto">CTO</SelectItem>
                    <SelectItem value="ciso">CISO</SelectItem>
                    <SelectItem value="architect">Enterprise Architect</SelectItem>
                    <SelectItem value="security">Security Engineer</SelectItem>
                    <SelectItem value="compliance">Compliance Officer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.role && (
                  <p className="text-xs text-red-400 mt-1.5">Please select your role.</p>
                )}
              </div>
              <div>
                <Label htmlFor="companySize" className={labelClasses}>Company Size *</Label>
                <Select
                  value={formData.companySize}
                  onValueChange={(value) => handleInputChange("companySize", value)}
                >
                  <SelectTrigger className={`mt-1.5 ${inputClasses} ${fieldErrors.companySize ? errorClasses : ""}`}>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/[0.08]">
                    <SelectItem value="1-50">1-50 employees</SelectItem>
                    <SelectItem value="50-100">50-100 employees</SelectItem>
                    <SelectItem value="100-500">100-500 employees</SelectItem>
                    <SelectItem value="500-1000">500-1000 employees</SelectItem>
                    <SelectItem value="1000-5000">1,000-5,000 employees</SelectItem>
                    <SelectItem value="5000-10000">5,000-10,000 employees</SelectItem>
                    <SelectItem value="10000+">10,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.companySize && (
                  <p className="text-xs text-red-400 mt-1.5">Please select your company size.</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="useCase" className={labelClasses}>Primary Use Case</Label>
              <Textarea
                id="useCase"
                value={formData.useCase}
                onChange={(e) => handleInputChange("useCase", e.target.value)}
                placeholder="Describe your primary AI use case and security concerns..."
                className={`mt-1.5 ${inputClasses}`}
                rows={3}
              />
            </div>

            <div className="text-center pt-2">
              <GradientButton
                type="submit"
                variant="blue"
                disabled={isSubmitting}
                className="px-12"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Demo
                  </>
                )}
              </GradientButton>
              <p className="text-xs text-slate-600 mt-4">
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}
