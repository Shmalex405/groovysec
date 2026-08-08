import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Menu, X, ChevronDown } from "lucide-react";
import { GroovyLogo } from "./groovy-logo";
import { SpinningMark } from "@/components/ui/spinning-mark";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Single source of truth for the nav — desktop dropdowns and the mobile
// accordion both render from this config so the two can never drift apart.
// ---------------------------------------------------------------------------

type NavLink = {
  label: string;
  href: string;
  /** Hard-navigate via a plain <a> — for targets outside the SPA (e.g. /docs). */
  hardNav?: boolean;
  description?: string;
  /** Render the spinning Groovy mark instead of a flat image. */
  mark?: boolean;
  image?: string;
  imageClass?: string;
  badge?: string;
  hover?: "blue" | "orange" | "emerald";
};

type NavColumn = {
  heading?: string;
  links: NavLink[];
};

type NavMenu = {
  key: string;
  label: string;
  variant: "products" | "columns";
  width: string;
  columns: NavColumn[];
};

const hoverText: Record<NonNullable<NavLink["hover"]>, string> = {
  blue: "group-hover/item:text-[#1A5FB4]",
  orange: "group-hover/item:text-[#A05F00]",
  emerald: "group-hover/item:text-[#2E7D32]",
};

const MENUS: NavMenu[] = [
  {
    key: "products",
    label: "Products",
    variant: "products",
    width: "w-80",
    columns: [
      {
        links: [
          {
            label: "Whiteout AI",
            href: "/",
            description: "AI Interaction Inspection",
            mark: true,
            hover: "blue",
          },
          {
            label: "Maestro",
            href: "/maestro",
            description: "AI-Driven Penetration Testing",
            mark: true,
            imageClass: "grayscale",
            hover: "orange",
          },
          // TEMP: Skills page unpublished 2026-07-16 — restore to relist in Products menu.
          // {
          //   label: "Secure AI Skills",
          //   href: "/skills",
          //   description: "111 Secure AI Skills",
          //   image: "/icon_green.png",
          //   badge: "NEW",
          //   hover: "emerald",
          // },
        ],
      },
    ],
  },
  {
    key: "solutions",
    label: "Solutions",
    variant: "columns",
    width: "w-[44rem]",
    columns: [
      {
        heading: "By Use Case · Whiteout AI",
        links: [
          {
            label: "Government & Public Sector",
            href: "/whiteout-ai/government",
            description: "AI governance for the public sector",
          },
          {
            label: "Academic Integrity",
            href: "/whiteout-ai/academic-integrity",
            description: "AI as a legitimate learning resource",
          },
          {
            label: "Data Loss Prevention",
            href: "/solutions/data-loss-prevention",
            description: "Block sensitive data before it leaks",
          },
          {
            label: "Regulated Industries & Compliance",
            href: "/solutions/compliance",
            description: "HIPAA, GDPR, FERPA, SOX, PCI-DSS",
          },
        ],
      },
      {
        heading: "Offense & Validation · Maestro",
        links: [
          {
            label: "AI Penetration Testing",
            href: "/maestro",
            description: "Validate every finding by real exploitation",
          },
          {
            label: "ASPM Findings Triage",
            href: "/maestro",
            description: "Confirm findings from your existing tools",
          },
          // TEMP: Skills page unpublished 2026-07-16 — restore to relist in Solutions menu.
          // {
          //   label: "Secure AI Skills",
          //   href: "/skills",
          //   description: "111 enterprise-grade security skills",
          // },
        ],
      },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    variant: "columns",
    width: "w-72",
    columns: [
      {
        links: [
          { label: "News & Research", href: "/resources" },
          { label: "Blog", href: "/blog" },
          { label: "Documentation", href: "/docs", hardNav: true },
          { label: "Security Whitepaper", href: "/whiteout-ai/security-whitepaper" },
          { label: "Downloads", href: "/download" },
        ],
      },
    ],
  },
  {
    key: "company",
    label: "Company",
    variant: "columns",
    width: "w-64",
    columns: [
      {
        links: [
          { label: "About", href: "/about" },
          { label: "Partners", href: "/partners" },
          { label: "Contact", href: "/contact" },
          { label: "Trust & Security", href: "/security" },
        ],
      },
    ],
  },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  // Maestro is free to download, so "Request Demo" is the wrong ask on its pages —
  // it routes someone who could just install it into a sales conversation instead.
  // Whiteout still needs the demo, hence per-route rather than a global change.
  const navCta = location.startsWith("/maestro")
    ? { href: "/maestro/install", label: "Get Maestro Free" }
    : { href: "/demo", label: "Request Demo" };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open menu after navigation.
  useEffect(() => {
    setOpenMenu(null);
    setIsMenuOpen(false);
  }, [location]);

  const menuActive = (menu: NavMenu) =>
    menu.columns.some((col) =>
      col.links.some(
        (l) => l.href === location || (l.href !== "/" && location.startsWith(l.href)),
      ),
    );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white border-b border-[#0F1B2D]/10 shadow-[0_1px_2px_rgba(15,27,45,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={navRef}>
        <div className="flex justify-between items-center h-16">
          <GroovyLogo splashDock />

          <div className="hidden md:flex items-center space-x-1">
            {MENUS.map((menu) => (
              <div
                key={menu.key}
                className="relative"
                onMouseEnter={() => setOpenMenu(menu.key)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === menu.key ? null : menu.key)
                  }
                  className={`flex items-center gap-1 px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                    openMenu === menu.key || menuActive(menu)
                      ? "text-[#0F1B2D] bg-[#0F1B2D]/[0.05]"
                      : "text-[#51617A] hover:text-[#0F1B2D] hover:bg-[#0F1B2D]/[0.04]"
                  }`}
                >
                  {menu.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      openMenu === menu.key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openMenu === menu.key && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      // pt-2 (not mt-2) keeps the hover bridge intact so the
                      // panel doesn't close when the cursor crosses the gap.
                      className="absolute top-full left-0 pt-2"
                    >
                      <div
                        className={`${menu.width} bg-white rounded-xl border border-[#0F1B2D]/10 shadow-[0_2px_4px_rgba(15,27,45,0.06),0_16px_40px_rgba(15,27,45,0.12)] overflow-hidden`}
                      >
                        {menu.variant === "products" ? (
                          <div className="p-2">
                            {menu.columns[0].links.map((link) => (
                              <Link
                                key={link.label}
                                href={link.href}
                                className="flex items-start gap-3 px-3 py-3 rounded-md hover:bg-[#0F1B2D]/[0.04] transition-colors group/item"
                              >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {link.mark ? (
                                    <SpinningMark
                                      alt={link.label}
                                      className={`w-7 h-7 ${link.imageClass ?? ""}`}
                                    />
                                  ) : (
                                    <img
                                      src={link.image}
                                      alt={link.label}
                                      className={`w-7 h-7 object-contain ${link.imageClass ?? ""}`}
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-medium text-[#0F1B2D] text-sm transition-colors ${
                                        link.hover ? hoverText[link.hover] : ""
                                      }`}
                                    >
                                      {link.label}
                                    </span>
                                    {link.badge && (
                                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/25 rounded">
                                        {link.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="block text-xs text-[#51617A] mt-0.5">
                                    {link.description}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div
                            className={`p-3 grid gap-x-4 ${
                              menu.columns.length > 1 ? "grid-cols-2" : "grid-cols-1"
                            }`}
                          >
                            {menu.columns.map((col, i) => (
                              <div key={col.heading ?? i}>
                                {col.heading && (
                                  <div className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6E7B8C]">
                                    {col.heading}
                                  </div>
                                )}
                                {col.links.map((link) => {
                                  const LinkComp = (link.hardNav ? "a" : Link) as typeof Link;
                                  return (
                                  <LinkComp
                                    key={`${link.label}-${link.href}`}
                                    href={link.href}
                                    className="block px-3 py-2 rounded-md hover:bg-[#0F1B2D]/[0.04] transition-colors group/item"
                                  >
                                    <span className="block font-medium text-[#0F1B2D] text-sm group-hover/item:text-[#1A5FB4] transition-colors">
                                      {link.label}
                                    </span>
                                    {link.description && (
                                      <span className="block text-xs text-[#51617A] mt-0.5">
                                        {link.description}
                                      </span>
                                    )}
                                  </LinkComp>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="w-px h-6 bg-[#0F1B2D]/10 mx-2" />

            <Link href={navCta.href}>
              <GradientButton variant="blue" className="min-w-0 px-5 py-2 text-sm">
                {navCta.label}
              </GradientButton>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#0F1B2D] hover:bg-[#0F1B2D]/[0.05]"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="bg-white border-t border-[#0F1B2D]/10 rounded-b-xl shadow-[0_16px_40px_rgba(15,27,45,0.12)]">
                <div className="px-4 py-4 space-y-1">
                  {MENUS.map((menu) => (
                    <div key={menu.key}>
                      <button
                        onClick={() =>
                          setOpenMobileMenu(
                            openMobileMenu === menu.key ? null : menu.key,
                          )
                        }
                        className="flex items-center justify-between w-full px-3 py-2.5 text-[#51617A] hover:text-[#0F1B2D] hover:bg-[#0F1B2D]/[0.04] rounded-md transition-colors text-sm font-medium"
                      >
                        {menu.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${
                            openMobileMenu === menu.key ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openMobileMenu === menu.key && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-3 overflow-hidden"
                          >
                            {menu.columns.map((col, i) => (
                              <div key={col.heading ?? i} className="space-y-0.5">
                                {col.heading && (
                                  <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6E7B8C]">
                                    {col.heading}
                                  </div>
                                )}
                                {col.links.map((link) => {
                                  const LinkComp = (link.hardNav ? "a" : Link) as typeof Link;
                                  return (
                                  <LinkComp
                                    key={`${link.label}-${link.href}`}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-[#51617A] hover:text-[#0F1B2D] rounded-md transition-colors text-sm"
                                  >
                                    {link.label}
                                    {link.badge && (
                                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/25 rounded">
                                        {link.badge}
                                      </span>
                                    )}
                                  </LinkComp>
                                  );
                                })}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div className="pt-3 border-t border-[#0F1B2D]/10">
                    <Link href={navCta.href} onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-[#1A5FB4] text-white hover:bg-[#164F96] font-semibold">
                        {navCta.label}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
