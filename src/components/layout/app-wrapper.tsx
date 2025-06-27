'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/components/shared/preloader';
import { ConditionalLayout } from '@/components/layout/conditional-layout';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has seen preloader in this session
    const hasSeenPreloader = sessionStorage.getItem('spendrift-preloader-seen');
    
    if (hasSeenPreloader) {
      // Skip preloader if already seen in this session
      setIsLoading(false);
      setShowContent(true);
      return;
    }

    // Simulate initial app loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mark preloader as seen for this session
      sessionStorage.setItem('spendrift-preloader-seen', 'true');
    }, 2000); // Minimum loading time

    return () => clearTimeout(timer);
  }, []);

  const handlePreloaderComplete = () => {
    // Add a small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader key="preloader" onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {!isLoading && showContent && (
          <ConditionalLayout key="content">
            {children}
          </ConditionalLayout>
        )}
      </AnimatePresence>
    </>
  );
}
