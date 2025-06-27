'use client';

import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import Preloader from '@/components/shared/preloader';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // Preloader duration
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen retro-grid bg-background">
        <Sidebar className="cyber-sidebar">
          <AppSidebar />
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto">
          <div className="relative min-h-full">
            {/* Scan line effect */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse" />
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
