'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins, Star, BarChart, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const statItems = [
    { label: "Total Score", value: "14,500", icon: <Trophy className="h-8 w-8 text-orange-400"/> },
    { label: "Coins", value: "573", icon: <Coins className="h-8 w-8 text-yellow-400"/> },
    { label: "Global Rank", value: "#3", icon: <Star className="h-8 w-8 text-indigo-400"/> },
    { label: "Top Skill", value: "Addition", icon: <BarChart className="h-8 w-8 text-blue-400"/> },
    { label: "Avg. Time", value: "4.2s", icon: <Clock className="h-8 w-8 text-red-400"/> },
    { label: "Accuracy", value: "88%", icon: <Target className="h-8 w-8 text-green-400"/> }
];

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                    <motion.div 
                        initial={{ scale: 0, y: 100 }} 
                        animate={{ scale: 1, y: 0 }} 
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                    >
                        <Avatar className="h-32 w-32 border-8 border-background shadow-xl">
                            <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="smiling woman" />
                            <AvatarFallback className="text-4xl">YOU</AvatarFallback>
                        </Avatar>
                    </motion.div>
                </div>
                <CardHeader className="pt-20 text-center">
                    <CardTitle className="text-4xl">Your Name</CardTitle>
                    <CardDescription className="text-lg">Mathlete since yesterday</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    </div>
                    <div className="mt-8 text-center">
                        <Button>Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}
