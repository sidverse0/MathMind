
'use client';

import { useState, useReducer, useCallback, useEffect, Suspense, useRef } from 'react';
import { useGame } from '@/hooks/use-game';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from "@/components/ui/slider";
import { Plus, Minus, X, Divide, Trophy, Timer, CheckCircle, XCircle, Sparkles, Sigma, Percent, FunctionSquare, ArrowRight, Coins, LogOut, BarChart, LayoutGrid, ArrowLeft, Waves, TrendingUp, Box, Cylinder, MoveHorizontal, ArrowRightLeft, Landmark, Receipt, Combine, Square, RectangleHorizontal, Triangle, Circle, SquareRadical, Braces, Milestone, Anchor, Key, BetweenHorizontalStart, Pilcrow, UnfoldVertical, PercentCircle, Banknote, UtilityPole, Puzzle, Zap, Shield, Eye } from 'lucide-react';
import type { MathCategory, DifficultyLevel, GameState, PowerUpType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { playSound } from '@/lib/audio';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';


const quickStartCategories: MathCategory[] = ['addition', 'subtraction', 'multiplication', 'mixed'];

const INVENTORY_KEY = 'mathmagix_inventory';

const IntersectIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 18h6c4.4 0 8-3.6 8-8v-2"/>
        <path d="M18 6H6c-4.4 0-8 3.6-8 8v2"/>
    </svg>
);

const UnionIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M7 18a5 5 0 0 0 10 0V9a5 5 0 1 0-10 0Z"/>
    </svg>
);

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
  decimals: <Milestone className="h-8 w-8" />,
  ratios: <BetweenHorizontalStart className="h-8 w-8" />,
  'square-roots': <SquareRadical className="h-8 w-8" />,
  'order-of-operations': <Braces className="h-8 w-8" />,
  'area-of-squares': <Square className="h-8 w-8" />,
  'area-of-rectangles': <RectangleHorizontal className="h-8 w-8" />,
  'area-of-triangles': <Triangle className="h-8 w-8" />,
  circumference: <Circle className="h-8 w-8" />,
  'pythagorean-theorem': <Combine className="h-8 w-8" />,
  'linear-equations': <Milestone className="h-8 w-8" />,
  'quadratic-equations': <Sigma className="h-8 w-8" />,
  'prime-numbers': <Anchor className="h-8 w-8" />,
  'factors': <Key className="h-8 w-8" />,
  'multiples': <Pilcrow className="h-8 w-8" />,
  'roman-numerals': <Milestone className="h-8 w-8" />,
  mean: <BarChart className="h-8 w-8" />,
  median: <UnfoldVertical className="h-8 w-8" />,
  mode: <BarChart className="h-8 w-8" />,
  range: <UnfoldVertical className="h-8 w-8" />,
  'simple-probability': <PercentCircle className="h-8 w-8" />,
  'simple-interest': <Banknote className="h-8 w-8" />,
  discounts: <Banknote className="h-8 w-8" />,
  'unit-conversion': <UtilityPole className="h-8 w-8" />,
  'time-calculation': <Timer className="h-8 w-8" />,
  'logic-puzzles': <Puzzle className="h-8 w-8" />,
  // Newly Added
  sine: <Waves className="h-8 w-8" />, cosine: <Sigma className="h-8 w-8" />, tangent: <Sigma className="h-8 w-8" />,
  'basic-derivatives': <TrendingUp className="h-8 w-8" />, 'basic-integrals': <Sigma className="h-8 w-8" />,
  logarithms: <Sigma className="h-8 w-8" />, 'polynomial-addition': <Plus className="h-8 w-8" />, 'polynomial-subtraction': <Minus className="h-8 w-8" />, inequalities: <Sigma className="h-8 w-8" />,
  'volume-cube': <Box className="h-8 w-8" />, 'volume-sphere': <Circle className="h-8 w-8" />, 'volume-cylinder': <Cylinder className="h-8 w-8" />, 'distance-formula': <MoveHorizontal className="h-8 w-8" />, 'slope-formula': <TrendingUp className="h-8 w-8" />,
  permutations: <ArrowRightLeft className="h-8 w-8" />, combinations: <Combine className="h-8 w-8" />, 'set-union': <UnionIcon className="h-8 w-8" />, 'set-intersection': <IntersectIcon className="h-8 w-8" />, factorial: <Sigma className="h-8 w-8" />,
  'compound-interest': <Landmark className="h-8 w-8" />, 'sales-tax': <Receipt className="h-8 w-8" />,
};

const getInitialInventory = (): Record<PowerUpType, number> => ({
    extraTime: 0,
    mistakeShield: 0,
    numberReveal: 0
});

function GameClientContent() {
  const { state, selectCategory, startConfiguredGame, submitAnswer, resetGame, endGame, backToConfig, usePowerUp } = useGame();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [numQuestions, setNumQuestions] = useState(10);
  const [isCustomQuestions, setIsCustomQuestions] = useState(false);
  const [inventory, setInventory] = useState<Record<PowerUpType, number>>(getInitialInventory());

  useEffect(() => {
    const storedInventory = localStorage.getItem(INVENTORY_KEY);
    setInventory(storedInventory ? JSON.parse(storedInventory) : getInitialInventory());
  }, []);

  const handleUsePowerUp = (powerUp: PowerUpType) => {
      if (inventory[powerUp] > 0) {
          usePowerUp(powerUp);
          const newInventory = { ...inventory, [powerUp]: inventory[powerUp] - 1 };
          setInventory(newInventory);
          localStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory));
          toast({ title: `${powerUp.replace(/([A-Z])/g, ' $1').trim()} used!` });
      }
  };

  const powerUpConfig: { type: PowerUpType; icon: React.ReactNode; name: string; colorClass: string; textColorClass: string; }[] = [
    { type: 'extraTime', icon: <Zap />, name: 'Extra Time', colorClass: 'border-chart-4 hover:bg-chart-4/10', textColorClass: 'text-chart-4' },
    { type: 'mistakeShield', icon: <Shield />, name: 'Mistake Shield', colorClass: 'border-primary hover:bg-primary/10', textColorClass: 'text-primary' },
    { type: 'numberReveal', icon: <Eye />, name: 'Number Reveal', colorClass: 'border-chart-2 hover:bg-chart-2/10', textColorClass: 'text-chart-2' },
  ];

  // Sound effect logic
  const prevGameState = useRef<GameState>(state);

  useEffect(() => {
    const currentPhase = state.phase;
    const previousPhase = prevGameState.current.phase;
    
    if (currentPhase === 'solve' && previousPhase !== 'solve') {
      playSound('flash');
    }

    if (currentPhase === 'result' && previousPhase !== 'result') {
        if(state.feedback === 'correct') {
            playSound('correct');
        } else if (state.feedback === 'incorrect') {
            playSound('incorrect');
        } else if (state.feedback === 'timeup' || state.feedback === 'shielded') {
            playSound('timeup');
        }
    }

    prevGameState.current = state;
  }, [state.phase, state.feedback]);
  

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') as MathCategory | null;
    if (categoryFromUrl && state.phase === 'config') {
      selectCategory(categoryFromUrl);
      router.replace('/app/challenge', { scroll: false });
    }
  }, [searchParams, state.phase, selectCategory, router]);

  useEffect(() => {
    if (state.phase === 'summary') {
      if (state.history.length === 0 && state.currentQuestionIndex === 0) {
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
        totalQuestions: String(state.totalQuestions),
        category: state.category || 'mixed',
        difficulty: String(state.difficulty),
      });
      
      router.push(`/app/challenge/summary?${params.toString()}`);
      resetGame();
    }
  }, [state.phase, state.history, state.score, state.coins, state.totalQuestions, state.category, state.difficulty, router, resetGame]);

  const handleOptionClick = (option: string) => {
    submitAnswer(option);
  };

  const handleStartChallenge = () => {
    startConfiguredGame({ difficultyLevel: difficulty, totalQuestions: numQuestions });
  };
  
  const handleSelectCategory = (category: MathCategory) => {
    selectCategory(category);
  };

  const handleNumQuestionsChange = (value: string) => {
    if (value === 'custom') {
        setIsCustomQuestions(true);
        setNumQuestions(25);
    } else {
        setIsCustomQuestions(false);
        setNumQuestions(Number(value));
    }
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
    
    const phaseWrapperClass = "w-full flex-grow flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8";

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
                                    onClick={() => handleSelectCategory(cat)}
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
                    <div className={cn(phaseWrapperClass, "gap-8 max-w-3xl mx-auto relative")}>
                        <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={backToConfig}>
                            <ArrowLeft className="h-6 w-6 text-muted-foreground" />
                            <span className="sr-only">Back to Categories</span>
                        </Button>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className="text-3xl md:text-4xl font-bold">Configure Challenge</h2>
                            <p className="text-muted-foreground mt-2 text-lg">Set your preferences for this round.</p>
                        </motion.div>
                        
                        <motion.div className="w-full grid md:grid-cols-2 gap-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 }}}}>
                           <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                             <Card className="p-6 text-left shadow-lg h-full transition-all hover:border-primary/50">
                                 <CardHeader className="p-0 mb-4">
                                     <CardTitle>Difficulty</CardTitle>
                                     <CardDescription>How tough should the questions be?</CardDescription>
                                 </CardHeader>
                                 <RadioGroup value={difficulty} onValueChange={(val) => setDifficulty(val as DifficultyLevel)} className="gap-4">
                                     <div className="flex items-center space-x-3 cursor-pointer">
                                         <RadioGroupItem value="easy" id="easy" />
                                         <Label htmlFor="easy" className="text-base font-medium cursor-pointer">Easy</Label>
                                     </div>
                                     <div className="flex items-center space-x-3 cursor-pointer">
                                         <RadioGroupItem value="medium" id="medium" />
                                         <Label htmlFor="medium" className="text-base font-medium cursor-pointer">Medium</Label>
                                     </div>
                                     <div className="flex items-center space-x-3 cursor-pointer">
                                         <RadioGroupItem value="hard" id="hard" />
                                         <Label htmlFor="hard" className="text-base font-medium cursor-pointer">Hard</Label>
                                     </div>
                                 </RadioGroup>
                             </Card>
                           </motion.div>
                           
                            <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                                <Card className="p-6 text-left shadow-lg h-full transition-all hover:border-primary/50">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle>Number of Questions</CardTitle>
                                        <CardDescription>How many questions to solve?</CardDescription>
                                    </CardHeader>
                                    <RadioGroup 
                                        value={isCustomQuestions ? 'custom' : String(numQuestions)} 
                                        onValueChange={handleNumQuestionsChange} 
                                        className="gap-4"
                                    >
                                        {[10, 20, 30, 50].map(num => (
                                            <div key={num} className="flex items-center space-x-3 cursor-pointer">
                                                <RadioGroupItem value={String(num)} id={`q-${num}`} />
                                                <Label htmlFor={`q-${num}`} className="text-base font-medium cursor-pointer">{num} Questions</Label>
                                            </div>
                                        ))}
                                        <div className="flex items-center space-x-3 cursor-pointer">
                                            <RadioGroupItem value="custom" id="q-custom" />
                                            <Label htmlFor="q-custom" className="text-base font-medium cursor-pointer">Custom</Label>
                                        </div>
                                    </RadioGroup>
                                    {isCustomQuestions && (
                                        <motion.div 
                                            className="mt-4 pt-4 border-t"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <Label htmlFor="custom-slider" className="font-semibold text-base">Custom Amount</Label>
                                                <span className="font-bold text-lg text-primary w-12 text-center rounded-md bg-primary/10 py-1">{numQuestions}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button size="icon" variant="outline" onClick={() => setNumQuestions(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                                                <Slider
                                                    id="custom-slider"
                                                    min={1}
                                                    max={100}
                                                    step={1}
                                                    value={[numQuestions]}
                                                    onValueChange={(value) => setNumQuestions(value[0])}
                                                />
                                                <Button size="icon" variant="outline" onClick={() => setNumQuestions(q => Math.min(100, q + 1))}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </Card>
                            </motion.div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}>
                            <Button size="lg" className="w-full max-w-md text-lg shadow-lg hover:shadow-primary/30 transition-shadow" onClick={handleStartChallenge}>
                                Start Challenge
                            </Button>
                        </motion.div>
                    </div>
                )}

                {(state.phase === 'memorize' || state.phase === 're-memorize') && (
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
                                <span className="text-3xl md:text-4xl font-bold tracking-wider">{num}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                    <Progress value={(state.remainingTime / (state.phase === 'memorize' ? state.memorizeDuration : 1500)) * 100} className="h-4 rounded-full max-w-md mx-auto" />
                </div>
                )}
                {state.phase === 'solve' && (
                <div className={phaseWrapperClass}>
                    <motion.div 
                        key={state.currentChallenge?.question}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-2xl text-center bg-card border-2 border-primary/30 rounded-3xl p-8 mb-8 shadow-xl"
                    >
                        <p className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                            {state.currentChallenge?.question}
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl"
                        variants={itemContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {state.currentChallenge?.options.map((option, i) => (
                            <motion.div key={i} variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.97 }}>
                                <button
                                    className={cn(
                                        "w-full h-24 md:h-28 text-xl md:text-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-center",
                                        "bg-card border-2",
                                        ['border-chart-1/50 hover:bg-chart-1/10 hover:text-chart-1', 'border-chart-2/50 hover:bg-chart-2/10 hover:text-chart-2', 'border-chart-3/50 hover:bg-chart-3/10 hover:text-chart-3', 'border-chart-4/50 hover:bg-chart-4/10 hover:text-chart-4'][i % 4]
                                    )}
                                    onClick={() => handleOptionClick(String(option))}
                                >
                                    {String(option)}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    <div className="w-full max-w-md mt-8">
                      <Progress value={(state.remainingTime / state.solveDuration) * 100} className="h-2" />
                    </div>

                    <div className="mt-8 flex justify-center items-center gap-4">
                      <TooltipProvider>
                          {powerUpConfig.map(p => (
                            <Tooltip key={p.type}>
                                <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className={cn(
                                        "h-16 w-16 rounded-full shadow-lg relative transition-all border-2",
                                        p.colorClass,
                                        p.textColorClass,
                                        state.isShieldActive && p.type === 'mistakeShield' ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : '',
                                        '[&>svg]:h-8 [&>svg]:w-8'
                                      )}
                                      onClick={() => handleUsePowerUp(p.type)}
                                      disabled={inventory[p.type] === 0 || (p.type === 'mistakeShield' && state.isShieldActive)}
                                    >
                                      {p.icon}
                                      {inventory[p.type] > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{inventory[p.type]}</span>}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{p.name}</p>
                                </TooltipContent>
                            </Tooltip>
                          ))}
                      </TooltipProvider>
                    </div>
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
                    {state.feedback === 'shielded' && (
                         <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring', stiffness: 260, damping: 20}}>
                            <Shield className="w-24 h-24 md:w-32 md:h-32 text-blue-500" />
                        </motion.div>
                    )}
                    <h2 className="text-4xl md:text-5xl font-bold capitalize">
                        {state.feedback === 'timeup' ? "Time's Up!" : (state.feedback === 'correct' ? "Correct!" : (state.feedback === 'shielded' ? "Shielded!" : "Incorrect"))}
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
                     {(state.feedback === 'incorrect' || state.feedback === 'shielded') && (
                        <p className="text-xl md:text-2xl mt-1 text-muted-foreground">
                            {state.feedback === 'shielded' && 'Your answer was wrong, but your shield protected you! '}
                            The correct answer was: <span className="text-foreground font-bold">{state.currentChallenge?.answer}</span>
                        </p>
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
                    ) : 'MathMagix Challenge'}
                </h2>
                {state.phase !== 'config' && state.phase !== 'pre-config' && state.phase !== 'summary' && (
                    <div className="flex items-center flex-wrap justify-center gap-2 text-xs font-medium">
                        <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><BarChart className="w-3 h-3 text-blue-400" />Question: <span className="font-bold tabular-nums">{state.currentQuestionIndex}/{state.totalQuestions}</span></div>
                        <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><Trophy className="w-3 h-3 text-orange-400" /> <span className="font-bold tabular-nums">{state.score}</span></div>
                        <div className="flex items-center gap-1.5 bg-secondary py-1 px-2.5 rounded-full"><Coins className="w-3 h-3 text-yellow-400" /> <span className="font-bold tabular-nums">{state.coins}</span></div>
                        {state.isShieldActive && <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 py-1 px-2.5 rounded-full"><Shield className="w-3 h-3" /> Shield Active</div>}
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
