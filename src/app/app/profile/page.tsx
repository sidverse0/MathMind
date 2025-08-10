
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins, Star, BarChart, Clock, Target, Edit, BadgeCheck, Save, LogOut, CalendarDays, Instagram, Youtube, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser, type UserData } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 2l-7 20-4-9-9-4Z"/><path d="M22 2L11 13"/>
    </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
);


export default function ProfilePage() {
  const { userData, updateUserData, signOut } = useUser();
  const router = useRouter();
  const [tempName, setTempName] = useState(userData?.name || '');
  const [tempGender, setTempGender] = useState<'male' | 'female'>(userData?.gender || 'male');
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    if (userData) {
      setTempName(userData.name || '');
      setTempGender(userData.gender || 'male');

      const fetchRank = async () => {
        if (!db) return;
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('score', 'desc'));
        const querySnapshot = await getDocs(q);
        const allUsers = querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }) as UserData);
        const rank = allUsers.findIndex(p => p.uid === userData.uid) + 1;
        setUserRank(rank > 0 ? rank : null);
      }
      fetchRank();
    }
  }, [userData]);

  const handleSaveChanges = () => {
    if (userData) {
      const newAvatar = tempGender === 'female' ? 'https://files.catbox.moe/rv4git.jpg' : 'https://files.catbox.moe/uvi8l9.png';
      updateUserData({ name: tempName, gender: tempGender, avatar: newAvatar });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const statItems = [
    { label: "Total Score", value: (userData?.score ?? 0).toLocaleString(), icon: <Trophy className="h-6 w-6 text-orange-400"/> },
    { label: "Coins", value: (userData?.coins ?? 0).toLocaleString(), icon: <Coins className="h-6 w-6 text-yellow-400"/> },
    { label: "Global Rank", value: userRank ? `#${userRank}` : '...', icon: <Star className="h-6 w-6 text-indigo-400"/> },
    { label: "Top Skill", value: "Addition", icon: <BarChart className="h-6 w-6 text-blue-400"/> },
    { label: "Avg. Time", value: "4.2s", icon: <Clock className="h-6 w-6 text-red-400"/> },
    { label: "Accuracy", value: "88%", icon: <Target className="h-6 w-6 text-green-400"/> }
  ];
  
  const joinedDate = userData?.createdAt ? format(userData.createdAt.toDate(), 'MMMM d, yyyy') : 'today';

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
                                        <Button type="button" variant="outline">Cancel</Button>
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
                        <ThemeToggle />
                    </div>
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Badge variant="secondary" className="text-base font-medium py-1.5 px-4 shadow-sm mt-2">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Mathlete since {joinedDate}
                        </Badge>
                    </motion.div>
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

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        >
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <MessageCircle className="h-6 w-6 text-primary" />
                        Connect with Us
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around items-center p-6 pt-0">
                    <Button asChild variant="outline" size="icon" className="rounded-full h-14 w-14 hover:bg-pink-500/10 hover:border-pink-500/50">
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram className="h-7 w-7" />
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full h-14 w-14 hover:bg-sky-500/10 hover:border-sky-500/50">
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                            <TelegramIcon className="h-7 w-7" />
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full h-14 w-14 hover:bg-green-500/10 hover:border-green-500/50">
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <WhatsAppIcon className="h-7 w-7" />
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full h-14 w-14 hover:bg-red-500/10 hover:border-red-500/50">
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <Youtube className="h-7 w-7" />
                        </a>
                    </Button>
                </CardContent>
            </Card>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
            <Card className="shadow-lg text-center p-6">
                <div className="flex justify-center mb-4">
                    <div className="p-2 bg-primary/10 rounded-full inline-block ring-4 ring-primary/5">
                        <Image src="https://files.catbox.moe/35yrt5.png" alt="App Logo" width={64} height={64} className="rounded-full" />
                    </div>
                </div>
                <CardTitle className="text-2xl">MathMind</CardTitle>
                <CardDescription className="text-base mt-1">Turning Math into Magic!</CardDescription>
            </Card>
        </motion.div>

        <motion.div
            className="flex justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
            <Button 
              variant="outline" 
              className="shadow-lg border-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:shadow-lg hover:shadow-destructive/20" 
              onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="flex flex-col items-center gap-4"
        >
            <div className="w-full max-w-sm h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="flex items-center gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer" className="group">
                  <div className="relative w-10 h-10">
                      <Image 
                          src="https://files.catbox.moe/j7lhm0.png" 
                          alt="Owner" 
                          fill 
                          className="rounded-full object-cover border-2 border-primary/50 shadow-md transition-transform group-hover:scale-105"
                      />
                  </div>
              </a>
              <p className="text-sm text-muted-foreground">
                  made by{' '}
                  <a 
                      href="#"
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-teal-500 hover:opacity-80 transition-opacity"
                  >
                  sidverse
                  </a>
              </p>
            </div>
        </motion.div>
    </div>
  );
}
