// src/context/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  AuthError 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
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
        case 'auth/popup-closed-by-user':
            message = "Sign-in was cancelled. Please try again.";
            break;
        case 'auth/popup-blocked':
            message = "Pop-up was blocked. Please allow pop-ups and try again.";
            break;
        case 'auth/account-exists-with-different-credential':
            message = "An account already exists with this email address.";
            break;
        case 'auth/cancelled-popup-request':
            message = "Only one sign-in popup is allowed at a time.";
            break;
        default:
            message = "Authentication failed. Please try again.";
            break;
    }
    toast({ variant: 'destructive', title: 'Authentication Failed', description: message });
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create one
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create a document for the new user in Firestore
        await setDoc(userDocRef, {
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          points: 100, // Starting points
          createdAt: new Date(),
          provider: 'google'
        });
        toast({ title: "Welcome to SpenDrift!", description: "Your account has been created successfully." });
      } else {
        toast({ title: "Welcome back!", description: "You've successfully signed in." });
      }
      
      router.push('/dashboard');
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
      toast({ title: "Signed Out", description: "You've been successfully signed out." });
    } catch (error) {
      console.error("Sign Out Error:", error);
      toast({ variant: 'destructive', title: 'Error Signing Out', description: 'Please try again.' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
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
