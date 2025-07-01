"use client"

import { Eye, EyeOff, Lightbulb, Rocket, Network, User, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { cn } from "@/lib/utils"
import { signup } from '@/services/auth-service'

export default function SignupPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required'
    }
    if (!username.trim()) {
      errors.username = 'Username is required'
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    if (!email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter'
    } else if (!/[a-z]/.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter'
    } else if (!/[0-9]/.test(password)) {
      errors.password = 'Password must contain at least one number'
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    try {
      await signup({
        email,
        username,
        password,
        full_name: fullName,
      })
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (err: any) {
      console.error("Google signup error:", err)
      setError("Failed to sign up with Google. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full text-white grid grid-cols-1 md:grid-cols-2">
      {/* Left side: Signup form */}
      <div className="relative flex flex-col items-center justify-center p-8 lg:p-12">
        <div 
          className={cn(
            "absolute inset-0 -z-10 h-full w-full bg-[#1e293b] bg-[linear-gradient(to_right,#33415533_1px,transparent_1px),linear-gradient(to_bottom,#33415533_1px,transparent_1px)] bg-[size:40px_40px]"
          )}
        />
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link href="/" className="flex items-center w-fit">
              <div className="h-10 w-10 flex items-center justify-center">
                <Image 
                  src="/ideaverse_logo.png" 
                  alt="IdeaVerse Logo" 
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="ml-3 text-2xl font-semibold text-white">IdeaVerse</span>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-white">Create your account</h1>
          <p className="mt-1 text-gray-400">Join IdeaVerse to start innovating</p>

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-md text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm bg-gray-900/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 ${validationErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
                placeholder="John Doe"
              />
              {validationErrors.fullName && <p className="mt-1 text-xs text-red-400">{validationErrors.fullName}</p>}
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm bg-gray-900/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 ${validationErrors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
                placeholder="johndoe"
              />
              {validationErrors.username && <p className="mt-1 text-xs text-red-400">{validationErrors.username}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm bg-gray-900/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
                placeholder="you@example.com"
              />
              {validationErrors.email && <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm bg-gray-900/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.password && <p className="mt-1 text-xs text-red-400">{validationErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm bg-gray-900/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 ${validationErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500 focus:border-blue-500'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && <p className="mt-1 text-xs text-red-400">{validationErrors.confirmPassword}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1e293b] text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button 
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-2.5 space-x-2 border border-gray-700 rounded-md shadow-sm bg-gray-900/50 hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.43-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-sm font-medium text-gray-200">Sign up with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side: Feature highlights */}
      <div className="hidden md:flex flex-col justify-center bg-[#27272A] p-12 lg:p-16">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Unlock Your Next Great Idea
          </h2>
          <p className="mt-4 text-base text-gray-400">
            IdeaVerse is your AI-powered partner in innovation, from initial spark to final draft.
          </p>
          <div className="mt-10 space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-gray-800/50 rounded-full">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">AI-Powered Idea Generation</h3>
                <p className="mt-1 text-gray-400 text-sm">
                  Generate novel ideas and explore different angles with our advanced AI models.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-gray-800/50 rounded-full">
                <Network className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Novelty Assessment</h3>
                <p className="mt-1 text-gray-400 text-sm">
                  Get instant feedback on the originality of your ideas with our novelty score.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-2 bg-gray-800/50 rounded-full">
                <Rocket className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Accelerated Research</h3>
                <p className="mt-1 text-gray-400 text-sm">
                  Draft research papers, find related work, and generate code implementations in minutes.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-sm text-gray-500">
             Already have an account? <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

