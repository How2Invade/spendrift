'use client';

import React, { useState, useEffect } from 'react';
import Preloader from './preloader';

export function ClientPreloader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if preloader has been shown before in this session
    const hasShownPreloader = sessionStorage.getItem('preloader-shown');
    
    if (hasShownPreloader) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloader-shown', 'true');
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return showContent ? <>{children}</> : null;
}
