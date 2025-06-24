'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Gamepad2, Trophy, Coins, BrainCircuit, Star, Sigma, Square, Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';

const quickAccessCategories = [
    { name: "Mixed", icon: <Plus className="h-6 w-6" />, href: "/app/challenge?category=mixed" },
    { name: "Algebra", icon: <Sigma className="h-6 w-6" />, href: "/app/challenge?category=algebra" },
    { name: "Geometry", icon: <Square className="h-6 w-6" />, href: "/app/challenge?category=area-of-squares" },
];

const topPlayers = [
  { rank: 1, name: "Alex", avatar: "https://files.catbox.moe/uvi8l9.png" },
  { rank: 2, name: "Maria", avatar: "https://files.catbox.moe/uvi8l9.png" },
];

const userRank = { rank: 3, name: "You", avatar: "https://files.catbox.moe/uvi8l9.png" };

export default function DashboardPage() {
    const [userName, setUserName] = useState("Mathlete");

    useEffect(() => {
        const storedName = localStorage.getItem('mathMindUserName');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

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

    const MotionCard = motion(Card);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome back, {userName}!</h1>
            <p className="text-muted-foreground mt-2 text-base">Your mind is a muscle. Let's make it stronger today.</p>
        </div>
        <Link href="https://files.catbox.moe/i6khoe.jpg" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="shadow-md hidden sm:flex">
                <Image src="https://files.catbox.moe/aawyf3.png" alt="Buy me a coffee" width={24} height={24} className="mr-2 rounded-full" />
                Buy me a coffee
            </Button>
            <Button variant="outline" size="icon" className="shadow-md sm:hidden">
                <Image src="https://files.catbox.moe/aawyf3.png" alt="Buy me a coffee" width={24} height={24} className="rounded-full" />
                <span className="sr-only">Buy me a coffee</span>
            </Button>
        </Link>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
            <MotionCard 
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 shadow-lg"
            >
              <CardHeader className="flex flex-row items-center gap-4 p-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Gamepad2 className="h-10 w-10 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-xl md:text-2xl">New Challenge Awaits</CardTitle>
                  <CardDescription>Dive into a new set of problems tailored to your skill level.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                  <Link href="/app/challenge">
                      <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow text-base md:text-lg">
                          Start Random Challenge <ArrowRight className="ml-2" />
                      </Button>
                  </Link>
              </CardContent>
            </MotionCard>
            <MotionCard variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <CardHeader>
                <CardTitle>Jump Back In</CardTitle>
                <CardDescription>Continue your training with a specific category.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickAccessCategories.map(cat => (
                      <Link key={cat.name} href={cat.href} passHref>
                        <Button variant="outline" className="w-full h-24 flex-col gap-2 justify-center text-base hover:bg-primary/10 hover:border-primary">
                          <div className="text-primary">{cat.icon}</div>
                          <span>{cat.name}</span>
                        </Button>
                      </Link>
                  ))}
              </CardContent>
            </MotionCard>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 md:gap-8">
            <MotionCard variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-fit">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>A quick look at your performance.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-base">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-orange-400" />
                    <span>Total Score</span>
                  </div>
                  <span className="font-bold">14,500</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-yellow-400" />
                    <span>Coins Earned</span>
                  </div>
                  <span className="font-bold">573</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-indigo-400" />
                    <span>Global Rank</span>
                  </div>
                  <span className="font-bold">#3</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <span>Difficulty</span>
                  </div>
                  <span className="font-bold">5</span>
                </div>
              </CardContent>
            </MotionCard>
             <MotionCard variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
              <CardHeader>
                <CardTitle>Leaderboard Snapshot</CardTitle>
                 <CardDescription>See who's on top.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {topPlayers.map(player => (
                  <div key={player.rank} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <span className="font-bold w-6 text-center">{player.rank}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{player.name}</span>
                    </div>
                  </div>
                ))}
                 <div className="flex items-center justify-between p-2 rounded-md transition-colors bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <span className="font-bold w-6 text-center">{userRank.rank}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userRank.avatar} alt={userRank.name} />
                        <AvatarFallback>{userRank.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-primary">{userRank.name}</span>
                    </div>
                  </div>
                <Link href="/app/leaderboard" className="w-full">
                  <Button variant="secondary" className="w-full mt-2">
                    View Full Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </MotionCard>
        </div>
      </motion.div>
    </div>
  );
}
