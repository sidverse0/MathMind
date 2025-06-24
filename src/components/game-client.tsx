'use client';

import { useGame } from '@/hooks/use-game';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartConfig, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { Coins, Plus, Minus, X, Divide, BrainCircuit, Trophy, Timer, CheckCircle, XCircle, Gamepad2 } from 'lucide-react';
import type { MathCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { FormEvent, useRef } from 'react';

const categoryIcons: Record<MathCategory, React.ReactNode> = {
  addition: <Plus className="h-10 w-10" />,
  subtraction: <Minus className="h-10 w-10" />,
  multiplication: <X className="h-10 w-10" />,
  division: <Divide className="h-10 w-10" />,
};

const chartConfig = {
  accuracy: {
    label: "Accuracy",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function GameClient() {
  const { state, setCategory, startGame, submitAnswer, resetGame } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAnswerSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      submitAnswer(inputRef.current.value);
      if (inputRef.current) inputRef.current.value = '';
    }
  };
  
  const renderPhase = () => {
    return (
      <div className="relative w-full min-h-[300px] flex items-center justify-center">
        {state.phase === 'config' && (
          <div className="w-full text-center animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6">Choose a Category</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {(Object.keys(categoryIcons) as MathCategory[]).map((cat) => (
                <Button
                  key={cat}
                  variant={state.category === cat ? 'default' : 'outline'}
                  size="lg"
                  className={cn("h-28 text-lg flex-col gap-2 transition-all duration-300 transform hover:scale-105", state.category === cat ? 'scale-105 border-primary border-2' : '')}
                  onClick={() => setCategory(cat)}
                >
                  {categoryIcons[cat]}
                  <span className="capitalize">{cat}</span>
                </Button>
              ))}
            </div>
            <Button size="lg" onClick={startGame} className="w-full text-xl py-8">
                <Gamepad2 className="mr-2 h-6 w-6" /> Start Game
            </Button>
          </div>
        )}
        {state.phase === 'memorize' && (
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4">Remember these numbers...</h2>
            <div className="text-6xl font-bold tracking-widest text-primary my-8">
              {state.currentChallenge?.numbers.join(' ')}
            </div>
            <Progress value={(state.remainingTime / state.memorizeDuration) * 100} />
          </div>
        )}
        {state.phase === 'solve' && (
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4">What is the answer?</h2>
            <div className="text-5xl font-bold my-8">
              {state.currentChallenge?.question}
            </div>
            <form onSubmit={handleAnswerSubmit} className="flex gap-2">
              <Input ref={inputRef} type="number" placeholder="Your answer" className="text-center text-lg h-14" autoFocus />
              <Button type="submit" size="lg" className="h-14">Submit</Button>
            </form>
            <Progress value={(state.remainingTime / state.solveDuration) * 100} className="mt-4" />
          </div>
        )}
        {state.phase === 'result' && (
          <div className="text-center flex flex-col items-center justify-center animate-fadeIn">
            {state.feedback === 'correct' && <CheckCircle className="w-24 h-24 text-green-500 mb-4" />}
            {state.feedback === 'incorrect' && <XCircle className="w-24 h-24 text-red-500 mb-4" />}
            {state.feedback === 'timeup' && <Timer className="w-24 h-24 text-yellow-500 mb-4" />}
            <h2 className="text-4xl font-bold capitalize">
              {state.feedback === 'timeup' ? "Time's Up!" : state.feedback}
            </h2>
            {state.feedback === 'incorrect' && (
                <p className="text-lg mt-2">Correct answer: {state.currentChallenge?.answer}</p>
            )}
            <Progress value={(state.remainingTime / 2000) * 100} className="mt-4 w-1/2" />
          </div>
        )}
      </div>
    );
  };

  const accuracyData = state.history.reduce((acc, record, index) => {
    const CHUNK_SIZE = 5;
    if((index + 1) % CHUNK_SIZE === 0 || (index === state.history.length - 1 && state.history.length > 1) ){
        const chunk = state.history.slice(Math.max(0, index - CHUNK_SIZE + 1), index + 1);
        const chunkAccuracy = chunk.filter(r => r.correct).length / chunk.length * 100;
        acc.push({
            name: `Game ${index+1}`,
            accuracy: chunkAccuracy,
        });
    }
    return acc;
  }, [] as {name: string; accuracy: number}[]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <Card className="w-full lg:flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Challenge</CardTitle>
            <div className="flex items-center flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary" /> Score: <span className="font-bold">{state.score}</span></div>
                <div className="flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-500" /> Coins: <span className="font-bold">{state.coins}</span></div>
                <div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-orange-500" /> Difficulty: <span className="font-bold">{state.difficulty}</span></div>
            </div>
        </CardHeader>
        <CardContent>
          {renderPhase()}
        </CardContent>
        {state.phase !== 'config' && (
             <CardFooter>
                 <Button variant="outline" onClick={resetGame} className="w-full">End Game</Button>
            </CardFooter>
        )}
      </Card>
      <Card className="w-full lg:w-96">
        <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Accuracy over last {state.history.length} questions.</CardDescription>
        </CardHeader>
        <CardContent>
            {accuracyData.length > 1 ? (
                 <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart data={accuracyData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis domain={[0, 100]} unit="%" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke="var(--color-accuracy)" strokeWidth={2} dot={true} />
                    </LineChart>
                </ChartContainer>
            ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-center p-4">
                    Play at least 5 rounds to see your progress chart!
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
