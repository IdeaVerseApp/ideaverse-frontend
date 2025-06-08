"use client"

import { useEffect, useState } from "react"
import Footer from "@/components/footer"
import GeneratedIdeas from "@/components/generated-ideas"
import MainLayout from "@/components/layouts/MainLayout"
import type { UserData } from "@/types/user"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function GeneratedIdeasPage() {
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  return (
    <MainLayout activeView="ideas">
      {/* Content */}
      <div className="flex-1">
        <GeneratedIdeas />
      </div>

      {/* Footer */}
      <Footer />
    </MainLayout>
  )
} 