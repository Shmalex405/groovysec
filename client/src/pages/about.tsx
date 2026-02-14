import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lightbulb } from "lucide-react";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";

export default function About() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Built by{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    Security Professionals
                  </span>
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Groovy Security was founded to close the critical gaps in AI governance
                  and security testing — building enterprise-grade products that
                  organizations can trust.
                </p>
              </HeroLine>
            </HeroTextReveal>
          </div>
        </section>

        {/* Founders */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Founders</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  The leadership team behind Groovy Security's mission.
                </p>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Alex Flowers */}
              <StaggerItem>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                  <img
                    src="/alex-flowers.jpeg"
                    alt="Alex Flowers"
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-blue-100"
                  />
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Alex Flowers</h3>
                  <p className="text-blue-600 font-medium mb-4">CEO & Founder</p>
                  <p className="text-slate-600 leading-relaxed">
                    Cybersecurity professional who founded Groovy Security in March
                    2025, driven by firsthand experience with the industry's critical AI
                    security gaps and a vision to become a leader in AI governance and
                    broader cybersecurity innovation.
                  </p>
                </div>
              </StaggerItem>

              {/* Joel Flowers */}
              <StaggerItem>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                  <img
                    src="/joel-flowers.png"
                    alt="Joel Flowers"
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-green-100"
                  />
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Joel Flowers</h3>
                  <p className="text-green-600 font-medium mb-4">COO</p>
                  <p className="text-slate-600 leading-relaxed">
                    Master's in Information Security with over 25 years of business
                    administration and teaching experience, bringing deep operational
                    expertise to Groovy Security's mission.
                  </p>
                </div>
              </StaggerItem>
              {/* Hanna Savchuk */}
              <StaggerItem>
                <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                  <img
                    src="/hanna-savchuk.jpeg"
                    alt="Hanna Savchuk"
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-6 border-4 border-orange-100" style={{ objectPosition: "50% 25%" }}
                  />
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Hanna Savchuk</h3>
                  <p className="text-orange-600 font-medium mb-4">CMO</p>
                  <p className="text-slate-600 leading-relaxed">
                    Marketing and communications professional with a strong background in
                    brand strategy, digital marketing, and go-to-market execution. Brings
                    a data-driven approach to building Groovy Security's market presence
                    and driving growth across enterprise cybersecurity audiences.
                  </p>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerChildren className="grid md:grid-cols-2 gap-12">
              <StaggerItem>
                <div className="p-8 bg-white rounded-2xl border border-slate-200">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed">
                    To give every organization the tools to adopt AI safely and test their
                    defenses continuously — without compromising on security, compliance,
                    or operational speed.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-8 bg-white rounded-2xl border border-slate-200">
                  <div className="w-14 h-14 bg-green-600/10 rounded-full flex items-center justify-center mb-6">
                    <Lightbulb className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed">
                    A world where organizations can fully leverage AI's potential without
                    risking data exposure, regulatory violations, or security breaches —
                    where security enables innovation instead of blocking it.
                  </p>
                </div>
              </StaggerItem>
            </StaggerChildren>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-white mb-6">
                See What We're Building
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Explore our products and see how Groovy Security is shaping the future
                of AI governance and automated security testing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/whiteout-ai">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    Whiteout AI <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/maestro">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-[#F08C00] hover:bg-white/10 hover:text-white px-8 py-4 text-lg font-semibold"
                  >
                    Maestro <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
