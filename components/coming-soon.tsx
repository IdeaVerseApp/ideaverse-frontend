"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/AuthContext"

interface ComingSoonProps {
  children: React.ReactNode
}

export default function ComingSoon({ children }: ComingSoonProps) {
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleEarlyAccess = () => {
    // Here you would typically handle the early access request,
    // e.g., send it to your backend with the user's information.
    console.log("Early access request for user:", user?.email)
    toast({
      title: "Thank you!",
      description: "You've been added to our early access list.",
    })
  }

  const handleContribute = () => {
    // Redirect to a contribution page or show a modal
    console.log("User wants to contribute.")
    toast({
      title: "Interested in contributing?",
      description: "That's great! Please contact us at contribute@ideaverse.com.",
    })
  }

  return (
    <div className="relative">
      <div className="blur-lg">{children}</div>
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/60" />
        <div className="relative z-20 overflow-hidden text-center text-white p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md mx-4">
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-5xl font-extrabold mb-4 tracking-tight">
              Coming Soon!
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              This feature is currently under development. We're working hard to
              bring it to you.
            </p>
            <p className="mb-8 text-gray-400">
              Get early access to be the first to know when it's ready, or
              consider contributing to our project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleEarlyAccess}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
              >
                Get Early Access
              </Button>
              <Button
                onClick={handleContribute}
                variant="outline"
                className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg"
              >
                Contribute
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
