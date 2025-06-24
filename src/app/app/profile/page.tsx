'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartConfig, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, Coins, Star } from "lucide-react";
import { motion } from "framer-motion";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const weeklyData = [
    { day: "Mon", score: 450 },
    { day: "Tue", score: 600 },
    { day: "Wed", score: 550 },
    { day: "Thu", score: 800 },
    { day: "Fri", score: 750 },
    { day: "Sat", score: 1100 },
    { day: "Sun", score: 950 },
];

const statItems = [
    { label: "Total Score", value: "14,500", icon: <Trophy className="h-8 w-8 text-orange-500"/> },
    { label: "Coins", value: "573", icon: <Coins className="h-8 w-8 text-yellow-500"/> },
    { label: "Global Rank", value: "#3", icon: <Star className="h-8 w-8 text-primary"/> }
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg overflow-hidden">
                <CardHeader className="flex flex-col md:flex-row items-center gap-6 bg-secondary/50 p-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                        <Avatar className="h-28 w-28 border-4 border-primary shadow-lg">
                            <AvatarImage src="https://avatar.vercel.sh/you.png?size=120" />
                            <AvatarFallback>YOU</AvatarFallback>
                        </Avatar>
                    </motion.div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold">Your Profile</h1>
                        <p className="text-muted-foreground text-lg">Mathlete since yesterday</p>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statItems.map((item, index) => (
                        <motion.div 
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <Card className="p-4 flex items-center gap-4 hover:bg-secondary/80 transition-colors">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="text-2xl font-bold">{item.value}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                    <CardDescription>Your score progress over the last week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
        </motion.div>
    </div>
  );
}
