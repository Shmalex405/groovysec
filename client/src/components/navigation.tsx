import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { GroovyLogo } from "./groovy-logo";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <GroovyLogo />
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('platform')}
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Platform
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('integrations')}
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Integrations
            </button>
            <button 
              onClick={() => scrollToSection('security')}
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Security
            </button>
            <Button 
              onClick={() => scrollToSection('demo')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Request Demo
            </Button>
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
              <button 
                onClick={() => scrollToSection('platform')}
                className="block w-full text-left px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                Platform
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('integrations')}
                className="block w-full text-left px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                Integrations
              </button>
              <button 
                onClick={() => scrollToSection('security')}
                className="block w-full text-left px-3 py-2 text-slate-600 hover:text-blue-600 transition-colors"
              >
                Security
              </button>
              <Button 
                onClick={() => scrollToSection('demo')}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Request Demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
