import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PageTransition, ScrollReveal } from "@/components/motion";
import { ArrowRight, Home } from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

export default function NotFound() {
  usePageMeta("Page Not Found");

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        <section className="pt-32 pb-24 min-h-[75vh] flex items-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <ScrollReveal>
              <div className="text-7xl lg:text-8xl font-bold text-gradient-brand animate-gradient-flow mb-6">
                404
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                This Page Doesn't Exist
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">
                The page you're looking for may have moved or never existed.
                Let's get you back on track.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <GradientButton variant="blue">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </GradientButton>
                </Link>
                <Link href="/demo">
                  <GradientButton variant="default">
                    Request a Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GradientButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
