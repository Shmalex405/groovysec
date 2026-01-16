import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, Search, ExternalLink } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Layout({ children, darkMode, setDarkMode }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 p-2 lg:hidden hover:bg-muted rounded-md"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mr-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-groovy-blue to-groovy-green flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">
              Whiteout AI Docs
            </span>
          </Link>

          {/* Search (desktop) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              <Search size={16} />
              <span>Search documentation...</span>
              <kbd className="ml-auto text-xs bg-background px-1.5 py-0.5 rounded border border-border">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search (mobile) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 md:hidden hover:bg-muted rounded-md"
            >
              <Search size={20} />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-muted rounded-md"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Back to main site */}
            <a
              href="https://groovysec.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              groovysec.com
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 pt-14 bg-background border-r border-border transform transition-transform duration-200 lg:translate-x-0 lg:static lg:pt-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Search modal placeholder */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search size={20} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="flex-1 bg-transparent outline-none text-lg"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Start typing to search...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
