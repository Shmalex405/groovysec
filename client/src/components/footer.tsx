import React from "react";

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const footerLinks: Record<string, LinkItem[]> = {
  Product: [
    { label: "Platform Overview", href: "#" },
    { label: "Security Features", href: "#" },
    { label: "Integrations", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "/Documentation_GroovySec.com.pdf", external: true },
    { label: "Security Whitepaper", href: "#" },
    { label: "Compliance Guide", href: "#" },
    { label: "Support", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Removed GroovyLogo */}
          <div>
            <p className="text-slate-300 text-sm mt-4">
              Enterprise AI governance platform for complete security, compliance, and control.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2025 Groovy Security. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}