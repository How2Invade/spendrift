'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Transaction, Goal } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

interface DataContextProps {
  transactions: Transaction[];
  goals: Goal[];
  points: number;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'emotionalState'>) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'isCompleted'>) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setGoals([]);
      setPoints(0);
      return;
    }

    // Listener for user data (points)
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
            setPoints(doc.data().points || 0);
        }
    });

    // Listener for transactions
    const transactionsColRef = collection(db, 'users', user.uid, 'transactions');
    const transactionsQuery = query(transactionsColRef, orderBy('date', 'desc'));
    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const userTransactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(userTransactions);
    });

    // Listener for goals
    const goalsColRef = collection(db, 'users', user.uid, 'goals');
    const unsubscribeGoals = onSnapshot(goalsColRef, (snapshot) => {
      const userGoals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      setGoals(userGoals);
    });

    // Cleanup subscriptions on unmount or user change
    return () => {
        unsubscribeUser();
        unsubscribeTransactions();
        unsubscribeGoals();
    };

  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'emotionalState'>) => {
    if (!user) return;
    try {
        const transactionsColRef = collection(db, 'users', user.uid, 'transactions');
        await addDoc(transactionsColRef, {
            ...transaction,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding transaction: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not add transaction." });
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'progress' | 'isCompleted'>) => {
    if (!user) return;
    try {
        const newGoal = {
            ...goal,
            progress: 0,
            isCompleted: false,
            createdAt: serverTimestamp()
        };
        const goalsColRef = collection(db, 'users', user.uid, 'goals');
        await addDoc(goalsColRef, newGoal);
        toast({ title: "Goal Added!", description: "Let's start working on it!" });
    } catch (error) {
        console.error("Error adding goal: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not add goal." });
    }
  };

  const completeGoal = async (goalId: string) => {
    if (!user) return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal || goal.isCompleted) return;

    try {
        const goalRef = doc(db, 'users', user.uid, 'goals', goalId);
        await updateDoc(goalRef, {
            isCompleted: true,
            progress: 100,
        });

        const userRef = doc(db, 'users', user.uid);
        const newPoints = points + goal.points;
        await updateDoc(userRef, {
            points: newPoints
        });
        
        toast({
            title: 'Goal Completed! 🎉',
            description: `You've earned ${goal.points} Zen Points! Keep it up!`,
        });
    } catch (error) {
        console.error("Error completing goal: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not complete goal." });
    }
  };

  return (
    <DataContext.Provider value={{ transactions, goals, points, addTransaction, addGoal, completeGoal }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
