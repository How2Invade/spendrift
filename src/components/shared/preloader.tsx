'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Much shorter animation duration: 1.5 seconds total
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onComplete?.();
      }, 300); // Shorter delay before calling onComplete
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(120,199,117,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,199,117,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* SVG Text Animation */}
        <div className="flex flex-col items-center justify-center px-4">
          <svg
            width="100%"
            height="160"
            viewBox="0 0 800 160"
            className="w-full max-w-4xl md:max-w-6xl lg:max-w-7xl"
            style={{ maxWidth: '1200px' }}
          >
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(120 60% 45%)" />
                <stop offset="50%" stopColor="hsl(180 60% 45%)" />
                <stop offset="100%" stopColor="hsl(280 50% 60%)" />
              </linearGradient>
            </defs>
            
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-retro"
              style={{
                fontSize: 'clamp(48px, 12vw, 120px)',
                fontFamily: 'Orbitron, monospace',
                fontWeight: '900',
                letterSpacing: '0.15em'
              }}
              fill="none"
              stroke="hsl(120 60% 45%)"
              strokeWidth="3"
              strokeDasharray="3000"
              strokeDashoffset="3000"
            >
              SpenDrift
              
              {/* Stroke animation - draws the outline (slower) */}
              <animate
                attributeName="stroke-dashoffset"
                values="3000;0"
                dur="3.5s"
                fill="freeze"
                begin="0s"
              />
              
              {/* Fill animation - fills the text (slower) */}
              <animate
                attributeName="fill"
                values="none;url(#textGradient)"
                dur="1.2s"
                fill="freeze"
                begin="3s"
              />
              
              {/* Glow effect */}
              <animate
                attributeName="filter"
                values="none;drop-shadow(0 0 20px hsl(120 60% 45%))"
                dur="0.8s"
                fill="freeze"
                begin="4.2s"
              />
            </text>
          </svg>

          {/* Simple loading indicator */}
          <motion.div
            className="mt-12 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              />
            ))}
          </motion.div>

          {/* Skip button */}
          <motion.button
            className="mt-8 font-mono text-sm text-muted-foreground/60 hover:text-primary transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            onClick={() => {
              setIsComplete(true);
              onComplete?.();
            }}
          >
            Skip
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
