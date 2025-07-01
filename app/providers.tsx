'use client';

import { ThemeProvider } from '@/components/theme-provider';
import SessionProvider from '@/components/session-provider';
import { AuthProvider } from '@/context/AuthContext';
import { IdeaProvider } from '@/context/IdeaContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IdeaProvider>
            {children}
          </IdeaProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 