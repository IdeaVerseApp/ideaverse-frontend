"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import UserProfile from "@/components/user-profile"
import type { UserData } from "@/types/user"
import { useAuth } from "@/context/AuthContext"

export default function UserProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with an actual API call
        // const response = await fetch('/api/user');
        // const data = await response.json();

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
          researchIdeas: [
            {
              id: 1,
              name: "Dr. Alex Johnson",
              title: "Adaptive Compiler Optimization",
              experiment:
                "A compiler enhancement that leverages reinforcement learning to dynamically tune code optimizations based on hardware performance data.",
              interestingness: 8,
              feasibility: 2,
              novelty: 7.8,
              novel: true,
              code: ["compiler_opt.py", "reinforcement_model.py"],
              paper: "/papers/adaptive_compiler.pdf",
              category: "Compiler Design",
              date: "2 days ago",
            },
            {
              id: 2,
              name: "Dr. Sarah Chen",
              title: "Code Refactoring AI",
              experiment:
                "An AI tool that progressively suggests code refactoring steps by analyzing performance bottlenecks, ensuring minimal manual intervention.",
              interestingness: 7,
              feasibility: 8,
              novelty: 4.5,
              novel: true,
              code: ["refactor_ai.py", "code_analyzer.py"],
              paper: "",
              category: "Software Engineering",
              date: "1 week ago",
            },
            {
              id: 3,
              name: "Dr. Michael Rodriguez",
              title: "Quantum Code Accelerators",
              experiment:
                "A framework for automatically identifying code segments that can benefit from quantum acceleration and generating the necessary quantum circuits.",
              interestingness: 9,
              feasibility: 6.6,
              novelty: 2,
              novel: true,
              code: ["quantum_accelerator.py"],
              paper: "/papers/quantum_acceleration.pdf",
              category: "Quantum Computing",
              date: "2 weeks ago",
            },
          ],
        }

        setUserData(mockData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, router])

  // Get user information
  const userName = userData?.personalInformation[0]?.name || null
  const userInitial = userName ? userName.charAt(0) : null

  // Only render this page if we're actually on the userprofile route and user is authenticated
  if (pathname !== "/userprofile" || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userInitial={userInitial}
        activeView="profile"
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600">Loading user profile...</p>
            </div>
          ) : (
            <UserProfile userData={userData} />
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

