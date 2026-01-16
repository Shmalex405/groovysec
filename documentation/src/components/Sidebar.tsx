import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <nav className="h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-4">
      <div className="space-y-6">
        {navigation.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 px-2 text-sm font-semibold text-foreground">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-sidebar',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {isActive && <ChevronRight size={14} className="text-primary" />}
                      <span className={cn(!isActive && 'ml-[22px]')}>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="px-2 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Groovy Security
        </p>
      </div>
    </nav>
  );
}
