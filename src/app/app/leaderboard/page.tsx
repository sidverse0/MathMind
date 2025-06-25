
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser, type UserData } from '@/contexts/user-context';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';


export default function LeaderboardPage() {
  const { userData } = useUser();
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!db) {
        setLoading(false);
        return;
      };
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('score', 'desc'));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => doc.data() as UserData);
        setLeaderboard(usersList);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "border-yellow-400 shadow-yellow-400/50";
    if (rank === 2) return "border-slate-400 shadow-slate-400/50";
    if (rank === 3) return "border-orange-600 shadow-orange-600/50";
    return "border-transparent";
  };
  
  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy className="h-10 w-10 text-yellow-500" />
        <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground mt-1 text-base">See how you stack up against the top MathMinds.</p>
        </div>
      </motion.div>
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center text-base">Rank</TableHead>
                <TableHead className="text-base">Player</TableHead>
                <TableHead className="text-right text-base">Score</TableHead>
              </TableRow>
            </TableHeader>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = player.uid === userData?.uid;

                return (
                    <motion.tr 
                        key={player.uid} 
                        variants={itemVariants} 
                        className={cn(
                            "transition-colors",
                            isCurrentUser ? "bg-primary/10 hover:bg-primary/20" : ""
                        )}
                    >
                    <TableCell className="font-bold text-lg text-center">
                        <div className="flex items-center justify-center gap-2">
                            {rank === 1 && <Trophy className="w-6 h-6 inline-block text-yellow-400" />}
                            {rank === 2 && <Trophy className="w-6 h-6 inline-block text-slate-400" />}
                            {rank === 3 && <Trophy className="w-6 h-6 inline-block text-orange-600" />}
                            {rank}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-4">
                            <Avatar className={cn("h-10 w-10 md:h-12 md:w-12 border-4 shadow-md", getRankColor(rank))}>
                                <AvatarImage src={player.avatar} alt={player.name} />
                                <AvatarFallback>{player.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-base">{isCurrentUser ? 'You' : player.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg md:text-xl">{player.score.toLocaleString()}</TableCell>
                    </motion.tr>
                )
            })}
            </motion.tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
