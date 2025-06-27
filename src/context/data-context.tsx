'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction, Goal } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface DataContextProps {
  transactions: Transaction[];
  goals: Goal[];
  points: number;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'emotionalState'>) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'isCompleted'>) => void;
  completeGoal: (goalId: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'No-Swiggy Week',
      description: 'Avoid ordering from Swiggy/Zomato for 7 days straight.',
      emoji: '🍔',
      progress: 0,
      points: 50,
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Save for Concert',
      description: 'Put aside ₹5,000 for that upcoming concert.',
      emoji: '🎤',
      progress: 0,
      points: 100,
      isCompleted: false,
    },
  ]);
  const [points, setPoints] = useState(100);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'emotionalState'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'progress' | 'isCompleted'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      progress: 0,
      isCompleted: false,
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const completeGoal = (goalId: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId && !goal.isCompleted) {
          setPoints(prevPoints => prevPoints + goal.points);
          toast({
            title: 'Goal Completed! 🎉',
            description: `You've earned ${goal.points} Zen Points! Keep it up!`,
          });
          return { ...goal, isCompleted: true, progress: 100 };
        }
        return goal;
      })
    );
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
