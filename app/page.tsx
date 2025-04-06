"use client"

import { useState, useEffect } from "react"
import { HelpCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Dashboard from "@/components/dashboard"
import type { UserData } from "@/types/user"
import Footer from "@/components/footer"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"

export default function IdeaVerse() {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    // If not logged in, redirect to login page
    if (!isLoggedIn && pathname === "/") {
      router.push("/login")
    }
  }, [router, pathname])

  // Check if we're on a special route that should be rendered directly
  const isSpecialRoute = pathname !== "/"

  // Fetch user data
  useEffect(() => {
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
  }, [])

  const handleDashboardNavigation = (view: "ideas" | "code" | "paper", ideaId?: string | number) => {
    switch (view) {
      case "ideas":
        router.push("/ideas")
        break
      case "code":
        router.push("/code")
        break
      case "paper":
        router.push("/paper")
        break
    }
  }

  // Get user information
  const userName = userData?.personalInformation[0]?.name || "Researcher"
  const userInitial = userName.charAt(0)

  // If we're on a special route, don't render the main layout
  if (isSpecialRoute) {
    // Instead of returning null, return an empty div to avoid rendering conflicts
    return <div className="hidden"></div> // This component won't render anything visible
  }

  return (
    <div className="relative min-h-screen bg-gray-50 text-black">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userInitial={userInitial}
        activeView="dashboard"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-300 flex flex-col ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Navbar */}
        <Navbar
          userName={userName}
          userInitial={userInitial}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto">
          <Dashboard onNavigate={handleDashboardNavigation} userData={userData} />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Help Button */}
      <div className="fixed bottom-6 right-6">
        <button className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

