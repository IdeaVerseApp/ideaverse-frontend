"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getCurrentUser, logout, login as loginService } from "@/services/auth-service"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  username: string
  full_name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
  refreshAuthState: () => Promise<boolean>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Load user from localStorage or NextAuth session on initialization
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      try {
        // First check if we have a NextAuth session
        if (session?.user) {
          // If we have a NextAuth session, use that user data
          setUser({
            id: session.user.id as string,
            email: session.user.email as string,
            username: (session.user as any).username || session.user.email?.split("@")[0] || session.user.name,
            full_name: session.user.name as string,
          })
          setLoading(false)
          return
        }
        
        // Otherwise check if we have a token
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }
        
        // If we have a token, fetch the current user
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)
        }
      } catch (err) {
        console.error("Error loading user:", err)
        setError("Failed to load user")
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') {
      loadUser()
    }
  }, [session, status])

  const login = async (email: string, password: string) => {
    try {
      const response = await loginService({ email, password });
      setUser(response.user);
      setError(null);
      return response;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  }

  const handleLogout = async () => {
    try {
      // Check if using NextAuth
      if (session) {
        await signOut({ redirect: false });
      } else {
        // Using custom auth
        await logout();
      }
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Failed to logout");
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser()
      if (userData) {
        setUser(userData)
      }
    } catch (err) {
      console.error("Error refreshing user:", err)
      setError("Failed to refresh user data")
    }
  }

  const refreshAuthState = async (): Promise<boolean> => {
    try {
      // First check NextAuth session
      if (session?.user) {
        setUser({
          id: session.user.id as string,
          email: session.user.email as string,
          username: (session.user as any).username || session.user.email?.split("@")[0] || session.user.name,
          full_name: session.user.name as string,
        });
        return true;
      }
      
      // Then check custom auth
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          return true;
        }
      }
      
      return false;
    } catch (err) {
      console.error("Error refreshing auth state:", err);
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout: handleLogout,
        setUser,
        refreshUser,
        refreshAuthState,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 