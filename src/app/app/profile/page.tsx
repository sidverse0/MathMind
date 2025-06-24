'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins, Star, BarChart, Clock, Target, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const statItems = [
    { label: "Total Score", value: "14,500", icon: <Trophy className="h-6 w-6 text-orange-400"/> },
    { label: "Global Rank", value: "#3", icon: <Star className="h-6 w-6 text-indigo-400"/> },
    { label: "Top Skill", value: "Addition", icon: <BarChart className="h-6 w-6 text-blue-400"/> },
    { label: "Avg. Time", value: "4.2s", icon: <Clock className="h-6 w-6 text-red-400"/> },
    { label: "Accuracy", value: "88%", icon: <Target className="h-6 w-6 text-green-400"/> }
];

export default function ProfilePage() {
  const [name, setName] = useState("Your Name");
  const [tempName, setTempName] = useState(name);
  const [gender, setGender] = useState("male");
  const [tempGender, setTempGender] = useState(gender);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const storedName = localStorage.getItem('mathMindUserName');
    if (storedName) {
      setName(storedName);
      setTempName(storedName);
    }
    const storedGender = localStorage.getItem('mathMindUserGender');
    if (storedGender) {
        setGender(storedGender);
        setTempGender(storedGender);
    }
    const storedCoins = localStorage.getItem('mathmagix_coins');
    setCoins(storedCoins ? parseInt(storedCoins, 10) : 500);

    const handleStorageChange = () => {
        const newCoins = localStorage.getItem('mathmagix_coins');
        setCoins(newCoins ? parseInt(newCoins, 10) : 500);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSaveChanges = () => {
    setName(tempName);
    localStorage.setItem('mathMindUserName', tempName);
    setGender(tempGender);
    localStorage.setItem('mathMindUserGender', tempGender);
    // Trigger a storage event to update other components
    window.dispatchEvent(new Event('storage'));
  };
  
  const avatarUrl = gender === 'female' ? 'https://files.catbox.moe/rv4git.jpg' : 'https://files.catbox.moe/uvi8l9.png';

  const allStats = [
    ...statItems.slice(0, 1),
    { label: "Coins", value: coins.toLocaleString(), icon: <Coins className="h-6 w-6 text-yellow-400"/> },
    ...statItems.slice(1)
  ];

  return (
    <div className="flex flex-col gap-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg overflow-hidden">
                <div className="relative h-36 md:h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                    <motion.div 
                        initial={{ scale: 0, y: 100 }} 
                        animate={{ scale: 1, y: 0 }} 
                        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                    >
                        <Avatar className="h-28 w-28 md:h-32 md:w-32 border-8 border-background shadow-xl">
                            <AvatarImage src={avatarUrl} alt="User Avatar" />
                            <AvatarFallback className="text-4xl">YOU</AvatarFallback>
                        </Avatar>
                    </motion.div>
                </div>
                <CardHeader className="pt-16 md:pt-20 text-center">
                    <div className="flex justify-center items-center gap-2">
                        <CardTitle className="text-3xl md:text-4xl">{name}</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => { setTempName(name); setTempGender(gender); }}>
                                    <Edit className="h-5 w-5 text-muted-foreground" />
                                    <span className="sr-only">Edit name</span>
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="gender" className="text-right">
                                            Gender
                                        </Label>
                                        <RadioGroup
                                            id="gender"
                                            value={tempGender}
                                            onValueChange={setTempGender}
                                            className="col-span-3 flex items-center gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="male" id="male" />
                                                <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="female" id="female" />
                                                <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                                            </div>
                                        </RadioGroup>
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
                    <CardDescription className="text-base">Mathlete since yesterday</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {allStats.map((item, index) => (
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
                                        <p className="text-xl md:text-2xl font-bold">{item.value}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}
