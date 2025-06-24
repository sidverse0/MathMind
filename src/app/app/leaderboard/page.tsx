import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <Trophy className="h-10 w-10 text-yellow-500" />
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-muted-foreground mt-1">See how you stack up against other players.</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => (
                <TableRow key={player.rank} className={player.name === "You" ? "bg-primary/10" : ""}>
                  <TableCell className="font-medium text-lg">{player.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile picture" />
                            <AvatarFallback>{player.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">{player.score.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
