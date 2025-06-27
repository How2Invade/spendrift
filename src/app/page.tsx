'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'SpenDrift';

  useEffect(() => {
    let index = 0;
    setText(''); // Reset text on mount
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        // Make cursor blink after typing
        const cursorInterval = setInterval(() => {
          setShowCursor((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background retro-grid">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-90" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
      </div>
      
      {/* Scan line effect */}
      <div className="absolute inset-0 z-10 scan-line opacity-30" />

      <main className="z-20 flex flex-col items-center justify-center text-center p-4 relative">
        {/* Holographic header container */}
        <div className="relative p-8 rounded-2xl border border-primary/30 bg-card/10 backdrop-blur-sm holographic mb-8">
          <h1 className="text-6xl md:text-8xl font-bold font-retro text-primary tracking-wider glow-text retro-fade-in">
            {text}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150 text-accent`}>_</span>
          </h1>
        </div>
        
        <div className="terminal-text mb-8 max-w-2xl retro-fade-in" style={{animationDelay: '0.3s'}}>
          <p className="matrix-text text-lg md:text-xl">
            Your Gen-Z finance buddy. Master your money with AI-powered insights, gamified goals, and zero stress.
          </p>
        </div>
        
        <div className="retro-fade-in" style={{animationDelay: '0.6s'}}>
          <Button 
            asChild 
            size="lg" 
            className="retro-button text-lg px-8 py-4 font-retro"
          >
            <Link href="/dashboard">
              Initialize System
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-4 -left-4 w-2 h-2 bg-secondary rounded-full animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="absolute top-1/2 -left-8 w-1 h-1 bg-primary rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/4 -right-8 w-1 h-1 bg-destructive rounded-full animate-pulse" style={{animationDelay: '1.5s'}} />
      </main>
    </div>
  );
}
