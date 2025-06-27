'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleAuth = async () => {
      try {
        console.log('🚀 Auth callback started');
        setStatus('Processing authentication...');
        
        // Get URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        console.log('📝 URL params:', { 
          hasCode: !!code, 
          error, 
          fullUrl: window.location.href 
        });
        
        // Handle errors from URL
        if (error) {
          console.error('❌ URL error:', error);
          setStatus(`Authentication failed: ${error}`);
          setHasError(true);
          return;
        }
        
        // No code means check existing session
        if (!code) {
          console.log('🔍 No code, checking session...');
          setStatus('Checking existing session...');
          
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            setStatus('Session check failed');
            setHasError(true);
            return;
          }
          
          if (sessionData?.session) {
            console.log('✅ Found existing session');
            setStatus('Redirecting to dashboard...');
            setIsComplete(true);
            router.push('/dashboard');
            return;
          }
          
          console.log('ℹ️ No session found, redirecting to auth');
          setStatus('No session found');
          router.push('/auth');
          return;
        }
        
        // Exchange code for session
        console.log('🔄 Exchanging code for session...');
        setStatus('Verifying your email...');
        
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('❌ Code exchange failed:', exchangeError);
          setStatus(`Verification failed: ${exchangeError.message}`);
          setHasError(true);
          return;
        }
        
        if (data?.session) {
          console.log('✅ Email verified successfully!');
          setStatus('Email verified! Welcome to SpenDrift!');
          setIsComplete(true);
          
          // Brief delay then redirect
          timeoutId = setTimeout(() => {
            router.push('/dashboard?verified=true');
          }, 2000);
        } else {
          console.error('⚠️ No session after code exchange');
          setStatus('Verification completed but no session created');
          setHasError(true);
        }
        
      } catch (error) {
        console.error('💥 Unexpected error:', error);
        setStatus('An unexpected error occurred');
        setHasError(true);
      }
    };
    
    // Add small delay to ensure URL params are loaded
    const initTimeout = setTimeout(handleAuth, 100);
    
    return () => {
      clearTimeout(initTimeout);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, searchParams]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-4">
          {/* Icon */}
          {!hasError && !isComplete && (
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
          )}
          {hasError && (
            <AlertTriangle className="h-16 w-16 mx-auto text-destructive" />
          )}
          {isComplete && (
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          )}
          
          {/* Status */}
          <div className="space-y-2">
            <h1 className="text-xl font-retro text-foreground">
              {hasError ? 'Authentication Failed' : 
               isComplete ? 'Success!' : 
               'Completing Sign Up'}
            </h1>
            
            <p className="font-mono text-sm text-muted-foreground">
              {status}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        {hasError && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Don't worry, this happens sometimes. Let's try again!
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRetry} variant="outline" size="sm">
                Try Again
              </Button>
              <Button onClick={handleGoHome} size="sm">
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
        
        {isComplete && (
          <p className="text-sm text-green-600 font-mono">
            Redirecting to your dashboard...
          </p>
        )}
        
        {!hasError && !isComplete && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              This usually takes just a few seconds
            </p>
            <Button 
              onClick={handleGoHome} 
              variant="ghost" 
              size="sm"
              className="text-xs"
            >
              Taking too long? Click here
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
