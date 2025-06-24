import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartConfig, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, Coins, Star } from "lucide-react";

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

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
        <Card>
            <CardHeader className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture" />
                    <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold">Your Profile</h1>
                    <p className="text-muted-foreground">Mathlete since yesterday</p>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                    <Trophy className="h-8 w-8 text-orange-500"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Score</p>
                        <p className="text-2xl font-bold">14,500</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                    <Coins className="h-8 w-8 text-yellow-500"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Coins</p>
                        <p className="text-2xl font-bold">573</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
                    <Star className="h-8 w-8 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Global Rank</p>
                        <p className="text-2xl font-bold">#3</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Your score progress over the last week.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
