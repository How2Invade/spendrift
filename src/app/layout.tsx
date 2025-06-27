import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/context/data-context';
import { ThemeProvider } from '@/components/theme-provider';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { AuthProvider } from '@/context/auth-context';
import { ClientPreloader } from '@/components/shared/client-preloader';
import { StagewiseToolbarClient } from './stagewise-toolbar-client';

export const metadata: Metadata = {
  title: 'SpenDrift',
  description: 'Your Gen-Z finance buddy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background font-sans')}>
        <StagewiseToolbarClient />
        <ClientPreloader>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AuthProvider>
              <DataProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </DataProvider>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </ClientPreloader>
      </body>
    </html>
  );
}
