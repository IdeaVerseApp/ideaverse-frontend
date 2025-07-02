'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function useRequireAuth(redirectTo = '/login') {
  const { user, loading, refreshAuthState } = useAuth();
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for both NextAuth and custom auth to finish loading
      if (sessionStatus !== 'loading' && !loading) {
        if (!user) {
          // Try to refresh auth state once
          const refreshed = await refreshAuthState();
          if (!refreshed) {
            // If we're already on the login page, don't redirect
            if (!window.location.pathname.includes(redirectTo)) {
              // Save the current path to redirect back after login
              const currentPath = window.location.pathname;
              router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
            }
          }
        }
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, loading, sessionStatus, refreshAuthState, redirectTo, router]);

  return { user, loading: loading || isChecking || sessionStatus === 'loading' };
} 