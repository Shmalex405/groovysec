import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { GroovyLogo } from "./groovy-logo";
import { motion } from "framer-motion";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
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

  const isActive = (path: string) =>
    location === path ? "text-blue-600" : "text-slate-600 hover:text-blue-600";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-white backdrop-blur-md border-b border-blue-300 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <GroovyLogo />

          <div className="hidden md:flex items-center space-x-8">
            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`flex items-center gap-1 transition-colors font-medium ${
                  location.startsWith("/whiteout-ai") || location === "/maestro"
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Products
                <ChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? "rotate-180" : ""}`} />
              </button>

              {isProductsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <Link
                    href="/whiteout-ai"
                    onClick={() => setIsProductsOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <span className="font-medium">Whiteout AI</span>
                    <span className="block text-xs text-slate-500 mt-0.5">AI Governance Platform</span>
                  </Link>
                  <Link
                    href="/maestro"
                    onClick={() => setIsProductsOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <span className="font-medium">Maestro</span>
                    <span className="block text-xs text-slate-500 mt-0.5">AI-Driven Penetration Testing</span>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className={`${isActive("/about")} transition-colors font-medium`}>
              About
            </Link>

            <Link href="/demo">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Request Demo
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Products section */}
              <button
                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Products
                <ChevronDown className={`h-4 w-4 transition-transform ${isMobileProductsOpen ? "rotate-180" : ""}`} />
              </button>
              {isMobileProductsOpen && (
                <div className="pl-6 space-y-1">
                  <Link
                    href="/whiteout-ai"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Whiteout AI
                  </Link>
                  <Link
                    href="/maestro"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Maestro
                  </Link>
                </div>
              )}

              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                About
              </Link>

              <Link href="/demo" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
