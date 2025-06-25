
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// This interface is a subset of the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            // Check if the prompt has been dismissed before in this session
            const dismissedInSession = sessionStorage.getItem('pwa_install_dismissed');
            if (!dismissedInSession) {
                setInstallPrompt(e as BeforeInstallPromptEvent);
                setIsVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // This handles the case where the app is already installed
        window.addEventListener('appinstalled', () => {
            setIsVisible(false);
            setInstallPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', () => {});
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        await installPrompt.prompt();
        // The prompt is consumed and won't be fired again
        setIsVisible(false);
        setInstallPrompt(null);
    };

    const handleDismissClick = () => {
        // Remember dismissal for this session
        sessionStorage.setItem('pwa_install_dismissed', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && installPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="fixed bottom-4 right-4 z-50 w-full max-w-sm"
                >
                    <Card className="shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <CardHeader className="p-4 flex flex-row items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl ring-4 ring-primary/5">
                                    <BrainCircuit className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Install MathMind</CardTitle>
                                    <CardDescription>Get the full app experience.</CardDescription>
                                </div>
                            </div>
                             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDismissClick}>
                                <X className="h-4 w-4" />
                                <span className="sr-only">Dismiss</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Button className="w-full" onClick={handleInstallClick}>
                                <Download className="mr-2 h-4 w-4" />
                                Install App
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
