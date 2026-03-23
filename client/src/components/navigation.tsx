import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Menu, X, ChevronDown, Shield, Target } from "lucide-react";
import { GroovyLogo } from "./groovy-logo";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
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

  const isActive = (path: string) =>
    location === path
      ? "text-white"
      : "text-slate-400 hover:text-white";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <GroovyLogo />

          <div className="hidden md:flex items-center space-x-1">
            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  location.startsWith("/whiteout-ai") || location === "/maestro"
                    ? "text-white bg-white/[0.06]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Products
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    isProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
                  >
                    <div className="p-2">
                      <Link
                        href="/whiteout-ai"
                        onClick={() => setIsProductsOpen(false)}
                        className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <img src="/icononly_transparent_nobuffer.png" alt="Whiteout AI" className="w-7 h-7 object-contain" />
                        </div>
                        <div>
                          <span className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors">
                            Whiteout AI
                          </span>
                          <span className="block text-xs text-slate-500 mt-0.5">
                            AI Governance Platform
                          </span>
                        </div>
                      </Link>
                      <Link
                        href="/maestro"
                        onClick={() => setIsProductsOpen(false)}
                        className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <img src="/icononly_transparent_nobuffer.png" alt="Maestro" className="w-7 h-7 object-contain grayscale" />
                        </div>
                        <div>
                          <span className="font-medium text-white text-sm group-hover:text-orange-400 transition-colors">
                            Maestro
                          </span>
                          <span className="block text-xs text-slate-500 mt-0.5">
                            AI-Driven Penetration Testing
                          </span>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/about"
              className={`${isActive("/about")} px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:bg-white/[0.04]`}
            >
              About
            </Link>

            <div className="w-px h-6 bg-white/[0.08] mx-2" />

            <Link href="/demo">
              <GradientButton variant="blue" className="min-w-0 px-5 py-2 text-sm rounded-lg btn-animate-colors">
                Request Demo
              </GradientButton>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/[0.06]"
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
              <div className="bg-slate-900/95 backdrop-blur-xl border-t border-white/[0.06] rounded-b-xl">
                <div className="px-4 py-4 space-y-1">
                  <button
                    onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors text-sm font-medium"
                  >
                    Products
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isMobileProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobileProductsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-1 overflow-hidden"
                      >
                        <Link
                          href="/whiteout-ai"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-slate-400 hover:text-blue-400 rounded-lg transition-colors text-sm"
                        >
                          <Shield className="w-4 h-4" />
                          Whiteout AI
                        </Link>
                        <Link
                          href="/maestro"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 text-slate-400 hover:text-orange-400 rounded-lg transition-colors text-sm"
                        >
                          <Target className="w-4 h-4" />
                          Maestro
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors text-sm font-medium"
                  >
                    About
                  </Link>

                  <div className="pt-3 border-t border-white/[0.06]">
                    <Link href="/demo" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 font-semibold">
                        Request Demo
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
