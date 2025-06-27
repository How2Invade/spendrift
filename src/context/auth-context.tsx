// src/context/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication Error:", error);
    let message = "An unexpected error occurred.";
    switch (error.code) {
        case 'auth/invalid-email':
            message = "Please enter a valid email address.";
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            message = "Invalid credentials. Please check your email and password.";
            break;
        case 'auth/email-already-in-use':
            message = "An account with this email already exists.";
            break;
        default:
            message = "Authentication failed. Please try again.";
            break;
    }
    toast({ variant: 'destructive', title: 'Authentication Failed', description: message });
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
      toast({ title: "Welcome back!", description: "You've successfully signed in." });
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create a document for the new user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        points: 100, // Starting points
        createdAt: new Date(),
      });
      router.push('/dashboard');
      toast({ title: "Account Created!", description: "Welcome to SpenDrift!" });
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Sign Out Error:", error);
      toast({ variant: 'destructive', title: 'Error Signing Out', description: 'Please try again.' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
