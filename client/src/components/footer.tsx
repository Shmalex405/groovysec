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
    { label: "Secure AI Skills", href: "/skills" },
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
    { label: "Partners", href: "/partners" },
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
            <div className="flex items-center gap-4">
<a
                href="https://bsky.app/profile/groovysecurity.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors duration-300"
                aria-label="Bluesky"
              >
                <svg width="20" height="18" viewBox="0 0 600 530" fill="currentColor">
                  <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.72 40.255-67.24 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/groovy-security/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </ScrollReveal>
  );
}
