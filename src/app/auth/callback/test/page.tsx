'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackTest() {
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const testCallback = async () => {
      try {
        addLog('🚀 Starting auth callback test...');
        
        // Log environment
        addLog(`📍 Environment: ${process.env.NODE_ENV}`);
        addLog(`🌐 URL: ${window.location.href}`);
        
        // Log URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDesc = searchParams.get('error_description');
        
        addLog(`📝 URL Parameters:`);
        addLog(`  - code: ${code ? code.substring(0, 20) + '...' : 'null'}`);
        addLog(`  - error: ${error || 'null'}`);
        addLog(`  - error_description: ${errorDesc || 'null'}`);
        
        // Test Supabase config
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        addLog(`🔧 Supabase Config:`);
        addLog(`  - URL: ${supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING'}`);
        addLog(`  - Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'MISSING'}`);
        
        if (!supabaseUrl || !supabaseKey) {
          addLog('❌ Missing Supabase configuration!');
          setIsProcessing(false);
          return;
        }
        
        if (error) {
          addLog(`❌ Auth error received: ${error} - ${errorDesc}`);
          setIsProcessing(false);
          return;
        }
        
        if (!code) {
          addLog('⚠️ No code parameter found');
          
          // Check for existing session
          addLog('🔍 Checking for existing session...');
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            addLog(`❌ Session error: ${sessionError.message}`);
          } else if (sessionData?.session) {
            addLog('✅ Found existing session!');
            addLog(`👤 User: ${sessionData.session.user.email}`);
          } else {
            addLog('ℹ️ No existing session found');
          }
          
          setIsProcessing(false);
          return;
        }
        
        addLog('🔄 Exchanging code for session...');
        
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          addLog(`❌ Code exchange failed: ${exchangeError.message}`);
          setIsProcessing(false);
          return;
        }
        
        if (data?.session) {
          addLog('✅ Code exchange successful!');
          addLog(`👤 User authenticated: ${data.session.user.email}`);
          addLog(`🎫 Session expires: ${new Date(data.session.expires_at! * 1000).toLocaleString()}`);
          addLog('🚀 Ready to redirect to dashboard...');
          
          // Simulate redirect after 3 seconds
          setTimeout(() => {
            window.location.href = '/dashboard?verified=true';
          }, 3000);
        } else {
          addLog('⚠️ Code exchange returned no session');
        }
        
      } catch (error) {
        addLog(`💥 Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Test callback error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    testCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          🧪 Auth Callback Test Page
        </h1>
        
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="font-mono text-sm">
              {isProcessing ? 'Processing...' : 'Complete'}
            </span>
          </div>
          
          <div className="bg-muted rounded p-4 max-h-96 overflow-auto">
            <pre className="font-mono text-xs space-y-1">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </pre>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/auth'}
              className="px-4 py-2 bg-primary text-primary-foreground rounded font-mono text-sm"
            >
              ← Back to Auth
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded font-mono text-sm"
            >
              🔄 Reload Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
