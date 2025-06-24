'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, Gamepad2, Trophy, Coins, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const statsCards = [
    { title: "Current Score", value: "14,500", icon: <Trophy className="h-6 w-6 text-muted-foreground" /> },
    { title: "Coins Earned", value: "573", icon: <Coins className="h-6 w-6 text-muted-foreground" /> },
    { title: "Top Skill", value: "Addition", icon: <BarChart className="h-6 w-6 text-muted-foreground" /> },
    { title: "Difficulty Level", value: "5", icon: <BrainCircuit className="h-6 w-6 text-muted-foreground" /> },
];

export default function DashboardPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome back, Mathlete!</h1>
        <p className="text-muted-foreground mt-2 text-base">Ready for your next challenge? Let's get those neurons firing.</p>
      </motion.div>

      <motion.div 
        whileHover={{ y: -5 }}
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ delay: 0.2, duration: 0.4 }}
      >
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 shadow-lg">
            <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-3 text-xl md:text-2xl"><Gamepad2/> New Challenge Awaits</CardTitle>
                <CardDescription>A new set of problems is ready. Jump in and test your skills.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <Link href="/app/challenge">
                    <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow text-base md:text-lg">
                        Start Challenge <ArrowRight className="ml-2" />
                    </Button>
                </Link>
            </CardContent>
          </Card>
      </motion.div>
      
      <motion.div 
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsCards.map((card, i) => (
             <motion.div key={i} variants={itemVariants} whileHover={{ y: -5 }}>
                <Card className="hover:border-primary/50 transition-colors h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                        <CardTitle className="text-sm font-medium">
                        {card.title}
                        </CardTitle>
                        {card.icon}
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center p-6 pt-0">
                        <div className="text-2xl md:text-3xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
