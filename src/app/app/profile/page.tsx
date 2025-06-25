
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins, Star, BarChart, Clock, Target, Edit, BadgeCheck, Save } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/contexts/user-context';

export default function ProfilePage() {
  const { userData, updateUserData } = useUser();
  const [tempName, setTempName] = useState(userData?.name || '');
  const [tempGender, setTempGender] = useState<'male' | 'female'>(userData?.gender || 'male');

  useEffect(() => {
    if (userData) {
      setTempName(userData.name);
      setTempGender(userData.gender);
    }
  }, [userData]);

  const handleSaveChanges = () => {
    if (userData) {
      const newAvatar = tempGender === 'female' ? 'https://files.catbox.moe/rv4git.jpg' : 'https://files.catbox.moe/uvi8l9.png';
      updateUserData({ name: tempName, gender: tempGender, avatar: newAvatar });
    }
  };

  const statItems = [
    { label: "Total Score", value: (userData?.score ?? 0).toLocaleString(), icon: <Trophy className="h-6 w-6 text-orange-400"/> },
    { label: "Coins", value: (userData?.coins ?? 0).toLocaleString(), icon: <Coins className="h-6 w-6 text-yellow-400"/> },
    { label: "Global Rank", value: "#3", icon: <Star className="h-6 w-6 text-indigo-400"/> },
    { label: "Top Skill", value: "Addition", icon: <BarChart className="h-6 w-6 text-blue-400"/> },
    { label: "Avg. Time", value: "4.2s", icon: <Clock className="h-6 w-6 text-red-400"/> },
    { label: "Accuracy", value: "88%", icon: <Target className="h-6 w-6 text-green-400"/> }
  ];

  if (!userData) return <p>Loading profile...</p>

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
                            <AvatarImage src={userData.avatar} alt="User Avatar" />
                            <AvatarFallback className="text-4xl">{userData.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </motion.div>
                </div>
                <CardHeader className="pt-16 md:pt-20 text-center">
                    <div className="flex justify-center items-center gap-2">
                        <CardTitle className="text-3xl md:text-4xl flex items-center gap-2">
                            {userData.name}
                            <BadgeCheck className="h-7 w-7 text-primary" />
                        </CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-5 w-5 text-muted-foreground" />
                                    <span className="sr-only">Edit name</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile and avatar. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="font-semibold text-left">
                                            Username
                                        </Label>
                                        <Input id="name" value={tempName} onChange={(e) => setTempName(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="font-semibold text-left">
                                            Avatar
                                        </Label>
                                        <RadioGroup
                                            value={tempGender}
                                            onValueChange={(value) => setTempGender(value as 'male' | 'female')}
                                            className="grid grid-cols-2 gap-4 pt-2"
                                        >
                                            <div>
                                                <RadioGroupItem value="male" id="male" className="peer sr-only" />
                                                <Label htmlFor="male" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                                                    <Avatar className="h-16 w-16 mb-2">
                                                        <AvatarImage src="https://files.catbox.moe/uvi8l9.png" alt="Male Avatar" />
                                                        <AvatarFallback>M</AvatarFallback>
                                                    </Avatar>
                                                    Male
                                                </Label>
                                            </div>
                                             <div>
                                                <RadioGroupItem value="female" id="female" className="peer sr-only" />
                                                <Label htmlFor="female" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                                                    <Avatar className="h-16 w-16 mb-2">
                                                        <AvatarImage src="https://files.catbox.moe/rv4git.jpg" alt="Female Avatar" />
                                                        <AvatarFallback>F</AvatarFallback>
                                                    </Avatar>
                                                    Female
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button type="submit" onClick={handleSaveChanges}>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <CardDescription className="text-base">Mathlete since today</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
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
