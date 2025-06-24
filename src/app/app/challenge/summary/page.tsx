
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, SkipForward, Target, Clock, Trophy, Coins } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { motion } from 'framer-motion';
import Link from 'next/link';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

function SummaryContent() {
    const searchParams = useSearchParams();

    const score = Number(searchParams.get('score') || 0);
    const coins = Number(searchParams.get('coins') || 0);
    const correct = Number(searchParams.get('correct') || 0);
    const incorrect = Number(searchParams.get('incorrect') || 0);
    const skipped = Number(searchParams.get('skipped') || 0);
    const accuracy = Number(searchParams.get('accuracy') || 0);
    const avgTime = Number(searchParams.get('avgTime') || 0);

    const pieData = [
        { name: 'Correct', value: correct },
        { name: 'Incorrect', value: incorrect },
        { name: 'Skipped', value: skipped },
    ].filter(item => item.value > 0);

    const statCards = [
        { label: "Accuracy", value: `${accuracy}%`, icon: <Target className="h-6 w-6 text-green-500"/> },
        { label: "Avg. Time / Q", value: `${avgTime}s`, icon: <Clock className="h-6 w-6 text-yellow-500"/> },
        { label: "Correct", value: correct, icon: <CheckCircle className="h-6 w-6 text-primary"/> },
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
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Challenge Summary</h1>
                    <p className="text-muted-foreground mt-2 text-base">Here's how you performed.</p>
                </div>
                <Link href="/app/challenge/categories">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
                    </Button>
                </Link>
            </motion.div>

            <motion.div 
                className="grid gap-8 lg:grid-cols-5"
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
                                <ChartContainer config={{}} className="h-[300px] w-full">
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
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                    No data to display.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="shadow-lg h-full">
                        <CardHeader>
                            <CardTitle>Total Score & Coins</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <Trophy className="h-5 w-5 text-orange-400" />
                                    <span>Total Score</span>
                                </div>
                                <span className="font-bold text-xl">{score}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <Coins className="h-5 w-5 text-yellow-400" />
                                    <span>Coins Earned</span>
                                </div>
                                <span className="font-bold text-xl">{coins}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
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
                    <Button size="lg">
                        Play Another Round
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}

export default function SummaryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SummaryContent />
        </Suspense>
    )
}
