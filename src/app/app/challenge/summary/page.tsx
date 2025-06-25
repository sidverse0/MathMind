

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, SkipForward, Target, Clock, Trophy, Coins, RotateCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { playSound } from '@/lib/audio';
import { useUser } from '@/contexts/user-context';
import { adjustDifficulty } from '@/ai/flows/adaptive-difficulty';
import { useToast } from '@/hooks/use-toast';

const SUMMARY_PIE_COLORS: { [key: string]: string } = {
  'Correct': 'hsl(142, 71%, 45%)', // Green
  'Incorrect': 'hsl(var(--destructive))', // Red
  'Skipped': 'hsl(var(--chart-3))', // Ocean/Light Blue
};

function SummaryContent() {
    const searchParams = useSearchParams();
    const { userData, updateUserData } = useUser();
    const { toast } = useToast();
    const [summaryApplied, setSummaryApplied] = useState(false);

    const score = Number(searchParams.get('score') || 0);
    const coinsEarned = Number(searchParams.get('coins') || 0);
    const correct = Number(searchParams.get('correct') || 0);
    const incorrect = Number(searchParams.get('incorrect') || 0);
    const skipped = Number(searchParams.get('skipped') || 0);
    const accuracy = Number(searchParams.get('accuracy') || 0);
    const avgTime = Number(searchParams.get('avgTime') || 0);
    const category = searchParams.get('category');
    const finalDifficulty = Number(searchParams.get('difficulty') || 5);

    useEffect(() => {
        const applySummary = async () => {
            if (userData && !summaryApplied) {
                setSummaryApplied(true);
                playSound('summary');

                // 1. Adjust difficulty
                let newDifficulty = finalDifficulty;
                try {
                    const difficultyAdjustment = await adjustDifficulty({
                        accuracy: accuracy / 100, // expecting 0-1
                        averageTime: avgTime,
                        currentDifficulty: userData.difficulty || 5,
                    });
                    newDifficulty = difficultyAdjustment.newDifficulty;
                    toast({
                        title: "Difficulty Adjusted!",
                        description: difficultyAdjustment.reason,
                    });
                } catch (error) {
                    console.error("Failed to adjust difficulty:", error);
                    // Keep original difficulty on error
                }

                // 2. Update user data
                const newCoins = (userData.coins || 0) + coinsEarned;
                const newScore = (userData.score || 0) + score;
                await updateUserData({
                    coins: newCoins,
                    score: newScore,
                    difficulty: newDifficulty,
                });
            }
        };

        applySummary();
    }, [userData, summaryApplied, coinsEarned, score, finalDifficulty, accuracy, avgTime, updateUserData, toast, category]);

    const pieData = [
        { name: 'Correct', value: correct },
        { name: 'Incorrect', value: incorrect },
        { name: 'Skipped', value: skipped },
    ].filter(item => item.value > 0);

    const statCards = [
        { label: "Accuracy", value: `${accuracy}%`, icon: <Target className="h-6 w-6 text-green-500"/> },
        { label: "Avg. Time / Q", value: `${avgTime}s`, icon: <Clock className="h-6 w-6 text-yellow-500"/> },
        { label: "Correct", value: correct, icon: <CheckCircle className="h-6 w-6 text-green-500"/> },
        { label: "Incorrect", value: incorrect, icon: <XCircle className="h-6 w-6 text-destructive"/> },
        { label: "Skipped", value: skipped, icon: <SkipForward className="h-6 w-6 text-muted-foreground"/> },
    ];
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex flex-col gap-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Challenge Summary</h1>
                    <p className="text-muted-foreground mt-2 text-base">Here's how you performed.</p>
                </div>
                <Link href={category ? `/app/challenge?category=${category}` : '/app/challenge/categories'} className="w-full sm:w-auto">
                    <Button size="lg" className="shadow-lg w-full sm:w-auto" disabled={!category}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Play Another Round
                    </Button>
                </Link>
            </motion.div>

            <motion.div 
                className="grid gap-8 grid-cols-1 lg:grid-cols-5"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants} className="lg:col-span-3">
                    <Card className="shadow-lg h-full">
                        <CardHeader>
                            <CardTitle>Performance Breakdown</CardTitle>
                            <CardDescription>A visual summary of your answers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pieData.length > 0 ? (
                                <ChartContainer config={{}} className="h-[250px] sm:h-[300px] w-full">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                                            <Legend />
                                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                                return (
                                                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold">
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                );
                                            }}>
                                                {pieData.map((entry) => (
                                                    <Cell key={`cell-${entry.name}`} fill={SUMMARY_PIE_COLORS[entry.name]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                                    No data to display.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="shadow-lg h-full">
                        <CardHeader>
                            <CardTitle>Your Rewards</CardTitle>
                             <CardDescription>Your score and coins from this round.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                            <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-secondary/50 text-center h-full border hover:bg-secondary transition-colors">
                                <Trophy className="h-8 w-8 text-orange-400" />
                                <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                                <p className="font-bold text-3xl tracking-tight">{score}</p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-secondary/50 text-center h-full border hover:bg-secondary transition-colors">
                                <Coins className="h-8 w-8 text-yellow-400" />
                                <p className="text-sm font-medium text-muted-foreground">Coins Earned</p>
                                <p className="font-bold text-3xl tracking-tight">{coinsEarned}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {statCards.map((stat) => (
                    <motion.div key={stat.label} variants={itemVariants}>
                        <Card className="hover:border-primary/50 transition-colors h-full flex flex-col p-4 items-center text-center gap-3 shadow-md">
                            {stat.icon}
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.5 }}} className="flex justify-center">
                <Link href="/app/challenge/categories">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}

export default function SummaryPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Loading summary...</div>}>
            <SummaryContent />
        </Suspense>
    )
}
