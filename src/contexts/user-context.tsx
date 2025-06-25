
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, Unsubscribe, updateDoc } from 'firebase/firestore';
import type { PowerUpType } from '@/lib/types';

export interface UserData {
  uid: string;
  email: string | null;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  coins: number;
  difficulty: number;
  inventory: Record<PowerUpType, number>;
  score: number;
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultInventory = {
    extraTime: 0,
    mistakeShield: 0,
    numberReveal: 0,
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If firebase is not configured, don't do anything
    if (!auth || !db) {
        console.warn("Firebase is not configured. Please add your Firebase credentials to the .env file.");
        setLoading(false);
        return;
    }

    let unsubscribe: Unsubscribe | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = doc(db, 'users', authUser.uid);
        
        if (unsubscribe) unsubscribe();

        unsubscribe = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            const newUser: UserData = {
              uid: authUser.uid,
              email: authUser.email,
              name: authUser.displayName || 'Mathlete',
              avatar: authUser.photoURL || 'https://files.catbox.moe/uvi8l9.png',
              gender: 'male',
              coins: 500,
              difficulty: 5,
              inventory: defaultInventory,
              score: 0,
            };
            await setDoc(userRef, newUser);
            setUserData(newUser);
          }
        });
      } else {
        setUser(null);
        setUserData(null);
        if (unsubscribe) unsubscribe();
      }
      setLoading(false);
    });

    return () => {
        authUnsubscribe();
        if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
        console.error("Firebase is not configured. Please add your Firebase credentials to the .env file.");
        return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };
  
  const updateUserData = async (data: Partial<UserData>) => {
    if (user && db) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, data);
    }
  };

  const value = { user, userData, loading, signInWithGoogle, signOut, updateUserData };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
