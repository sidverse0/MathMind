
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { useUser } from '@/contexts/user-context';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const DottedSpinner = ({ className }: { className?: string }) => {
    const dots = Array.from({ length: 8 });
    return (
        <motion.div
            className={className}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
            {dots.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-full h-full"
                    style={{ transform: `rotate(${i * 45}deg)` }}
                >
                    <motion.div
                        className="w-2 h-2 bg-primary rounded-full"
                        style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * (1.5 / dots.length),
                            ease: 'easeInOut'
                        }}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default function LoginPage() {
  const { user, loading, signInWithEmail, signUpWithEmail } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const [isLoginView, setIsLoginView] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
        router.push('/app');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center gap-6"
        >
            <div className="relative w-36 h-36">
                <DottedSpinner className="absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    >
                        <Image
                            src="https://files.catbox.moe/35yrt5.png"
                            alt="Loading Icon"
                            width={80}
                            height={80}
                            className="rounded-full border-4 border-primary/50 shadow-lg"
                        />
                    </motion.div>
                </div>
            </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Securing your session...</h2>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isLoginView) {
        await signInWithEmail(email, password);
        router.push('/app');
      } else {
        await signUpWithEmail(email, password, name);
        router.push('/app');
      }
    } catch (error: any) {
        let errorMessage = "Please check your credentials and try again.";
        if (error.code === 'auth/network-request-failed' || error.code === 'auth/web-storage-unsupported' || error.code === 'auth/operation-not-allowed') {
            errorMessage = "A network or configuration error occurred. Please ensure your domain is authorized in Firebase.";
        } else if (error.message) {
            errorMessage = error.message;
        }
      
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: errorMessage,
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="max-w-md w-full shadow-2xl border-2 border-primary/10">
          <CardHeader className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="flex justify-center mb-6"
            >
                <div className="p-3 bg-primary/10 rounded-full inline-block ring-8 ring-primary/5 relative h-24 w-24">
                    <motion.div
                        className="relative h-full w-full"
                        animate={{ rotate: [0, 5, -5, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                       <Image 
                            src="https://files.catbox.moe/35yrt5.png" 
                            alt="MathMind App Icon"
                            fill
                            className="rounded-full"
                       />
                    </motion.div>
                </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold">
              {isLoginView ? 'Welcome Back!' : 'Create an Account'}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              {isLoginView ? 'Sign in to continue your journey.' : 'Join MathMind and start learning!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLoginView && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              )}
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10"
                  />
                </div>
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg shadow-lg hover:shadow-primary/30 transition-shadow mt-4"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        {isLoginView ? 'Signing In...' : 'Creating Account...'}
                    </>
                ) : (
                    isLoginView ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLoginView ? "Don't have an account?" : 'Already have an account?'}
                <Button variant="link" onClick={() => setIsLoginView(!isLoginView)} className="font-semibold">
                  {isLoginView ? 'Sign Up' : 'Sign In'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
