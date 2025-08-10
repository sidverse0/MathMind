
'use client';

import type { User, UserCredential } from 'firebase/auth';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
    onAuthStateChanged, 
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, Unsubscribe, updateDoc, Timestamp } from 'firebase/firestore';
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
  createdAt?: Timestamp;
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<UserCredential>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<UserCredential>;
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
    if (!auth || !db) {
        console.warn("Firebase is not configured. Please add your Firebase credentials to the .env file.");
        setLoading(false);
        return;
    }

    let unsubscribe: Unsubscribe | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = doc(db, 'users', authUser.uid);
        
        if (unsubscribe) unsubscribe();

        unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fullInventory = { ...defaultInventory, ...(data.inventory || {}) };
            setUserData({ ...data, inventory: fullInventory } as UserData);
            setLoading(false);
          } else {
             setLoading(false);
          }
        });
      } else {
        setUser(null);
        setUserData(null);
        if (unsubscribe) unsubscribe();
        setLoading(false);
      }
    });

    return () => {
        authUnsubscribe();
        if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not configured");
    return signInWithEmailAndPassword(auth, email, pass);
  }

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!auth || !db) throw new Error("Firebase not configured");

    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const authUser = userCredential.user;

    await updateProfile(authUser, { displayName: name });
    
    const newUser: UserData = {
      uid: authUser.uid,
      email: authUser.email,
      name: name,
      avatar: 'https://files.catbox.moe/uvi8l9.png',
      gender: 'male',
      coins: 500,
      difficulty: 5,
      inventory: defaultInventory,
      score: 0,
      createdAt: Timestamp.now(),
    };
    
    const userRef = doc(db, 'users', authUser.uid);
    await setDoc(userRef, newUser);

    setUserData(newUser); // Manually set user data to avoid race condition

    return userCredential;
  }

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

  const value = { user, userData, loading, signInWithEmail, signUpWithEmail, signOut, updateUserData };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
