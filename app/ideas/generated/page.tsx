"use client"

import { useEffect, useState } from "react"

import Footer from "@/components/footer"
import GeneratedIdeas from "@/components/generated-ideas"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import type { UserData } from "@/types/user"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function GeneratedIdeasPage() {
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Only fetch or set user data if authenticated
        if (isAuthenticated) {
          // Mock data for now
          const mockData: UserData = {
            personalInformation: [
              {
                id: 1,
                name: "Researcher Smith",
                email: "researcher@example.com",
                role: "Principal Investigator",
                institution: "University Research Lab",
                joinDate: "2023-01-15",
              },
            ],
            researchIdeas: [],
          }
          setUserData(mockData)
        } else {
          setUserData(null)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated])

  // Get user information - only if authenticated
  const userName = isAuthenticated && userData?.personalInformation[0]?.name || null
  const userInitial = userName ? userName.charAt(0) : null

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userInitial={userInitial}
        activeView="ideas"
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
          <GeneratedIdeas />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
} 