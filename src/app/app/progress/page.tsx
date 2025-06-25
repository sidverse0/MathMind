'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartConfig, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Pie, PieChart, Cell, Tooltip } from 'recharts';
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
    { name: 'Addition', value: 400 },
    { name: 'Subtraction', value: 300 },
    { name: 'Multiplication', value: 300 },
    { name: 'Division', value: 200 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const statCards = [
    { label: "Best Score", value: "1,100", icon: <TrendingUp className="h-6 w-6 text-primary"/> },
    { label: "Avg. Accuracy", value: "88%", icon: <Target className="h-6 w-6 text-green-500"/> },
    { label: "Avg. Time/Q", value: "4.2s", icon: <Clock className="h-6 w-6 text-yellow-500"/> },
    { label: "Correct Answers", value: "352", icon: <CheckCircle className="h-6 w-6 text-blue-500"/> },
    { label: "Incorrect Answers", value: "48", icon: <XCircle className="h-6 w-6 text-red-500"/> },
];

export default function ProgressPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
    <motion.div 
        className="flex flex-col gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
        <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Progress</h1>
            <p className="text-muted-foreground mt-2 text-base">Track your journey to becoming a MathMind.</p>
        </motion.div>

        <motion.div 
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            variants={itemVariants}
        >
            {statCards.map((stat) => (
                <Card key={stat.label} className="hover:border-primary/50 transition-colors h-full flex flex-col p-4 items-center text-center gap-3 shadow-md">
                    {stat.icon}
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                </Card>
            ))}
        </motion.div>

        <motion.div 
            className="grid gap-8 grid-cols-1 lg:grid-cols-2"
            variants={itemVariants}
        >
            <Card className="shadow-lg">
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
                                <Tooltip cursor={{fill: 'hsl(var(--accent))', radius: 4}} content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Questions answered by category.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px] w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Tooltip content={<ChartTooltipContent hideLabel />} />
                                <Legend />
                                <Pie 
                                    data={categoryData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={100} 
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                        return (
                                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>
    </motion.div>
    );
}
