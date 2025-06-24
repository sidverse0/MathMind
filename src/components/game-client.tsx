
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useGame } from '@/hooks/use-game';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Minus, X, Divide, Trophy, Timer, CheckCircle, XCircle, Sparkles, Sigma, Percent, FunctionSquare, ArrowRight, Coins, LogOut, BarChart, LayoutGrid } from 'lucide-react';
import type { MathCategory, DifficultyLevel } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

function GameClientContent() {
  const { state, selectCategory, startConfiguredGame, submitAnswer, resetGame, endGame } = useGame();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [numQuestions, setNumQuestions] = useState(10);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') as MathCategory | null;
    if (categoryFromUrl && state.phase === 'config') {
      selectCategory(categoryFromUrl);
      router.replace('/app/challenge', { scroll: false });
    }
  }, [searchParams, state.phase, selectCategory, router]);

  useEffect(() => {
    if (state.phase === 'summary') {
      if (state.history.length === 0) {
        router.push('/app/challenge/categories');
        resetGame();
        return;
      }

      const correct = state.history.filter(h => h.correct).length;
      const incorrect = state.history.filter(h => !h.correct).length;
      const totalAnswered = state.history.length;
      const skipped = state.totalQuestions - totalAnswered;
      const accuracy = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;
      const avgTimeMs = totalAnswered > 0 ? state.history.reduce((acc, h) => acc + h.time, 0) / totalAnswered : 0;
      const avgTime = Math.round((avgTimeMs / 1000) * 10) / 10;

      const params = new URLSearchParams({
        score: String(state.score),
        coins: String(state.coins),
        correct: String(correct),
        incorrect: String(incorrect),
        skipped: String(skipped),
        accuracy: String(accuracy),
        avgTime: String(avgTime),
        totalQuestions: String(state.totalQuestions)
      });
      
      router.push(`/app/challenge/summary?${params.toString()}`);
      resetGame();
    }
  }, [state.phase, state.history, state.score, state.coins, state.totalQuestions, router, resetGame]);

  const handleOptionClick = (option: string) => {
    submitAnswer(option);
  };

  const handleStartChallenge = () => {
    startConfiguredGame({ difficultyLevel: difficulty, totalQuestions: numQuestions });
  };
  
  const renderPhase = () => {
    const phaseVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.95, y: -30, transition: { duration: 0.3, ease: [0.64, 0, 0.78, 0] } },
    };

    const itemContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };
    
    const phaseWrapperClass = "w-full flex-grow flex flex-col items-center justify-center text-center p-4";

    return (
      <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
                key={state.phase}
                variants={phaseVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-4xl mx-auto"
            >
                {state.phase === 'config' && (
                <div className={phaseWrapperClass}>
                    <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-teal-400">Choose a Challenge</h2>
                    <p className="text-muted-foreground mb-8 text-lg">Select a quick start option or browse all categories.</p>
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl mb-8"
                        variants={itemContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {quickStartCategories.map((cat) => (
                            <motion.div key={cat} variants={itemVariants}>
                                <Button
                                    variant={'outline'}
                                    className="h-28 text-base flex-col gap-2 transition-all duration-300 transform hover:-translate-y-2 hover:bg-primary/10 hover:border-primary w-full shadow-lg border-2"
                                    onClick={() => selectCategory(cat)}
                                >
                                    <div className="text-primary">{categoryIcons[cat]}</div>
                                    <span className="capitalize font-semibold">{cat}</span>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                    <Link href="/app/challenge/categories" passHref>
                        <Button size="lg" className="w-full max-w-2xl text-lg py-6 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                            <LayoutGrid className="mr-2 h-5 w-5" />
                            Browse All Categories
                        </Button>
                    </Link>
                </div>
                )}

                {state.phase === 'pre-config' && (
                    <div className={cn(phaseWrapperClass, "gap-8 max-w-2xl mx-auto")}>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="text-3xl md:text-4xl font-bold">Configure Challenge</h2>
                            <p className="text-muted-foreground mt-2 text-lg">Set your preferences and get started.</p>
                        </motion.div>
                        
                        <motion.div className="w-full grid md:grid-cols-2 gap-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                           <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                             <Card className="p-6 text-left shadow-lg">
                                 <CardHeader className="p-0 mb-4">
                                     <CardTitle>Difficulty</CardTitle>
                                     <CardDescription>How tough should the questions be?</CardDescription>
                                 </CardHeader>
                                 <RadioGroup value={difficulty} onValueChange={(val) => setDifficulty(val as DifficultyLevel)} className="gap-3">
                                     <div className="flex items-center space-x-2">
                                         <RadioGroupItem value="easy" id="easy" />
                                         <Label htmlFor="easy" className="text-base font-medium">Easy</Label>
                                     </div>
                                     <div className="flex items-center space-x-2">
                                         <RadioGroupItem value="medium" id="medium" />
                                         <Label htmlFor="medium" className="text-base font-medium">Medium</Label>
                                     </div>
                                     <div className="flex items-center space-x-2">
                                         <RadioGroupItem value="hard" id="hard" />
                                         <Label htmlFor="hard" className="text-base font-medium">Hard</Label>
                                     </div>
                                 </RadioGroup>
                             </Card>
                           </motion.div>
                           
                           <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                             <Card className="p-6 text-left shadow-lg">
                                 <CardHeader className="p-0 mb-4">
                                     <CardTitle>Number of Questions</CardTitle>
                                     <CardDescription>How many questions to solve?</CardDescription>
                                 </CardHeader>
                                 <RadioGroup value={String(numQuestions)} onValueChange={(val) => setNumQuestions(Number(val))} className="gap-3">
                                     {[10, 20, 30, 50].map(num => (
                                         <div key={num} className="flex items-center space-x-2">
                                             <RadioGroupItem value={String(num)} id={`q-${num}`} />
                                             <Label htmlFor={`q-${num}`} className="text-base font-medium">{num} Questions</Label>
                                         </div>
                                     ))}
                                 </RadioGroup>
                             </Card>
                           </motion.div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
                            <Button size="lg" className="w-full max-w-md text-lg shadow-lg" onClick={handleStartChallenge}>
                                Start Challenge
                            </Button>
                        </motion.div>
                    </div>
                )}

                {state.phase === 'memorize' && (
                <div className={phaseWrapperClass}>
                    <p className="text-sm font-semibold tracking-wider uppercase text-primary mb-3">Memorize</p>
                    <h2 className="text-2xl md:text-4xl font-bold mb-6">Memorize the numbers</h2>
                    <motion.div 
                        className="my-8 flex justify-center items-center gap-2 sm:gap-4"
                        variants={itemContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {state.currentChallenge?.numbers.map((num, i) => (
                           <motion.div 
                                key={i} 
                                variants={{
                                    hidden: { rotateY: 90, opacity: 0, scale: 0.9 },
                                    visible: { rotateY: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
                                }}
                                className="bg-card shadow-2xl rounded-2xl p-2 w-20 h-28 sm:w-24 sm:h-32 flex items-center justify-center border-2 border-primary/20"
                            >
                                <span className="text-4xl md:text-5xl font-bold tracking-wider">{num}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                    <Progress value={(state.remainingTime / state.memorizeDuration) * 100} className="h-4 rounded-full max-w-md mx-auto" />
                </div>
                )}
                {state.phase === 'solve' && (
                <div className={phaseWrapperClass}>
                    <p className="text-sm font-semibold tracking-wider uppercase text-primary mb-3">Solve</p>
                    <h2 className="text-2xl md:text-4xl font-bold">What is the answer?</h2>
                    <motion.div 
                        key={state.currentChallenge?.question}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-bold my-6 md:my-8 p-6 bg-gradient-to-br from-primary/10 to-background rounded-2xl text-primary tracking-wider shadow-inner"
                    >
                        {state.currentChallenge?.question}
                    </motion.div>
                     <motion.div 
                        className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl"
                        variants={itemContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {state.currentChallenge?.options.map((option, i) => (
                            <motion.div key={i} variants={itemVariants} whileHover={{scale: 1.05, y: -5}} whileTap={{scale: 0.98}}>
                                <Button
                                    variant="outline"
                                    className="w-full h-24 md:h-28 text-2xl md:text-3xl font-bold shadow-lg hover:shadow-2xl bg-card hover:bg-primary/10 hover:border-primary/80 transition-all duration-200 border-2 rounded-2xl"
                                    onClick={() => handleOptionClick(String(option))}
                                >
                                    {String(option)}
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                    <Progress value={(state.remainingTime / state.solveDuration) * 100} className="mt-8 h-4 rounded-full max-w-md mx-auto" />
                </div>
                )}
                {state.phase === 'result' && (
                <div className={cn(phaseWrapperClass, "gap-3")}>
                    {state.feedback === 'correct' && (
                        <motion.div initial={{scale:0}} animate={{scale:1, rotate: [0, 10, -10, 0]}} transition={{type: 'spring', stiffness: 260, damping: 20}}>
                            <CheckCircle className="w-24 h-24 md:w-32 md:h-32 text-green-500" />
                        </motion.div>
                    )}
                    {state.feedback === 'incorrect' && (
                        <motion.div initial={{scale:0}} animate={{scale:1, x: [0, -10, 10, -10, 10, 0]}} transition={{type: 'spring', stiffness: 400, damping: 10}}>
                            <XCircle className="w-24 h-24 md:w-32 md:h-32 text-destructive" />
                        </motion.div>
                    )}
                    {state.feedback === 'timeup' && (
                        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring', stiffness: 260, damping: 20}}>
                            <Timer className="w-24 h-24 md:w-32 md:h-32 text-yellow-500" />
                        </motion.div>
                    )}
                    <h2 className="text-4xl md:text-5xl font-bold capitalize">
                        {state.feedback === 'timeup' ? "Time's Up!" : (state.feedback === 'correct' ? "Correct!" : "Incorrect")}
                    </h2>
                     {state.feedback === 'correct' && (
                         <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{delay: 0.2}}
                            className="text-xl md:text-2xl font-semibold text-green-500 flex items-center gap-3"
                        >
                            <span>+ {state.difficulty * 10} Score</span>
                            <span>+ {state.difficulty} <Coins className="inline w-6 h-6 -mt-1"/></span>
                        </motion.p>
                     )}
                     {state.feedback === 'incorrect' && (
                        <p className="text-xl md:text-2xl mt-1 text-muted-foreground">Answer: <span className="text-foreground font-bold">{state.currentChallenge?.answer}</span></p>
                    )}
                    <p className="text-base text-muted-foreground mt-4">Next round starting soon...</p>
                    <Progress value={(state.remainingTime / 2000) * 100} className="mt-3 w-1/2 max-w-xs h-3" />
                </div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
        <div className="p-3 flex items-center justify-between gap-x-4">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h2 className="text-lg font-bold tracking-tight">
                    {state.category ? (
                        <>Challenge: <span className="text-primary capitalize">{state.category.replace(/-/g, ' ')}</span></>
                    ) : 'MathMind Challenge'}
                </h2>
                {state.phase !== 'config' && state.phase !== 'pre-config' && state.phase !== 'summary' && (
                    <div className="flex items-center flex-wrap justify-center gap-2 text-xs font-medium">
                        <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><BarChart className="w-3 h-3 text-blue-400" />Question: <span className="font-bold tabular-nums">{state.currentQuestionIndex}/{state.totalQuestions}</span></div>
                        <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><Trophy className="w-3 h-3 text-orange-400" /> <span className="font-bold tabular-nums">{state.score}</span></div>
                        <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><Coins className="w-3 h-3 text-yellow-400" /> <span className="font-bold tabular-nums">{state.coins}</span></div>
                    </div>
                )}
            </div>

            {state.phase !== 'config' && state.phase !== 'pre-config' && state.phase !== 'summary' && (
                <Button variant="ghost" size="icon" onClick={endGame} className="text-muted-foreground hover:text-destructive shrink-0">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">End Challenge</span>
                </Button>
            )}
        </div>
        {renderPhase()}
    </div>
  );
}


export function GameClient() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GameClientContent />
        </Suspense>
    )
}
