import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  PageTransition,
  HeroTextReveal,
  HeroLine,
  ScrollReveal,
  StaggerChildren,
  StaggerItem,
} from "@/components/motion";
import {
  Mail,
  Handshake,
  LifeBuoy,
  MapPin,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { usePageMeta } from "@/lib/use-page-meta";

export default function Contact() {
  usePageMeta(
    "Contact",
    "Get in touch with Groovy Security — sales and demos, partnerships, or product support. Offices in Utah, US and Ireland, EU."
  );

  const channels = [
    {
      icon: Mail,
      title: "Sales & Demos",
      description: "Talk to us about Whiteout AI, Maestro, or Secure AI Skills for your organization.",
      email: "alex@groovysec.com",
      color: "blue",
    },
    {
      icon: Handshake,
      title: "Partnerships",
      description: "Reseller, referral, and technology partnerships — let's grow together.",
      email: "partners@groovysec.com",
      color: "orange",
    },
    {
      icon: LifeBuoy,
      title: "Support",
      description: "Product questions, installation help, or security concerns with any Groovy product.",
      email: "support@groovysec.com",
      color: "emerald",
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; link: string }> = {
    blue: { bg: "bg-[#1A5FB4]/10 border-[#1A5FB4]/25", icon: "text-[#1A5FB4]", link: "text-[#1A5FB4] hover:text-[#164F96]" },
    orange: { bg: "bg-[#A05F00]/10 border-[#A05F00]/25", icon: "text-[#A05F00]", link: "text-[#A05F00] hover:text-[#A05F00]/80" },
    emerald: { bg: "bg-[#2E7D32]/10 border-[#2E7D32]/25", icon: "text-[#2E7D32]", link: "text-[#2E7D32] hover:text-[#2E7D32]/80" },
  };

  return (
    <PageTransition>
      <AuroraBackground variant="mixed" className="min-h-screen">
        <Navigation />

        {/* Hero */}
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HeroTextReveal>
              <HeroLine>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-[#0F1B2D]">
                  Let's Talk Security
                </h1>
              </HeroLine>
              <HeroLine>
                <p className="text-lg text-[#51617A] max-w-2xl mx-auto leading-relaxed">
                  Whether you're evaluating AI governance, planning a penetration
                  test, or exploring a partnership — we'd love to hear from you.
                </p>
              </HeroLine>
            </HeroTextReveal>
          </div>
        </section>

        {/* Contact channels */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerChildren className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {channels.map((channel) => {
                const Icon = channel.icon;
                const colors = colorMap[channel.color];
                return (
                  <StaggerItem key={channel.title}>
                    <div className="h-full p-8 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] text-center hover:border-[#0F1B2D]/20 hover:shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.10)] transition-all duration-300">
                      <div className={`w-12 h-12 ${colors.bg} border rounded-xl flex items-center justify-center mx-auto mb-5`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <h3 className="text-lg font-bold text-[#0F1B2D] mb-2">{channel.title}</h3>
                      <p className="text-sm text-[#51617A] mb-5 leading-relaxed">{channel.description}</p>
                      <a
                        href={`mailto:${channel.email}`}
                        className={`text-sm font-medium ${colors.link} transition-colors`}
                      >
                        {channel.email}
                      </a>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          </div>
        </section>

        {/* Offices */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-4 tracking-tight">
                  Where We Are
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                { region: "United States", location: "Utah" },
                { region: "European Union", location: "Ireland" },
              ].map((office) => (
                <div
                  key={office.region}
                  className="p-6 bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.05),0_12px_32px_rgba(15,27,45,0.07)] text-center"
                >
                  <MapPin className="w-5 h-5 text-[#1A5FB4] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#0F1B2D]">{office.location}</h3>
                  <p className="text-sm text-[#6E7B8C]">{office.region}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1B2D] mb-6 tracking-tight">
                Prefer to See It First?
              </h2>
              <p className="text-lg text-[#51617A] mb-10 max-w-xl mx-auto">
                Skip the email thread — book a live demo and we'll walk you
                through the products on a call.
              </p>
              <Link href="/demo">
                <GradientButton variant="blue">
                  <Calendar className="w-4 h-4 mr-2" />
                  Request a Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </GradientButton>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </AuroraBackground>
    </PageTransition>
  );
}
