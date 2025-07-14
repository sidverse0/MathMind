'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, ArrowLeft, Zap, Trophy, BarChart, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const featureCards = [
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: "Adaptive Challenges",
        description: "Our AI adjusts the difficulty based on your performance, keeping you engaged and always learning."
    },
    {
        icon: <Trophy className="h-8 w-8 text-primary" />,
        title: "Compete & Conquer",
        description: "Climb the leaderboards, earn achievements, and see how you stack up against other MathMinds."
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

export default function AboutPage() {
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
            <Link href="/" passHref>
                <Button variant="ghost">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-24">
          <div className="container px-4 text-center">
            <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-teal-500"
            >
                Features of MathMind
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-muted-foreground"
            >
                Discover the magic behind our app. We've packed MathMind with features to make learning math fun, engaging, and effective for everyone.
            </motion.p>
          </div>
        </section>

        <section className="pb-20 md:pb-24">
            <div className="container px-4">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                >
                    {featureCards.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="h-full bg-card hover:border-primary/50 shadow-md hover:shadow-xl transition-all duration-300 text-left">
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
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
      </main>
      
      <footer className="border-t bg-background">
        <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground text-center">© {new Date().getFullYear()} MathMind. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <Link href="#" target="_blank" rel="noopener noreferrer" className="group">
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
                  SidVerse
                  <Heart className="h-4 w-4 text-primary transition-transform group-hover:scale-125 group-hover:fill-primary" />
                  </a>
              </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
