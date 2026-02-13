import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LeadCapture } from "@/components/lead-capture";
import { PageTransition, ScrollReveal } from "@/components/motion";

export default function Demo() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-16">
          <ScrollReveal>
            <LeadCapture />
          </ScrollReveal>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
}
