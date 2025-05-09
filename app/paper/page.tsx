"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ResearchPaperWriting from "@/components/research-paper-writing"
import type { UserData } from "@/types/user"
import { useAuth } from "@/context/AuthContext"

export default function PaperPage() {
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Only set user data if authenticated
        if (isAuthenticated && user) {
          // Use actual authenticated user data
          const userData: UserData = {
            personalInformation: [
              {
                id: 1,
                name: user.username || user.full_name || user.email,
                email: user.email,
                role: "Researcher",
                institution: "Research Institution",
                joinDate: new Date().toISOString(),
              },
            ],
            researchIdeas: [],
          }
          setUserData(userData)
        } else {
          setUserData(null)
        }
      } catch (error) {
        console.error("Error setting user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, user])

  // Get user information - only if authenticated
  const userName = isAuthenticated && userData?.personalInformation[0]?.name || null
  const userInitial = userName ? userName.charAt(0) : null

  // Only render this page if we're actually on the paper route
  if (pathname !== "/paper") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userInitial={userInitial}
        activeView="paper"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Navbar */}
        <Navbar
          userName={userName}
          userInitial={userInitial}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content */}
        <div className="flex-1">
          <ResearchPaperWriting />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

