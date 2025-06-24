'use client';

import { useGame } from '@/hooks/use-game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, X, Divide, BrainCircuit, Trophy, Timer, CheckCircle, XCircle, Gamepad2, Sparkles, Coins } from 'lucide-react';
import type { MathCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { FormEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons: Record<MathCategory, React.ReactNode> = {
  addition: <Plus className="h-10 w-10" />,
  subtraction: <Minus className="h-10 w-10" />,
  multiplication: <X className="h-10 w-10" />,
  division: <Divide className="h-10 w-10" />,
  mixed: <Sparkles className="h-10 w-10" />,
};

export function GameClient() {
  const { state, setCategory, startGame, submitAnswer, resetGame } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.phase === 'solve' && inputRef.current) {
        inputRef.current.focus();
    }
  }, [state.phase]);

  const handleAnswerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      submitAnswer(inputRef.current.value);
      if (inputRef.current) inputRef.current.value = '';
    }
  };
  
  const renderPhase = () => {
    const variants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -20 },
    };

    return (
      <div className="relative w-full min-h-[450px] flex items-center justify-center overflow-hidden p-4">
        <AnimatePresence mode="wait">
            <motion.div
                key={state.phase}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.35, type: 'spring' }}
                className="w-full max-w-md mx-auto"
            >
                {state.phase === 'config' && (
                <div className="w-full text-center">
                    <h2 className="text-3xl font-bold mb-2">Choose a Category</h2>
                    <p className="text-muted-foreground mb-8">Select the type of challenge you want to face.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {(Object.keys(categoryIcons) as MathCategory[]).map((cat) => (
                        <Button
                        key={cat}
                        variant={state.category === cat ? 'default' : 'outline'}
                        size="lg"
                        className={cn("h-32 text-lg flex-col gap-2 transition-all duration-300 transform hover:scale-105", state.category === cat ? 'scale-105 border-primary border-4 shadow-lg shadow-primary/20' : 'hover:border-primary/50')}
                        onClick={() => setCategory(cat)}
                        >
                        {categoryIcons[cat]}
                        <span className="capitalize">{cat}</span>
                        </Button>
                    ))}
                    </div>
                    <Button size="lg" onClick={startGame} className="w-full text-xl py-8 shadow-lg shadow-primary/20">
                        <Gamepad2 className="mr-2 h-6 w-6" /> Start Challenge
                    </Button>
                </div>
                )}
                {state.phase === 'memorize' && (
                <div className="text-center">
                    <p className="text-muted-foreground mb-2">Phase 1 of 2</p>
                    <h2 className="text-3xl font-semibold mb-6">Memorize the numbers</h2>
                    <div className="text-7xl font-bold tracking-widest text-primary my-12 bg-secondary/50 p-6 rounded-lg">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {state.currentChallenge?.numbers.join('   ')}
                        </motion.div>
                    </div>
                    <Progress value={(state.remainingTime / state.memorizeDuration) * 100} className="h-3" />
                </div>
                )}
                {state.phase === 'solve' && (
                <div className="text-center">
                    <p className="text-muted-foreground mb-2">Phase 2 of 2</p>
                    <h2 className="text-3xl font-semibold mb-6">Solve the equation</h2>
                    <div className="text-6xl font-bold my-12">
                        {state.currentChallenge?.question}
                    </div>
                    <form onSubmit={handleAnswerSubmit} className="flex gap-2">
                        <Input ref={inputRef} type="number" placeholder="Your answer" className="text-center text-2xl h-16 flex-1" autoFocus />
                        <Button type="submit" size="lg" className="h-16 px-8 text-lg">Submit</Button>
                    </form>
                    <Progress value={(state.remainingTime / state.solveDuration) * 100} className="mt-4 h-3" />
                </div>
                )}
                {state.phase === 'result' && (
                <div className="text-center flex flex-col items-center justify-center">
                    {state.feedback === 'correct' && <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring'}}><CheckCircle className="w-28 h-28 text-green-500 mb-4" /></motion.div>}
                    {state.feedback === 'incorrect' && <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring'}}><XCircle className="w-28 h-28 text-destructive mb-4" /></motion.div>}
                    {state.feedback === 'timeup' && <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring'}}><Timer className="w-28 h-28 text-yellow-500 mb-4" /></motion.div>}
                    <h2 className="text-5xl font-bold capitalize mb-2">
                        {state.feedback === 'timeup' ? "Time's Up!" : (state.feedback === 'correct' ? "Correct!" : "Incorrect")}
                    </h2>
                     {state.feedback === 'incorrect' && (
                        <p className="text-2xl mt-2 text-muted-foreground">The answer was: <span className="text-foreground font-bold">{state.currentChallenge?.answer}</span></p>
                    )}
                    <p className="text-lg text-muted-foreground mt-4">Next round starting soon...</p>
                    <Progress value={(state.remainingTime / 2000) * 100} className="mt-4 w-1/2 h-3" />
                </div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-2xl">
        <CardContent className="p-0">
            <div className="bg-secondary/30 p-4 border-b flex flex-row flex-wrap items-center justify-between gap-y-2">
                <h2 className="text-xl font-bold">MathMind Challenge</h2>
                <div className="flex items-center flex-wrap gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-orange-400" /> Score: <span className="font-bold text-base">{state.score}</span></div>
                    <div className="flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-400" /> Coins: <span className="font-bold text-base">{state.coins}</span></div>
                    <div className="flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary" /> Difficulty: <span className="font-bold text-base">{state.difficulty}</span></div>
                </div>
            </div>
            {renderPhase()}
            {state.phase !== 'config' && (
                <div className="p-4 border-t">
                    <Button variant="outline" onClick={resetGame} className="w-full">End Challenge & Return to Dashboard</Button>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
