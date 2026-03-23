import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LeadCapture } from "@/components/lead-capture";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PageTransition, ScrollReveal } from "@/components/motion";

export default function Demo() {
  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="pt-16">
          <ScrollReveal>
            <LeadCapture />
          </ScrollReveal>
        </div>
        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
