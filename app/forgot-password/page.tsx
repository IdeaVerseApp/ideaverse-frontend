"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    setError("")
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would send a password reset email
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with logo */}
      <header className="py-6 px-8 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <Link href="/login" className="flex items-center">
            <div className="h-8 w-8 relative">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-blue-500">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 15.5C10.8807 15.5 12 14.3807 12 13C12 11.6193 10.8807 10.5 9.5 10.5C8.11929 10.5 7 11.6193 7 13C7 14.3807 8.11929 15.5 9.5 15.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.5 8.5C15.8807 8.5 17 7.38071 17 6C17 4.61929 15.8807 3.5 14.5 3.5C13.1193 3.5 12 4.61929 12 6C12 7.38071 13.1193 8.5 14.5 8.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.5 20.5C15.8807 20.5 17 19.3807 17 18C17 16.6193 15.8807 15.5 14.5 15.5C13.1193 15.5 12 16.6193 12 18C12 19.3807 13.1193 20.5 14.5 20.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M7 6H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 18H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="ml-2 font-semibold text-xl">
              <span className="text-blue-500">Idea</span>Verse
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Reset your password</h1>
                <p className="text-gray-600 mt-2">
                  {isSubmitted
                    ? "Check your email for reset instructions"
                    : "Enter your email and we'll send you a link to reset your password"}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
              )}

              {isSubmitted ? (
                <div className="text-center">
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                    We've sent a password reset link to {email}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-sm text-center">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-8 border-t border-gray-200 bg-white">
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <Link href="#" className="hover:text-gray-900">
            Terms
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Security
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  )
}

