'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const leaderboardData = [
  { rank: 1, name: "Alex", score: 15420, avatar: "https://files.catbox.moe/uvi8l9.png" },
  { rank: 2, name: "Maria", score: 14890, avatar: "https://files.catbox.moe/uvi8l9.png" },
  { rank: 3, name: "You", score: 14500, avatar: "https://files.catbox.moe/uvi8l9.png" },
  { rank: 4, name: "David", score: 13900, avatar: "https://files.catbox.moe/uvi8l9.png" },
  { rank: 5, name: "Sophia", score: 13750, avatar: "https://files.catbox.moe/uvi8l9.png" },
  { rank: 6, name: "Liam", score: 12100, avatar: "https://files.catbox.moe/uvi8l9.png" },
  { rank: 7, name: "Olivia", score: 11500, avatar: "https://files.catbox.moe/uvi8l9.png" },
];

export default function LeaderboardPage() {
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
            <p className="text-muted-foreground mt-1 text-base">See how you stack up against the top MathMagicians.</p>
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
              {leaderboardData.map((player) => (
                <motion.tr 
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
                        <Avatar className={cn("h-10 w-10 md:h-12 md:w-12 border-4 shadow-md", getRankColor(player.rank))}>
                            <AvatarImage src={player.avatar} alt={player.name} />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-base">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg md:text-xl">{player.score.toLocaleString()}</TableCell>
                </motion.tr>
              ))}
            </motion.tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
