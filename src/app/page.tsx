'use client';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { BrainCircuit, ArrowRight, Zap, Trophy, BarChart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const featureCards = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: "Adaptive Challenges",
        description: "Our AI adjusts the difficulty based on your performance, keeping you engaged and learning."
    },
    {
        icon: <Trophy className="h-8 w-8 text-primary" />,
        title: "Compete & Conquer",
        description: "Climb the leaderboards and see how you stack up against other MathMinds."
    },
    {
        icon: <BarChart className="h-8 w-8 text-primary" />,
        title: "Track Your Progress",
        description: "Detailed stats and charts help you visualize your improvement over time."
    }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center">
          <div className="mr-4 flex items-center">
            <BrainCircuit className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold tracking-tight font-headline">
              MathMind
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Link href="/app">
              <Button variant="ghost">Sign In</Button>
            </Link>
             <Link href="/app">
                <Button>Get Started</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
            <div className="container text-center flex flex-col items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-teal-500">
                        Train Your Brain, Master Numbers.
                    </h2>
                </motion.div>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-2xl text-lg text-muted-foreground"
                >
                    Engage in fun, adaptive math challenges designed to sharpen your memory and calculation skills. Rise through the ranks and become a MathMind!
                </motion.p>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link href="/app">
                        <Button size="lg" className="text-lg animate-pulse shadow-lg shadow-primary/30">
                            Get Started for Free <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
        
        <section className="container py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
                        <Image src="https://placehold.co/600x400.png" alt="Math Game" layout="fill" objectFit="cover" data-ai-hint="abstract brain"/>
                    </div>
                </motion.div>
                <div className="grid gap-6">
                    {featureCards.map((feature, index) => (
                         <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        >
                            <Card className="bg-secondary/30 border-0">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {feature.icon}
                                    <div>
                                        <CardTitle>{feature.title}</CardTitle>
                                        <p className="text-muted-foreground text-sm mt-1">{feature.description}</p>
                                    </div>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
