'use client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { BrainCircuit, ArrowRight, Zap, Trophy, BarChart, Instagram, Youtube, Wand2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const featureCards = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: "Adaptive Challenges",
        description: "Our AI adjusts the difficulty based on your performance, keeping you engaged and always learning."
    },
    {
        icon: <Trophy className="h-8 w-8 text-primary" />,
        title: "Compete & Conquer",
        description: "Climb the leaderboards, earn achievements, and see how you stack up against other MathMagicians."
    },
    {
        icon: <BarChart className="h-8 w-8 text-primary" />,
        title: "Track Your Progress",
        description: "Detailed stats and beautiful charts help you visualize your improvement over time."
    },
    {
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
        title: "Diverse Categories",
        description: "From basic arithmetic to advanced algebra, there's always a new challenge waiting for you."
    }
];

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

const Scroller = ({ children }: { children: React.ReactNode }) => (
    <div className="scroller w-max">
        <div className="flex gap-4 animate-scroll group-hover:pause">
            {children}
            {children}
        </div>
    </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-16 flex items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="mr-auto flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight font-headline">
              MathMagix
            </h1>
          </Link>
          <div className="flex items-center space-x-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Us
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <Instagram />
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                <TelegramIcon />
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                <WhatsAppIcon />
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="rounded-full">
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
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
                           <Wand2 className="h-16 w-16 md:h-20 md:w-20 text-primary" />
                        </motion.div>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-teal-500">
                        Turning Math into Magic!
                    </h2>
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="max-w-2xl text-base md:text-lg text-muted-foreground"
                >
                    Engage in fun, adaptive math challenges designed to sharpen your memory and calculation skills. Rise through the ranks and become a MathMagician!
                </motion.p>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link href="/app">
                        <Button size="lg" className="text-lg shadow-lg shadow-primary/30">
                            Start Your Journey <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
        
        <section className="py-12 md:py-16 bg-secondary/30 w-full overflow-hidden">
            <div className="relative group">
                <Scroller>
                    {featureCards.map((feature, index) => (
                        <Card key={index} className="w-[350px] flex-shrink-0 bg-card hover:border-primary/50 shadow-md hover:shadow-xl transition-all duration-300">
                            <CardHeader className="flex flex-row items-center gap-4 p-6">
                                <div className="p-3 bg-primary/10 rounded-full ring-4 ring-primary/5">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </Scroller>
            </div>
        </section>

        <section className="py-20 md:py-32">
            <div className="container text-center px-4">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Become a MathMagician?</h3>
                <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
                    Join thousands of users sharpening their skills. It's free to get started!
                </p>
                <div className="mt-8">
                    <Link href="/app">
                        <Button size="lg" className="text-lg shadow-lg shadow-primary/30">
                            Let's Go! <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t bg-background">
            <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
                <p className="text-sm text-muted-foreground text-center sm:text-left">© {new Date().getFullYear()} MathMagix. Built by Sid.</p>
                <div className="flex items-center gap-4">
                    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-muted-foreground hover:text-primary transition-colors">
                        <TelegramIcon />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted-foreground hover:text-primary transition-colors">
                        <WhatsAppIcon />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors">
                        <Youtube />
                    </a>
                </div>
            </div>
      </footer>
    </div>
  );
}
