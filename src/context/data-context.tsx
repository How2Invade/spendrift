'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Transaction as LibTransaction, Goal as LibGoal } from '@/lib/types';
import { Transaction as SupaTransaction, Goal as SupaGoal, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './auth-context';

interface DataContextProps {
  transactions: LibTransaction[];
  goals: LibGoal[];
  points: number;
  addTransaction: (transaction: Omit<LibTransaction, 'id' | 'emotionalState'>) => Promise<void>;
  addGoal: (goal: Omit<LibGoal, 'id' | 'progress' | 'isCompleted'>) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  editGoal: (goalId: string, updates: Partial<LibGoal>) => Promise<void>;
  awardPoints: (amount: number, reason: string) => Promise<void>;
  redeemPoints: (cost: number) => Promise<boolean>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  
  const [transactions, setTransactions] = useState<LibTransaction[]>([]);
  const [goals, setGoals] = useState<LibGoal[]>([]);
  const [points, setPoints] = useState(0);

  // Convert Supabase transaction to lib transaction
  const convertSupaToLibTransaction = (supaTransaction: SupaTransaction): LibTransaction => ({
    id: supaTransaction.id,
    amount: Math.abs(supaTransaction.amount),
    description: supaTransaction.description,
    category: supaTransaction.category,
    date: supaTransaction.date,
    type: supaTransaction.amount >= 0 ? 'income' : 'expense',
    emotionalState: supaTransaction.emotional_state as 'impulse' | 'need' | 'want' || undefined,
  });

  // Convert Supabase goal to lib goal
  const convertSupaToLibGoal = (supaGoal: SupaGoal): LibGoal => ({
    id: supaGoal.id,
    title: supaGoal.title,
    description: supaGoal.description || '',
    emoji: getEmojiForCategory(supaGoal.category),
    progress: supaGoal.progress,
    points: supaGoal.points,
    isCompleted: supaGoal.is_completed,
  });

  // Helper function to get emoji for category
  const getEmojiForCategory = (category: string): string => {
    const emojiMap: { [key: string]: string } = {
      'food': '🍕',
      'transport': '🚗',
      'entertainment': '🎬',
      'shopping': '🛍️',
      'health': '🏥',
      'education': '📚',
      'savings': '💰',
      'travel': '✈️',
      'other': '📦'
    };
    return emojiMap[category.toLowerCase()] || '📦';
  };

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setGoals([]);
      setPoints(0);
      return;
    }

    // Set points from user profile
    if (userProfile && typeof userProfile.points === 'number') {
      setPoints(userProfile.points);
    }

    // Load transactions
    loadTransactions();

    // Load goals
    loadGoals();

    // Subscribe to real-time changes
    const transactionsChannel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTransactions();
        }
      )
      .subscribe();

    const goalsChannel = supabase
      .channel('goals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadGoals();
        }
      )
      .subscribe();

    const userProfileChannel = supabase
      .channel('user_profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'points' in payload.new) {
            setPoints((payload.new as any).points);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(goalsChannel);
      supabase.removeChannel(userProfileChannel);
    };
  }, [user, userProfile]);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const libTransactions = data?.map(convertSupaToLibTransaction) || [];
      setTransactions(libTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const libGoals = data?.map(convertSupaToLibGoal) || [];
      setGoals(libGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const addTransaction = async (transaction: Omit<LibTransaction, 'id' | 'emotionalState'>) => {
    if (!user) return;
    
    // Optimistically update UI
    setTransactions(prev => [
      {
        ...transaction,
        id: 'temp-' + Date.now(),
        emotionalState: undefined,
      },
      ...prev,
    ]);

    try {
      const supaTransaction = {
        user_id: user.id,
        amount: transaction.type === 'expense' ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date,
        emotional_state: null, // Will be set by AI analysis later
      };

      const { error } = await supabase
        .from('transactions')
        .insert(supaTransaction);

      if (error) throw error;

      toast({ title: "Transaction Added!", description: "Your expense has been recorded." });
    } catch (error) {
      console.error("Error adding transaction: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add transaction." });
    }
  };

  const addGoal = async (goal: Omit<LibGoal, 'id' | 'progress' | 'isCompleted'>) => {
    if (!user) return;

    // Optimistically add to local state
    const tempGoal = {
      ...goal,
      id: 'temp-' + Date.now(),
      progress: 0,
      isCompleted: false,
    };
    setGoals(prev => [tempGoal, ...prev]);

    try {
      const supaGoal = {
        user_id: user.id,
        title: goal.title,
        description: goal.description || null,
        target_amount: 1000,
        current_amount: 0,
        deadline: null,
        category: getCategoryFromEmoji(goal.emoji),
        points: goal.points,
        progress: 0,
        is_completed: false,
      };

      const { data, error } = await supabase
        .from('goals')
        .insert(supaGoal)
        .select();

      if (error) throw error;

      // Replace temp goal with real one from DB
      if (data && data[0]) {
        setGoals(prev => [
          { ...tempGoal, ...data[0], id: data[0].id },
          ...prev.filter(g => g.id !== tempGoal.id),
        ]);
      }

      toast({ title: "Goal Added!", description: "Let's start working on it!" });
    } catch (error) {
      // Remove temp goal if error
      setGoals(prev => prev.filter(g => g.id !== tempGoal.id));
      console.error("Error adding goal: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add goal." });
    }
  };

  // Helper function to get category from emoji
  const getCategoryFromEmoji = (emoji: string): string => {
    const categoryMap: { [key: string]: string } = {
      '🍕': 'food',
      '🚗': 'transport',
      '🎬': 'entertainment',
      '🛍️': 'shopping',
      '🏥': 'health',
      '📚': 'education',
      '💰': 'savings',
      '✈️': 'travel',
    };
    return categoryMap[emoji] || 'other';
  };

  const completeGoal = async (goalId: string) => {
    if (!user) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal || goal.isCompleted) return;

    try {
      // Update goal
      const { error: goalError } = await supabase
        .from('goals')
        .update({
          is_completed: true,
          progress: 100,
        })
        .eq('id', goalId);

      if (goalError) throw goalError;

      // Update user points
      const newPoints = points + goal.points;
      const { error: userError } = await supabase
        .from('user_profiles')
        .update({
          points: newPoints
        })
        .eq('id', user.id);

      if (userError) throw userError;
      
      toast({
        title: 'Goal Completed! 🎉',
        description: `You've earned ${goal.points} Zen Points! Keep it up!`,
      });
    } catch (error) {
      console.error("Error completing goal: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not complete goal." });
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      // Update goal
      const { error: goalError } = await supabase
        .from('goals')
        .update({
          is_completed: false,
          progress: 0,
        })
        .eq('id', goalId);

      if (goalError) throw goalError;

      // Update user points
      const newPoints = points - goal.points;
      const { error: userError } = await supabase
        .from('user_profiles')
        .update({
          points: newPoints
        })
        .eq('id', user.id);

      if (userError) throw userError;
      
      toast({
        title: 'Goal Deleted!',
        description: `You've lost ${goal.points} Zen Points.`,
      });
    } catch (error) {
      console.error("Error deleting goal: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete goal." });
    }
  };

  const editGoal = async (goalId: string, updates: Partial<LibGoal>) => {
    if (!user) return;
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      // Update goal
      const { error: goalError } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId);

      if (goalError) throw goalError;

      // Update user points
      const newPoints = points + (updates.points || 0) - goal.points;
      const { error: userError } = await supabase
        .from('user_profiles')
        .update({
          points: newPoints
        })
        .eq('id', user.id);

      if (userError) throw userError;
      
      toast({
        title: 'Goal Updated!',
        description: `You've earned ${updates.points || 0} Zen Points!`,
      });
    } catch (error) {
      console.error("Error editing goal: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not edit goal." });
    }
  };

  const awardPoints = async (amount: number, reason: string) => {
    if (!user) return;
    
    try {
      console.log('Awarding points:', amount, 'for reason:', reason);
      console.log('Current points:', points);
      
      // Optimistically update local state
      const newPoints = points + amount;
      setPoints(newPoints);
      
      // Update user points in database
      const { error: userError } = await supabase
        .from('user_profiles')
        .update({
          points: newPoints
        })
        .eq('id', user.id);

      if (userError) {
        console.error('Error updating points in database:', userError);
        // Revert local state if database update failed
        setPoints(points);
        throw userError;
      }
      
      console.log('Points updated successfully in database to:', newPoints);
      
      toast({
        title: 'Points Awarded! 🎉',
        description: `You've earned ${amount} Zen Points! Reason: ${reason}`,
      });
    } catch (error) {
      console.error("Error awarding points: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not award points." });
    }
  };

  const redeemPoints = async (cost: number) => {
    if (!user) return false;
    if (points < cost) return false;
    const newPoints = points - cost;
    setPoints(newPoints);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ points: newPoints })
        .eq('id', user.id);
      if (error) {
        setPoints(points); // revert
        toast({ variant: 'destructive', title: 'Error', description: 'Could not redeem reward.' });
        return false;
      }
      return true;
    } catch (e) {
      setPoints(points); // revert
      toast({ variant: 'destructive', title: 'Error', description: 'Could not redeem reward.' });
      return false;
    }
  };

  return (
    <DataContext.Provider value={{ transactions, goals, points, addTransaction, addGoal, completeGoal, deleteGoal, editGoal, awardPoints, redeemPoints }}>
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
