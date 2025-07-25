// src/context/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, type UserProfile } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Set a shorter timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - forcing loading state to false');
        setLoading(false);
      }
    }, 3000); // Reduced to 3 seconds
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
      clearTimeout(timeoutId);
    }).catch((error) => {
      console.error('Auth session error:', error);
      setLoading(false);
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
        
        // If this is a new user or email confirmation, show welcome message
        if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
          toast({ 
            title: "Welcome back!", 
            description: "You've successfully signed in." 
          });
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error loading user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleAuthError = (error: any) => {
    console.error("Authentication Error:", error);
    let message = "An unexpected error occurred.";
    
    if (error?.message) {
      if (error.message.includes('popup')) {
        message = "Sign-in was cancelled or blocked. Please try again.";
      } else if (error.message.includes('network')) {
        message = "Network error. Please check your connection and try again.";
      } else {
        message = error.message;
      }
    }
    
    toast({ 
      variant: 'destructive', 
      title: 'Authentication Failed', 
      description: message 
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast({ 
        title: "Welcome back!", 
        description: "You've successfully signed in." 
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });

      if (error) {
        throw error;
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        toast({ 
          title: "Check your email!", 
          description: "We've sent you a confirmation link to complete your registration." 
        });
      } else {
        toast({ 
          title: "Welcome to SpenDrift!", 
          description: "Your account has been created successfully." 
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
      
      // Note: For OAuth, the user will be redirected, so we won't reach this point
      // The actual user creation happens in the onAuthStateChange callback
      
    } catch (error) {
      handleAuthError(error);
      setLoading(false);
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        photo_url: user.user_metadata?.avatar_url || null,
        points: 100, // Starting points
        created_at: new Date().toISOString(),
        provider: user.app_metadata?.provider || 'email'
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(userProfile, { onConflict: 'id' });

      if (error) {
        console.error('Error creating user profile:', error);
      } else {
        setUserProfile(userProfile);
        toast({ 
          title: "Welcome to SpenDrift!", 
          description: "Your account has been set up successfully." 
        });
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const signOut = async () => {
    try {
      console.log("Sign out triggered");
      toast({ title: "Sign Out Triggered", description: "Processing sign out..." });
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({ 
          variant: 'destructive', 
          title: 'Error Signing Out', 
          description: error.message || 'Please try again.' 
        });
        console.error("Supabase signOut error:", error);
        return;
      }
      // Force clear Supabase session from localStorage and cookies
      try {
        localStorage.removeItem('supabase.auth.token');
        // Remove all keys that start with 'sb-' (Supabase v2+)
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sb-')) localStorage.removeItem(key);
        });
      } catch (e) {
        console.warn('Could not clear Supabase session from localStorage:', e);
      }
      setUser(null);
      setUserProfile(null);
      router.replace('/'); // Redirect to main landing page
      toast({ 
        title: "Signed Out", 
        description: "You've been successfully signed out." 
      });
    } catch (error) {
      console.error("Sign Out Error:", error);
      toast({ 
        variant: 'destructive', 
        title: 'Error Signing Out', 
        description: 'Please try again.' 
      });
    }
  };

  // Create user profile when user signs in for the first time
  useEffect(() => {
    if (user && !userProfile && !loading) {
      createUserProfile(user);
    }
  }, [user, userProfile, loading]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
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
