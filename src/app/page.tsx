import { GameClient } from '@/components/game-client';
import { ThemeToggle } from '@/components/theme-toggle';
import { BrainCircuit } from 'lucide-react';

export default function Home() {
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
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 container">
        <GameClient />
      </main>
    </div>
  );
}
