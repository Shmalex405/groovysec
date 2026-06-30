import { useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ReviewForm } from "@/components/review-form";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { PageTransition, ScrollReveal } from "@/components/motion";
import { usePageMeta } from "@/lib/use-page-meta";
import { Quote } from "lucide-react";

export default function Review() {
  usePageMeta(
    "Leave a Review",
    "Share your experience with Groovy Security. Your review helps other security and compliance teams evaluate Whiteout AI, Maestro, and our Secure AI Skills."
  );

  // Unlisted collection page — keep it out of search results for crawlers
  // that execute JS. It is also absent from the sitemap and pre-rendered meta.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen bg-slate-950">
        <Navigation />

        <section className="pt-32 pb-4">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="w-12 h-12 mx-auto mb-6 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Quote className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Share Your Experience
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                If Groovy Security has helped your team secure or test your AI,
                we'd love to hear about it. It takes a couple of minutes, and your
                review helps other security and compliance teams know what to expect.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <ScrollReveal>
          <ReviewForm />
        </ScrollReveal>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
