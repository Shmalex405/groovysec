import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { PlatformOverview } from "@/components/platform-overview";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { PolicyWorkflow } from "@/components/policy-workflow";
import { PlatformIntegrations } from "@/components/platform-integrations";
import { SecurityCompliance } from "@/components/security-compliance";
import { Footer } from "@/components/footer";
import { VideoSection } from "@/components/video-section";
import { ArrowRight, Building2, GraduationCap, BookOpen } from "lucide-react";
import {
  PageTransition,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export default function WhiteoutAI() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <VideoSection />
        <PlatformOverview />
        <ArchitectureFlow />
        <PolicyWorkflow />
        <PlatformIntegrations />
        <SecurityCompliance />

        {/* Learn More Links */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Learn More</h2>
                <p className="text-lg text-slate-600">
                  Explore how Whiteout AI serves specific industries and use cases.
                </p>
              </div>
            </ScrollReveal>
            <StaggerChildren className="grid md:grid-cols-3 gap-6">
              <StaggerItem>
                <Link href="/whiteout-ai/government">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Government & Public Sector</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      AI governance built for the compliance and transparency demands of the public sector.
                    </p>
                    <span className="text-blue-600 font-medium text-sm flex items-center">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/whiteout-ai/academic-integrity">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center mb-4">
                      <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Academic Integrity</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Uphold academic standards while enabling AI as a legitimate learning resource.
                    </p>
                    <span className="text-green-600 font-medium text-sm flex items-center">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
              <StaggerItem>
                <Link href="/whiteout-ai/security-whitepaper">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="w-12 h-12 bg-orange-600/10 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Security Whitepaper</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      A deep dive into Whiteout AI's architecture, compliance, and security design.
                    </p>
                    <span className="text-orange-600 font-medium text-sm flex items-center">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
