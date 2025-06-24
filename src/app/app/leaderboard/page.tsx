'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const leaderboardData = [
  { rank: 1, name: "Alex", score: 15420, avatar: "A" },
  { rank: 2, name: "Maria", score: 14890, avatar: "M" },
  { rank: 3, name: "You", score: 14500, avatar: "Y" },
  { rank: 4, name: "David", score: 13900, avatar: "D" },
  { rank: 5, name: "Sophia", score: 13750, avatar: "S" },
  { rank: 6, name: "Liam", score: 12100, avatar: "L" },
  { rank: 7, name: "Olivia", score: 11500, avatar: "O" },
];

export default function LeaderboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <div className="flex flex-col gap-8">
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy className="h-10 w-10 text-yellow-500" />
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground mt-1">See how you stack up against other players.</p>
        </div>
      </motion.div>
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {leaderboardData.map((player) => (
                <motion.tr 
                    as={TableRow} 
                    key={player.rank} 
                    variants={itemVariants} 
                    className={cn(
                        "transition-colors",
                        player.name === "You" ? "bg-primary/10 hover:bg-primary/20" : ""
                    )}
                >
                  <TableCell className="font-bold text-lg text-center">
                    <div className="flex items-center justify-center gap-2">
                        {player.rank === 1 && <Trophy className="w-6 h-6 inline-block text-yellow-400" />}
                        {player.rank === 2 && <Trophy className="w-6 h-6 inline-block text-slate-400" />}
                        {player.rank === 3 && <Trophy className="w-6 h-6 inline-block text-orange-600" />}
                        {player.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                        <Avatar className={cn("h-12 w-12 border-4 shadow-md", getRankColor(player.rank))}>
                            <AvatarImage src={`https://avatar.vercel.sh/${player.name}.png?size=48`} />
                            <AvatarFallback>{player.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-base">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-xl">{player.score.toLocaleString()}</TableCell>
                </motion.tr>
              ))}
            </motion.tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
