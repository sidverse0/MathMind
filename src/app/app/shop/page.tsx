'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Zap, Shield, Wand2 } from "lucide-react";
import Image from 'next/image';
import { motion } from 'framer-motion';

const shopItems = [
    { name: "Extra Time", description: "Get 5 extra seconds in the solve phase.", price: 50, icon: <Zap/>, image: "https://placehold.co/300x200.png", hint: "lightning bolt" },
    { name: "Mistake Shield", description: "Your first mistake won't end the streak.", price: 100, icon: <Shield/>, image: "https://placehold.co/300x200.png", hint: "glowing shield" },
    { name: "Number Reveal", description: "Briefly see the numbers one more time.", price: 200, icon: <Wand2/>, image: "https://placehold.co/300x200.png", hint: "magic eye" },
];

export default function ShopPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15
          }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: { y: 0, opacity: 1, scale: 1 }
    };

  return (
    <div className="flex flex-col gap-8">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
      >
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Power-up Shop</h1>
            <p className="text-muted-foreground mt-1">Spend your coins on helpful power-ups.</p>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-background shadow-md border">
            <Coins className="w-8 h-8 text-yellow-500" /> 
            <span className="text-2xl font-bold">573</span>
            <span className="text-muted-foreground">Coins</span>
        </div>
      </motion.div>
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {shopItems.map(item => (
            <motion.div
                key={item.name}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/50 group overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="relative h-48 w-full mb-4 overflow-hidden">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill={true} 
                            style={{objectFit: 'cover'}} 
                            data-ai-hint={item.hint}
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                            <CardTitle className="flex items-center gap-2 text-2xl">{item.icon} {item.name}</CardTitle>
                            <CardDescription className="mt-2">{item.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter className="mt-auto p-6 bg-secondary/50">
                        <Button className="w-full text-lg shadow-md hover:shadow-lg transition-shadow">
                            Buy for <Coins className="w-5 h-5 mx-2" /> {item.price}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
