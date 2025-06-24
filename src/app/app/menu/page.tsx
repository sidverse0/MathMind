'use client';

import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MenuPage() {
  return (
    <motion.div 
        className="flex flex-col items-center justify-center min-h-full py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-teal-400">Menu</h1>
        <p className="text-muted-foreground mb-8 text-base">Navigate to any section of the app.</p>
        <MainNav />
        <div className="mt-12">
            <Link href="/app">
                <Button variant="outline">
                    <ArrowLeft className="mr-2" />
                    Back to Dashboard
                </Button>
            </Link>
        </div>
      </div>
    </motion.div>
  );
}
