
'use client';

import { BottomNav } from '@/components/bottom-nav';
import { useUser } from '@/contexts/user-context';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DottedSpinner = ({ className }: { className?: string }) => {
    const dots = Array.from({ length: 8 });
    return (
        <motion.div
            className={className}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
            {dots.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-full h-full"
                    style={{ transform: `rotate(${i * 45}deg)` }}
                >
                    <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * (1.5 / dots.length),
                            ease: 'easeInOut'
                        }}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-6"
        >
            <div className="relative w-36 h-36">
                <DottedSpinner className="absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    >
                        <Image
                            src="https://files.catbox.moe/35yrt5.png"
                            alt="Loading Icon"
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-primary/50 shadow-lg"
                        />
                    </motion.div>
                </div>
            </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Securing your session...</h2>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.3 }}
        className="flex-1 container pt-6 md:pt-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8"
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}
