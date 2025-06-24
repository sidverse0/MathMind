
'use client';

import { useGame } from '@/hooks/use-game';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, X, Divide, BrainCircuit, Trophy, Timer, CheckCircle, XCircle, Sparkles, Sigma, Percent, FunctionSquare, ArrowRight, Coins, LogOut } from 'lucide-react';
import type { MathCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { FormEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const quickStartCategories: MathCategory[] = ['addition', 'subtraction', 'multiplication', 'mixed'];

const categoryIcons: Record<MathCategory, React.ReactNode> = {
  addition: <Plus className="h-8 w-8" />,
  subtraction: <Minus className="h-8 w-8" />,
  multiplication: <X className="h-8 w-8" />,
  division: <Divide className="h-8 w-8" />,
  mixed: <Sparkles className="h-8 w-8" />,
  algebra: <Sigma className="h-8 w-8" />,
  percentages: <Percent className="h-8 w-8" />,
  exponents: <FunctionSquare className="h-8 w-8" />,
  fractions: <Sigma className="h-8 w-8" />,
  decimals: <Sigma className="h-8 w-8" />,
  ratios: <Sigma className="h-8 w-8" />,
  'square-roots': <Sigma className="h-8 w-8" />,
  'order-of-operations': <Sigma className="h-8 w-8" />,
  'area-of-squares': <Sigma className="h-8 w-8" />,
  'area-of-rectangles': <Sigma className="h-8 w-8" />,
  'area-of-triangles': <Sigma className="h-8 w-8" />,
  circumference: <Sigma className="h-8 w-8" />,
  'pythagorean-theorem': <Sigma className="h-8 w-8" />,
  'linear-equations': <Sigma className="h-8 w-8" />,
  'quadratic-equations': <Sigma className="h-8 w-8" />,
  'prime-numbers': <Sigma className="h-8 w-8" />,
  'factors': <Sigma className="h-8 w-8" />,
  'multiples': <Sigma className="h-8 w-8" />,
  'roman-numerals': <Sigma className="h-8 w-8" />,
  'mean': <Sigma className="h-8 w-8" />,
  'median': <Sigma className="h-8 w-8" />,
  'mode': <Sigma className="h-8 w-8" />,
  'range': <Sigma className="h-8 w-8" />,
  'simple-probability': <Sigma className="h-8 w-8" />,
  'simple-interest': <Sigma className="h-8 w-8" />,
  'discounts': <Sigma className="h-8 w-8" />,
  'unit-conversion': <Sigma className="h-8 w-8" />,
  'time-calculation': <Sigma className="h-8 w-8" />,
  'logic-puzzles': <Sigma className="h-8 w-8" />,
};


export function GameClient() {
  const { state, setCategory, startGame, submitAnswer, resetGame } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') as MathCategory | null;
    if (categoryFromUrl && state.phase === 'config') {
      setCategory(categoryFromUrl);
      startGame();
      router.replace('/app/challenge', { scroll: false });
    }
  }, [searchParams, state.phase, setCategory, startGame, router]);


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
    const phaseVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20, filter: 'blur(5px)' },
        visible: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.9, y: -20, filter: 'blur(5px)', transition: { duration: 0.3, ease: "easeIn" } },
    };

    const numberContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const numberCardVariants = {
        hidden: { rotateY: 90, opacity: 0 },
        visible: { 
            rotateY: 0, 
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 100,
              damping: 15
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
      <div className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden p-4 rounded-b-lg" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
            <motion.div
                key={state.phase}
                variants={phaseVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md mx-auto"
            >
                {state.phase === 'config' && (
                <div className="w-full text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-teal-400">Choose a Challenge</h2>
                    <p className="text-muted-foreground mb-6 text-base">Select a quick start option or browse all categories.</p>
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
                        variants={numberContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {quickStartCategories.map((cat) => (
                            <motion.div key={cat} variants={itemVariants}>
                                <Button
                                    variant={'outline'}
                                    className="h-24 text-sm flex-col gap-2 transition-all duration-300 transform hover:scale-105 hover:bg-primary/10 hover:border-primary w-full shadow-sm hover:shadow-lg border-2"
                                    onClick={() => { setCategory(cat); startGame(); }}
                                >
                                    <div className="text-primary">{categoryIcons[cat]}</div>
                                    <span className="capitalize">{cat}</span>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                    <Link href="/app/challenge/categories" passHref>
                        <Button size="lg" className="w-full text-base md:text-lg py-5 shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
                            Browse All Categories <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
                )}
                {state.phase === 'memorize' && (
                <div className="text-center">
                    <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">Phase 1 of 2</p>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Memorize the numbers</h2>
                    <motion.div 
                        className="my-8 flex justify-center items-center gap-2 sm:gap-3"
                        variants={numberContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {state.currentChallenge?.numbers.map((num, i) => (
                           <motion.div 
                                key={i} 
                                variants={numberCardVariants}
                                className="bg-card/80 shadow-lg rounded-xl p-2 w-16 h-24 sm:w-20 sm:h-28 flex items-center justify-center border"
                            >
                                <span className="text-3xl md:text-4xl font-bold tracking-wider">{num}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                    <Progress value={(state.remainingTime / state.memorizeDuration) * 100} className="h-3 rounded-full" />
                </div>
                )}
                {state.phase === 'solve' && (
                <div className="text-center">
                    <p className="text-xs font-semibold tracking-wider uppercase text-primary mb-2">Phase 2 of 2</p>
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Solve the equation</h2>
                    <div className="text-3xl md:text-5xl font-bold my-6 p-4 bg-background/50 rounded-lg shadow-inner border">
                        {state.currentChallenge?.question}
                    </div>
                    <form onSubmit={handleAnswerSubmit} className="flex gap-2">
                        <Input ref={inputRef} type="text" placeholder="Your answer" className="text-center text-lg md:text-xl h-12 flex-1 shadow-sm" autoFocus />
                        <Button type="submit" size="lg" className="h-12 px-6 text-base shadow-md hover:shadow-lg transition-shadow">Submit</Button>
                    </form>
                    <Progress value={(state.remainingTime / state.solveDuration) * 100} className="mt-4 h-3 rounded-full" />
                </div>
                )}
                {state.phase === 'result' && (
                <div className="text-center flex flex-col items-center justify-center">
                    {state.feedback === 'correct' && (
                        <motion.div initial={{scale:0}} animate={{scale:1, rotate: [0, 10, -10, 0]}} transition={{type: 'spring', stiffness: 260, damping: 20}}>
                            <CheckCircle className="w-20 h-20 text-green-500 mb-3" />
                        </motion.div>
                    )}
                    {state.feedback === 'incorrect' && (
                        <motion.div initial={{scale:0}} animate={{scale:1, x: [0, -10, 10, -10, 10, 0]}} transition={{type: 'spring', stiffness: 400, damping: 10}}>
                            <XCircle className="w-20 h-20 text-destructive mb-3" />
                        </motion.div>
                    )}
                    {state.feedback === 'timeup' && (
                        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring', stiffness: 260, damping: 20}}>
                            <Timer className="w-20 h-20 text-yellow-500 mb-3" />
                        </motion.div>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold capitalize mb-2">
                        {state.feedback === 'timeup' ? "Time's Up!" : (state.feedback === 'correct' ? "Correct!" : "Incorrect")}
                    </h2>
                     {state.feedback === 'correct' && (
                         <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{delay: 0.2}}
                            className="text-lg md:text-xl mt-1 font-semibold text-green-500 flex items-center gap-3"
                        >
                            <span>+ {state.difficulty * 10} Score</span>
                            <span>+ {state.difficulty} <Coins className="inline w-5 h-5 -mt-1"/></span>
                        </motion.p>
                     )}
                     {state.feedback === 'incorrect' && (
                        <p className="text-lg md:text-xl mt-1 text-muted-foreground">Answer: <span className="text-foreground font-bold">{state.currentChallenge?.answer}</span></p>
                    )}
                    <p className="text-sm text-muted-foreground mt-4">Next round starting soon...</p>
                    <Progress value={(state.remainingTime / 2000) * 100} className="mt-3 w-1/2 h-2.5" />
                </div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl bg-card/60 backdrop-blur-xl border-2">
        <CardContent className="p-0">
            <div className="p-3 border-b bg-background/50 flex items-center justify-between gap-x-4">
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                    <h2 className="text-lg font-bold tracking-tight">
                        {state.phase !== 'config' ? (
                            <>Challenge: <span className="text-primary capitalize">{state.category.replace(/-/g, ' ')}</span></>
                        ) : 'MathMind Challenge'}
                    </h2>
                    {state.phase !== 'config' && (
                        <div className="flex items-center flex-wrap justify-center gap-2 text-xs font-medium">
                            <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><Trophy className="w-4 h-4 text-orange-400" /> Score: <span className="font-bold text-sm tabular-nums">{state.score}</span></div>
                            <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><Coins className="w-4 h-4 text-yellow-400" /> Coins: <span className="font-bold text-sm tabular-nums">{state.coins}</span></div>
                            <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><BrainCircuit className="w-4 h-4 text-primary" /> Diff: <span className="font-bold text-sm tabular-nums">{state.difficulty}</span></div>
                        </div>
                    )}
                </div>

                {state.phase !== 'config' && (
                    <Button variant="ghost" size="icon" onClick={resetGame} className="text-muted-foreground hover:text-destructive shrink-0">
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">End Challenge</span>
                    </Button>
                )}
            </div>
            {renderPhase()}
        </CardContent>
    </Card>
  );
}
