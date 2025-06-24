'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins, Star, BarChart, Clock, Target, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statItems = [
    { label: "Total Score", value: "14,500", icon: <Trophy className="h-8 w-8 text-orange-400"/> },
    { label: "Coins", value: "573", icon: <Coins className="h-8 w-8 text-yellow-400"/> },
    { label: "Global Rank", value: "#3", icon: <Star className="h-8 w-8 text-indigo-400"/> },
    { label: "Top Skill", value: "Addition", icon: <BarChart className="h-8 w-8 text-blue-400"/> },
    { label: "Avg. Time", value: "4.2s", icon: <Clock className="h-8 w-8 text-red-400"/> },
    { label: "Accuracy", value: "88%", icon: <Target className="h-8 w-8 text-green-400"/> }
];

export default function ProfilePage() {
  const [name, setName] = useState("Your Name");
  const [tempName, setTempName] = useState(name);

  const handleSaveChanges = () => {
    setName(tempName);
  };

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
                            <AvatarImage src="https://files.catbox.moe/uvi8l9.png" alt="User Avatar" />
                            <AvatarFallback className="text-4xl">YOU</AvatarFallback>
                        </Avatar>
                    </motion.div>
                </div>
                <CardHeader className="pt-20 text-center">
                    <CardTitle className="text-4xl">{name}</CardTitle>
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button onClick={() => setTempName(name)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input id="name" value={tempName} onChange={(e) => setTempName(e.target.value)} className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}
