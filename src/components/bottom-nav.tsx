
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart, Store, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/user-context';

const navItems = [
  { href: '/app', label: 'Home', icon: Home },
  { href: '/app/progress', label: 'Progress', icon: BarChart },
  { href: '/app/shop', label: 'Shop', icon: Store },
  { href: '/app/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { userData } = useUser();

  if (!userData) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border/40 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/app' && pathname === '/app/dashboard');
          return (
            <Link 
              href={item.href} 
              key={item.href}
              className="flex flex-col items-center justify-center text-center w-full h-full text-muted-foreground hover:text-primary transition-colors relative"
            >
              <item.icon className={cn("h-6 w-6 transition-all", isActive ? "text-primary -translate-y-1 scale-110" : "")} />
              <span className={cn(
                  "text-xs font-medium transition-all",
                  isActive ? "text-primary font-bold" : ""
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute bottom-0 h-1 w-8 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
