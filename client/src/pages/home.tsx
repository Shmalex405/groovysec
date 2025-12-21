import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { PlatformOverview } from "@/components/platform-overview";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { PolicyWorkflow } from "@/components/policy-workflow";
import { PlatformIntegrations } from "@/components/platform-integrations";
import { SecurityCompliance } from "@/components/security-compliance";
import { LeadCapture } from "@/components/lead-capture";
import { Footer } from "@/components/footer";
import { VideoSection } from "@/components/video-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <VideoSection />
      <PlatformOverview />
      <ArchitectureFlow />
      <PolicyWorkflow />
      <PlatformIntegrations />
      <SecurityCompliance />
      <LeadCapture />
      <Footer />
    </div>
  );
}
