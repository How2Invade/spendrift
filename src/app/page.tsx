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
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 z-0 opacity-5">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Abstract money pattern background"
          data-ai-hint="money pattern"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <main className="z-20 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-7xl md:text-8xl font-bold font-headline text-primary tracking-tighter animate-fade-in-up">
          {text}
          <span className={showCursor ? 'opacity-100 transition-opacity duration-150' : 'opacity-0 transition-opacity duration-150'}>_</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up animation-delay-300">
          Your Gen-Z finance buddy. Master your money with AI-powered insights, gamified goals, and zero stress.
        </p>
        <div className="animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" className="mt-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Link href="/dashboard">
              Explore The App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
