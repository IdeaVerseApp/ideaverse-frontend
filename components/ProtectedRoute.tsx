"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login" 
}) => {
  const router = useRouter();
  const { isAuthenticated, loading, refreshAuthState } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading) {
        if (!isAuthenticated) {
          // Try to refresh auth state once
          const refreshed = await refreshAuthState();
          if (!refreshed) {
            router.push(redirectTo);
          }
        }
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, loading, refreshAuthState, redirectTo, router]);

  // Handle navigation when authentication state changes
  useEffect(() => {
    if (!loading && !isChecking && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isChecking, loading, redirectTo, router]);

  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  // In case isAuthenticated becomes false after initial render
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Redirecting...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute; 