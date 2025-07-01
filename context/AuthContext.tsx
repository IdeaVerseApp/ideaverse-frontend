"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getCurrentUser, logout, login as loginService } from "@/services/auth-service"

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
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user from localStorage on initialization
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      try {
        // First check if we have a token
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

    loadUser()
  }, [])

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
      await logout()
      setUser(null)
    } catch (err) {
      console.error("Error during logout:", err)
      setError("Failed to logout")
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