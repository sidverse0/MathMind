import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, Gamepad2, User, Trophy, Coins } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">Ready to challenge your mind?</p>
      </div>

      <Card className="bg-primary/10 border-primary">
        <CardHeader>
            <CardTitle>New Challenge Awaits</CardTitle>
            <CardDescription>Jump back in and continue improving your math skills.</CardDescription>
        </CardHeader>
        <CardContent>
            <Link href="/app/play">
                <Button size="lg">
                    Play Now <Gamepad2 className="ml-2" />
                </Button>
            </Link>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Score
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,500</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Coins Earned
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +180 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Best Category
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Addition</div>
            <p className="text-xs text-muted-foreground">
              88% accuracy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <Link href="/app/profile">
                <Button variant="outline" className="w-full">
                    View Profile <ArrowRight className="ml-2" />
                </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
