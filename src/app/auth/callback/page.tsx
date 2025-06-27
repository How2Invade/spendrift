'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, isSupabaseConfigured, getSupabaseConfigErrors } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking environment...');
        
        // Verify Supabase client is properly configured
        if (!isSupabaseConfigured()) {
          const errors = getSupabaseConfigErrors();
          console.error('Supabase configuration errors:', errors);
          setStatus(`Configuration error: ${errors.join(', ')}`);
          router.push('/auth?error=config_error');
          return;
        }

        setStatus('Processing authentication...');
        
        // Check for code in URL params (email verification)
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('Auth error from URL:', error, errorDescription);
          setStatus('Authentication error');
          router.push(`/auth?error=${error}`);
          return;
        }
        
        if (code) {
          setStatus('Verifying email...');
          
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setStatus('Verification failed');
            router.push('/auth?error=verification_failed');
            return;
          }

          if (data?.session) {
            setStatus('Email verified! Redirecting...');
            // User is now verified and authenticated
            router.push('/dashboard?verified=true');
            return;
          }
        }

        setStatus('Checking session...');
        
        // Fallback: Check for existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('Session error');
          router.push('/auth?error=session_error');
          return;
        }

        if (sessionData?.session) {
          setStatus('Authenticated! Redirecting...');
          // User has a valid session
          router.push('/dashboard');
        } else {
          setStatus('No session found');
          // No session, redirect to auth page
          router.push('/auth');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus('Unexpected error');
        router.push('/auth?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="font-mono text-sm text-muted-foreground">
          {status}
        </p>
        <p className="font-mono text-xs text-muted-foreground opacity-60">
          Please wait while we complete your authentication...
        </p>
      </div>
    </div>
  );
}
