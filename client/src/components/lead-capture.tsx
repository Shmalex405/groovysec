import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function LeadCapture() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    companySize: "",
    aiUsage: [] as string[],
    useCase: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      aiUsage: checked
        ? [...prev.aiUsage, value]
        : prev.aiUsage.filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/leads", formData);

      if (response.ok) {
        toast({
          title: "Demo Request Submitted",
          description:
            "Redirecting you to schedule your demo...",
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          role: "",
          companySize: "",
          aiUsage: [],
          useCase: "",
        });

        // Delay before redirect to Calendly
        setTimeout(() => {
          const calendlyUrl = `https://calendly.com/sec-groovy/30min?name=${encodeURIComponent(
            `${formData.firstName} ${formData.lastName}`
          )}&email=${encodeURIComponent(formData.email)}`;
          window.open(calendlyUrl, "_blank");
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Ready to Secure Your AI Strategy?
          </h2>
          <p className="text-xl text-slate-600">
            Schedule a personalized demo and see how Whiteout AI can transform your enterprise AI governance.
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-slate-900">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-slate-900">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                  Work Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-sm font-medium text-slate-900">
                  Company *
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="role" className="text-sm font-medium text-slate-900">
                  Your Role *
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cto">CTO</SelectItem>
                    <SelectItem value="ciso">CISO</SelectItem>
                    <SelectItem value="architect">Enterprise Architect</SelectItem>
                    <SelectItem value="security">Security Engineer</SelectItem>
                    <SelectItem value="compliance">Compliance Officer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="companySize" className="text-sm font-medium text-slate-900">
                  Company Size *
                </Label>
                <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1-50 employees</SelectItem>
                    <SelectItem value="50-100">50-100 employees</SelectItem>
                    <SelectItem value="100-500">100-500 employees</SelectItem>
                    <SelectItem value="500-1000">500-1000 employees</SelectItem>
                    <SelectItem value="1000-5000">1,000-5,000 employees</SelectItem>
                    <SelectItem value="5000-10000">5,000-10,000 employees</SelectItem>
                    <SelectItem value="10000+">10,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="useCase" className="text-sm font-medium text-slate-900">
                Primary Use Case
              </Label>
              <Textarea
                id="useCase"
                value={formData.useCase}
                onChange={(e) => handleInputChange("useCase", e.target.value)}
                placeholder="Describe your primary AI use case and security concerns..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold transition-all transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Demo
                  </>
                )}
              </Button>
              <p className="text-sm text-slate-600 mt-4">
                By submitting, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}