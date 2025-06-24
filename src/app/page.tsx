import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container text-center flex flex-col items-center gap-6">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Train Your Brain, <span className="text-primary">Master the Numbers</span>.
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Engage in fun, adaptive math challenges designed to sharpen your memory and calculation skills. Rise through the ranks and become a MathMind!
          </p>
          <Link href="/app">
            <Button size="lg" className="text-lg animate-pulse">
                Get Started for Free <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
