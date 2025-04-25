"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./ui/theme-toggle"

interface NavbarProps {
  userName?: string | null;
  userInitial?: string | null;
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ userName, userInitial, sidebarOpen, setSidebarOpen }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen)
    }
  }

  return (
    <div 
      className="fixed top-0 right-0 h-16 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 z-20 transition-all duration-300"
      style={{ 
        left: sidebarOpen ? '16rem' : '4rem', // 16rem (w-64) when open, 4rem (w-16) when closed
      }}
    >
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {pathname === "/" && "Dashboard"}
            {pathname?.startsWith("/ideas") && "Ideas"}
            {pathname === "/code" && "Code"}
            {pathname === "/paper" && "Papers"}
            {pathname === "/userprofile" && "Profile"}
            {pathname === "/settings" && "Settings"}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {isAuthenticated && userName && userInitial && (
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <span className="text-sm">{userInitial}</span>
              </div>
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-200 hidden sm:inline">{userName}</span>
            </div>
          )}
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

