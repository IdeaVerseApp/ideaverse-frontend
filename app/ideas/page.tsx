"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import IdeaExplorer from "@/components/idea-explorer"
import type { UserData } from "@/types/user"

export default function IdeasPage() {
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
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
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Get user information
  const userName = userData?.personalInformation[0]?.name || "Researcher"
  const userInitial = userName.charAt(0)

  // Only render this page if we're actually on the ideas route
  if (pathname !== "/ideas") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
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
          <IdeaExplorer />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

