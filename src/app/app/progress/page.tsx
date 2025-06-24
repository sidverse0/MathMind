'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartConfig, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import { TrendingUp, Target, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const weeklyData = [
    { day: "Mon", score: 450 },
    { day: "Tue", score: 600 },
    { day: "Wed", score: 550 },
    { day: "Thu", score: 800 },
    { day: "Fri", score: 750 },
    { day: "Sat", score: 1100 },
    { day: "Sun", score: 950 },
];

const weeklyChartConfig = {
  score: { label: "Score", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const categoryData = [
    { name: 'Addition', value: 400, color: 'hsl(var(--chart-1))' },
    { name: 'Subtraction', value: 300, color: 'hsl(var(--chart-2))' },
    { name: 'Multiplication', value: 300, color: 'hsl(var(--chart-3))' },
    { name: 'Division', value: 200, color: 'hsl(var(--chart-4))' },
];

const categoryChartConfig = {
    value: { label: "Questions" },
    addition: { label: "Addition", color: "hsl(var(--chart-1))" },
    subtraction: { label: "Subtraction", color: "hsl(var(--chart-2))" },
    multiplication: { label: "Multiplication", color: "hsl(var(--chart-3))" },
    division: { label: "Division", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const statCards = [
    { label: "Best Score", value: "1,100", icon: <TrendingUp className="h-6 w-6 text-primary"/> },
    { label: "Avg. Accuracy", value: "88%", icon: <Target className="h-6 w-6 text-green-500"/> },
    { label: "Avg. Time/Q", value: "4.2s", icon: <Clock className="h-6 w-6 text-yellow-500"/> },
    { label: "Correct Answers", value: "352", icon: <CheckCircle className="h-6 w-6 text-blue-500"/> },
    { label: "Incorrect Answers", value: "48", icon: <XCircle className="h-6 w-6 text-red-500"/> },
];

const renderCustomLegend = () => {
    return <p className="text-center text-sm text-muted-foreground mt-4">Hover to see details</p>;
}

export default function ProgressPage() {
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Progress</h1>
            <p className="text-muted-foreground mt-2 text-base">Track your journey to becoming a MathMind.</p>
        </motion.div>

        <motion.div 
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {statCards.map((stat) => (
                <motion.div key={stat.label} variants={itemVariants}>
                    <Card className="hover:border-primary/50 transition-colors h-full flex flex-col p-4 items-center text-center gap-3">
                        {stat.icon}
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </Card>
                </motion.div>
            ))}
        </motion.div>

        <motion.div 
            className="grid gap-8 lg:grid-cols-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="shadow-lg lg:col-span-3">
                <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                    <CardDescription>Your score progress over the last week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={weeklyChartConfig} className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis />
                                <ChartTooltip cursor={{fill: 'hsl(var(--accent))', radius: 4}} content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Questions answered by category.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={categoryChartConfig} className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} label>
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                </Pie>
                                <Legend content={renderCustomLegend} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>
    </div>
    );
}
