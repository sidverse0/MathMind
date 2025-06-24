import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Zap, Shield, Wand2 } from "lucide-react";
import Image from 'next/image';


const shopItems = [
    { name: "Extra Time", description: "Get 5 extra seconds in the solve phase.", price: 50, icon: <Zap/>, image: "https://placehold.co/300x200.png", hint: "lightning bolt" },
    { name: "Mistake Shield", description: "Your first mistake won't end the streak.", price: 100, icon: <Shield/>, image: "https://placehold.co/300x200.png", hint: "shield" },
    { name: "Number Reveal", description: "Briefly see the numbers one more time.", price: 200, icon: <Wand2/>, image: "https://placehold.co/300x200.png", hint: "magic wand" },
];

export default function ShopPage() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight">Power-up Shop</h1>
            <p className="text-muted-foreground mt-1">Spend your coins on helpful power-ups.</p>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary">
            <Coins className="w-6 h-6 text-yellow-500" /> 
            <span className="text-xl font-bold">573</span>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shopItems.map(item => (
            <Card key={item.name}>
                <CardHeader>
                    <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                      <Image src={item.image} alt={item.name} fill={true} style={{objectFit: 'cover'}} data-ai-hint={item.hint}/>
                    </div>
                    <CardTitle className="flex items-center gap-2">{item.icon} {item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">
                        Buy for <Coins className="w-4 h-4 mx-1.5" /> {item.price}
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
