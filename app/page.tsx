"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import Partners from "@/components/landing/Partners"
import Features from "@/components/landing/Features"
import HowItWorks from "@/components/landing/HowItWorks"
import Testimonials from "@/components/landing/Testimonials"
import Cta from "@/components/landing/Cta"
import Team from "@/components/landing/Team"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])
  
  // If still loading or authenticated, don't render landing page yet
  if (loading || isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 relative overflow-hidden">
      <div className="grid-background"></div>

      <Header />

      <main className="relative z-10">
        <Hero />
        <Partners />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Cta />
        <Team />
      </main>

      <Footer />
    </div>
  )
}