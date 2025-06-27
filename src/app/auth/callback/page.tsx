'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        // If there's an error, redirect back to auth
        if (error) {
          router.replace(`/auth?error=${error}`);
          return;
        }
        
        // If there's a code, exchange it for a session
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            router.replace('/auth?error=verification_failed');
            return;
          }
        }
        
        // Check if user is authenticated and redirect
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          router.replace('/dashboard');
        } else {
          router.replace('/auth');
        }
        
      } catch (error) {
        console.error('Callback error:', error);
        router.replace('/auth?error=unexpected_error');
      }
    };

    // Execute immediately with minimal delay
    const timer = setTimeout(handleCallback, 50);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-2">
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
        <p className="font-mono text-xs text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
