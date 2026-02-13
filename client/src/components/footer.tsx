import { Link } from "wouter";
import { ScrollReveal } from "@/components/motion";

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const footerLinks: Record<string, LinkItem[]> = {
  Products: [
    { label: "Whiteout AI", href: "/whiteout-ai" },
    { label: "Maestro", href: "/maestro" },
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
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <p className="text-slate-300 text-sm mt-4">
                Securing AI. Automating Security. Enterprise-grade cybersecurity
                products for the AI era.
              </p>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold mb-4">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.external !== undefined && link.external === false && link.href.startsWith("/docs") ? (
                        <a
                          href={link.href}
                          className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : link.href.startsWith("/") ? (
                        <Link
                          href={link.href}
                          className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400 space-y-1">
            <p>&copy; 2026 Groovy Security. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </ScrollReveal>
  );
}
