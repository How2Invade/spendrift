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
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      </div>

      <main className="z-20 flex flex-col items-center justify-center text-center p-4 relative">
        {/* Main title */}
        <div className="relative mb-8">
          <h1 className="text-6xl md:text-8xl font-bold font-retro text-primary mb-4 retro-fade-in">
            {text}
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150 text-accent`}>_</span>
          </h1>
        </div>
        
        <div className="max-w-2xl mb-8 retro-fade-in" style={{animationDelay: '0.3s'}}>
          <p className="text-lg md:text-xl text-muted-foreground font-mono">
            Your Gen-Z finance buddy. Master your money with AI-powered insights, gamified goals, and zero stress.
          </p>
        </div>
        
        <div className="retro-fade-in" style={{animationDelay: '0.6s'}}>
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-8 py-4 font-retro bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/dashboard">
              Enter Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
