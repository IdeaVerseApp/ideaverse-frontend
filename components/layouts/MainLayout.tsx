"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image"
import Link from "next/link"

interface MainLayoutProps {
  children: React.ReactNode
  activeView?: "dashboard" | "ideas" | "code" | "paper" | "profile"
}

export default function MainLayout({ children, activeView = "dashboard" }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, isAuthenticated } = useAuth()

  // Set default user data if not available from auth context or if not authenticated
  const userName = isAuthenticated ? (user?.full_name || user?.username || "User") : null
  const userInitial = userName ? (userName.charAt(0) || "U").toUpperCase() : null
  
  // Remove the large logo banner entirely
  const showLargeLogo = false

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar Component */}
      <Sidebar
        userName={userName}
        userInitial={userInitial}
        activeView={activeView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ 
          marginLeft: sidebarOpen ? '16rem' : '4rem' // 16rem (w-64) when open, 4rem (w-16) when closed
        }}
      >
        {/* Navbar Component */}
        <Navbar
          userName={userName}
          userInitial={userInitial}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content Area - with top padding to account for navbar */}
        <div className="flex-1 pt-16 px-6 py-6 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950">
          {children}
        </div>
      </div>
    </div>
  )
} 