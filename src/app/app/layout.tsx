'use client';

import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { BrainCircuit, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2.5,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <BrainCircuit className="h-20 w-20 text-primary" />
          </motion.div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Loading your session...</h2>
            <p className="text-muted-foreground">Getting your math challenges ready!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/app" className='flex items-center gap-2 mr-auto'>
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight font-headline">
              MathMind
            </h1>
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserNav />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/app/menu">
                <MoreVertical />
                <span className="sr-only">Menu</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.3 }}
        className="flex-1 container py-6 md:py-8 px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
