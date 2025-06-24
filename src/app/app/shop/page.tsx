'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Zap, Shield, Eye, Package, ShoppingCart } from "lucide-react";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import type { PowerUpType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const COINS_KEY = 'mathmagix_coins';
const INVENTORY_KEY = 'mathmagix_inventory';
const DEFAULT_COINS = 500;

const shopItems: { name: string; type: PowerUpType; description: string; price: number; icon: React.ReactNode; image: string; hint: string }[] = [
    { name: "Extra Time", type: 'extraTime', description: "Get 5 extra seconds in the solve phase.", price: 50, icon: <Zap/>, image: "https://files.catbox.moe/hi5fse.png", hint: "lightning bolt" },
    { name: "Mistake Shield", type: 'mistakeShield', description: "Your first mistake won't count against you.", price: 100, icon: <Shield/>, image: "https://files.catbox.moe/ixplmb.jpg", hint: "glowing shield" },
    { name: "Number Reveal", type: 'numberReveal', description: "Briefly see the numbers one more time.", price: 200, icon: <Eye/>, image: "https://files.catbox.moe/p4i1e6.png", hint: "magic eye" },
];

const getInitialInventory = (): Record<PowerUpType, number> => ({
    extraTime: 0,
    mistakeShield: 0,
    numberReveal: 0
});

export default function ShopPage() {
    const { toast } = useToast();
    const [coins, setCoins] = useState(DEFAULT_COINS);
    const [inventory, setInventory] = useState<Record<PowerUpType, number>>(getInitialInventory());

    useEffect(() => {
        const storedCoins = localStorage.getItem(COINS_KEY);
        setCoins(storedCoins ? parseInt(storedCoins, 10) : DEFAULT_COINS);

        const storedInventory = localStorage.getItem(INVENTORY_KEY);
        setInventory(storedInventory ? JSON.parse(storedInventory) : getInitialInventory());
    }, []);

    const handleBuy = (item: typeof shopItems[0]) => {
        if (coins >= item.price) {
            const newCoins = coins - item.price;
            const newInventory = { ...inventory, [item.type]: inventory[item.type] + 1 };

            setCoins(newCoins);
            setInventory(newInventory);
            
            localStorage.setItem(COINS_KEY, String(newCoins));
            localStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory));
            
            // This event tells other open tabs/components to update their state
            window.dispatchEvent(new Event('storage'));

            toast({
                title: "Purchase Successful!",
                description: `You bought 1 x ${item.name}.`,
            });
        } else {
            toast({
                title: "Not enough coins!",
                description: "Play more challenges to earn more coins.",
                variant: "destructive",
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3"><ShoppingCart className="h-8 w-8 text-primary" />Power-up Shop</h1>
            <p className="text-muted-foreground mt-2 text-base">Spend your coins on helpful power-ups.</p>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-background shadow-lg border-2 border-yellow-400/50">
            <Coins className="w-8 h-8 text-yellow-500" /> 
            <span className="text-3xl font-bold tracking-tight">{coins.toLocaleString()}</span>
            <span className="text-muted-foreground self-end pb-1">Coins</span>
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
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/50 group overflow-hidden relative">
                    <Badge variant="secondary" className="absolute top-4 right-4 z-10 shadow-lg text-base py-1 px-3">
                        <Package className="h-4 w-4 mr-2"/> Owned: {inventory[item.type]}
                    </Badge>
                    <CardHeader className="p-0">
                        <div className="relative h-48 w-full mb-4 overflow-hidden">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill={true} 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{objectFit: 'cover'}} 
                            data-ai-hint={item.hint}
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                            <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">{item.icon} {item.name}</CardTitle>
                            <CardDescription className="mt-2 text-base h-12">{item.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter className="mt-auto p-6 bg-secondary/50">
                        <Button 
                          className="w-full text-base md:text-lg shadow-md hover:shadow-lg transition-shadow" 
                          onClick={() => handleBuy(item)}
                          disabled={coins < item.price}
                        >
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
