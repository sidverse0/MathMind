'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BrainCircuit, TrendingUp, Trophy, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/app', label: 'Dashboard', icon: <LayoutDashboard className="h-6 w-6" /> },
  { href: '/app/challenge', label: 'Challenge', icon: <BrainCircuit className="h-6 w-6" /> },
  { href: '/app/progress', label: 'Progress', icon: <TrendingUp className="h-6 w-6" /> },
  { href: '/app/leaderboard', label: 'Leaderboard', icon: <Trophy className="h-6 w-6" /> },
  { href: '/app/shop', label: 'Shop', icon: <Store className="h-6 w-6" /> },
];

export function MainNav() {
  const pathname = usePathname();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {navItems.map((item) => (
        <motion.div key={item.href} variants={itemVariants} whileHover={{scale: 1.03}} whileTap={{scale: 0.98}}>
            <Button
              variant={pathname.startsWith(item.href) && (item.href !== '/app' || pathname === '/app') ? 'default' : 'outline'}
              className="w-full h-16 justify-start text-base p-4 shadow-sm"
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                <span className="ml-4">{item.label}</span>
              </Link>
            </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
