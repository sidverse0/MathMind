'use client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowRight, BrainCircuit, MessageCircle, Loader2, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Instagram, Youtube } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PwaInstallPrompt from '@/components/pwa-install-prompt';

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 2l-7 20-4-9-9-4Z"/><path d="M22 2L11 13"/>
    </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
);

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const handleJourneyClick = () => {
    if (user) {
      router.push('/app');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 flex items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="mr-auto flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight font-headline">
              MathMind
            </h1>
          </Link>
          <div className="flex items-center space-x-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Connect
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="https://www.instagram.com/sidverse.0" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram />
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="https://www.t.me/pvt_s1n" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <TelegramIcon />
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="https://wa.me/918521672813" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                <WhatsAppIcon />
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="https://www.youtube.com/@shaitaanidastaan" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <Youtube />
                            </a>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
            <div className="container text-center flex flex-col items-center gap-6 px-4">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                >
                    <div className="p-4 bg-primary/10 rounded-full inline-block ring-8 ring-primary/5">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                           <BrainCircuit className="h-16 w-16 md:h-20 md:w-20 text-primary" />
                        </motion.div>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col items-center gap-2"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-teal-500">
                        MathMind
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium">
                        Turning Math into Magic!
                    </p>
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-2xl text-base md:text-lg text-muted-foreground"
                >
                    Engage in fun, Adaptive Math Challenges designed to sharpen your memory and calculation skills.
                </motion.p>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Button size="lg" className="text-lg shadow-lg shadow-primary/30 min-w-[240px]" onClick={handleJourneyClick} disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                {user ? "Go to Dashboard" : "Start Your Journey"}
                                <ArrowRight className="ml-2" />
                            </>
                        )}
                    </Button>
                    <Link href="/about">
                        <Button size="lg" variant="outline" className="text-lg">
                            Learn More
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container py-6">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-3"
            >
              <Link href="https://www.instagram.com/reyaz_sid/" target="_blank" rel="noopener noreferrer" className="group">
                  <div className="relative w-10 h-10">
                      <Image 
                          src="https://files.catbox.moe/ckpfrf.png" 
                          alt="Owner" 
                          fill 
                          className="rounded-full object-cover border-2 border-primary/50 shadow-md transition-transform group-hover:scale-105"
                      />
                  </div>
              </Link>
              <p className="text-sm text-muted-foreground">
                  Credit | {' '}
                  <a 
                  href="https://portfolioxsid.vercel.app/"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-teal-500 hover:opacity-80 transition-opacity inline-flex items-center gap-1 group"
                  >
                  SidVerse.
                  <Heart className="h-4 w-4 text-primary transition-transform group-hover:scale-125 group-hover:fill-primary" />
                  </a>
              </p>
            </motion.div>
        </div>
      </footer>
      <PwaInstallPrompt />
    </div>
  );
}
