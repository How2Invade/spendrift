'use client';

import { usePathname } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The landing page is at the root '/'
  if (pathname === '/') {
    return <>{children}</>;
  }

  // All other pages get the AppLayout with sidebar
  return <AppLayout>{children}</AppLayout>;
}
