'use client';

import { usePathname, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/app-layout';
import { useAuth } from '@/context/auth-context';
import Preloader from '../shared/preloader';
import { useEffect } from 'react';

const PUBLIC_ROUTES = ['/', '/login', '/signup'];
const AUTH_ROUTES = ['/login', '/signup'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    if (!user && !isPublic) {
      router.push('/login');
    }

    if (user && isAuthRoute) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <Preloader />;
  }

  // If the user is authenticated and not on a public "auth" page, or if they're on a non-auth public page
  const isAppPage = user && !AUTH_ROUTES.includes(pathname);
  
  if (isAppPage) {
    // Landing page is special cased to not show app layout
    if (pathname === '/') return <>{children}</>;
    
    // All other authenticated pages get the AppLayout with sidebar
    return <AppLayout>{children}</AppLayout>;
  }

  // Unauthenticated users see public pages (landing, login, signup) without the app shell
  return <>{children}</>;
}
