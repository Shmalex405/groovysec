import { Link } from "wouter";
import { ScrollReveal } from "@/components/motion";
import { GroovyLogo } from "./groovy-logo";

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const footerLinks: Record<string, LinkItem[]> = {
  Products: [
    { label: "Whiteout AI", href: "/whiteout-ai" },
    { label: "Maestro", href: "/maestro" },
    { label: "Downloads", href: "/download" },
    { label: "Documentation", href: "/docs", external: false },
  ],
  Resources: [
    { label: "Security Whitepaper", href: "/whiteout-ai/security-whitepaper" },
    { label: "Government & Public Sector", href: "/whiteout-ai/government" },
    { label: "Academic Integrity", href: "/whiteout-ai/academic-integrity" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
};

export function Footer() {
  return (
    <ScrollReveal>
      <footer className="relative bg-slate-950 text-white overflow-hidden">


        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <GroovyLogo />
              <p className="text-slate-500 text-sm leading-relaxed mt-4">
                Securing AI. Automating Security. Enterprise-grade cybersecurity
                products for the AI era.
              </p>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.external !== undefined && link.external === false && link.href.startsWith("/docs") ? (
                        <a
                          href={link.href}
                          className="text-sm text-slate-500 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          <span className="w-0 group-hover:w-2 h-px bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                          {link.label}
                        </a>
                      ) : link.href.startsWith("/") ? (
                        <Link
                          href={link.href}
                          className="text-sm text-slate-500 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          <span className="w-0 group-hover:w-2 h-px bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="text-sm text-slate-500 hover:text-white transition-colors duration-300 flex items-center group"
                        >
                          <span className="w-0 group-hover:w-2 h-px bg-blue-400 mr-0 group-hover:mr-2 transition-all duration-300" />
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">
              &copy; 2026 Groovy Security. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </ScrollReveal>
  );
}
