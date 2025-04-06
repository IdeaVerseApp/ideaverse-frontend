"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Code, FileText, ChevronDown, LogOut, User, Menu } from "lucide-react"

interface SidebarProps {
  userName: string
  userInitial: string
  activeView?: "dashboard" | "ideas" | "code" | "paper" | "profile"
  sidebarOpen?: boolean
  setSidebarOpen?: (open: boolean) => void
}

export default function Sidebar({
  userName,
  userInitial,
  activeView = "dashboard",
  sidebarOpen = true,
  setSidebarOpen,
}: SidebarProps) {
  const router = useRouter()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const handleViewChange = (view: "dashboard" | "ideas" | "code" | "paper" | "profile") => {
    setIsProfileDropdownOpen(false)

    switch (view) {
      case "dashboard":
        router.push("/")
        break
      case "ideas":
        router.push("/ideas")
        break
      case "code":
        router.push("/code")
        break
      case "paper":
        router.push("/paper")
        break
      case "profile":
        router.push("/userprofile")
        break
    }
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const toggleSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen)
    }
  }

  // Add a logout function
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userName")

    // Redirect to login page
    router.push("/login")
  }

  return (
    <div
      className={`fixed top-0 left-0 h-full z-10 bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="h-6 w-6 relative">
            <svg viewBox="0 0 24 24" className="h-6 w-6">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 15.5C10.8807 15.5 12 14.3807 12 13C12 11.6193 10.8807 10.5 9.5 10.5C8.11929 10.5 7 11.6193 7 13C7 14.3807 8.11929 15.5 9.5 15.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 8.5C15.8807 8.5 17 7.38071 17 6C17 4.61929 15.8807 3.5 14.5 3.5C13.1193 3.5 12 4.61929 12 6C12 7.38071 13.1193 8.5 14.5 8.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 20.5C15.8807 20.5 17 19.3807 17 18C17 16.6193 15.8807 15.5 14.5 15.5C13.1193 15.5 12 16.6193 12 18C12 19.3807 13.1193 20.5 14.5 20.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M7 6H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 18H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="ml-2 font-semibold text-lg">
            <span className="text-blue-500">Idea</span>Verse
          </span>
        </Link>
        {setSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
        )}
      </div>

      <div className="p-4 border-b border-gray-200">
        <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md w-full">
          <span className="mr-2">New Thread</span>
          <span className="text-xs text-gray-500 ml-auto">Ctrl</span>
          <span className="text-xs text-gray-500 ml-1">P</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* Dashboard Button */}
          <button
            onClick={() => handleViewChange("dashboard")}
            className={`flex items-center px-4 py-2 text-sm rounded-md w-full text-left ${activeView === "dashboard" ? "bg-gray-100" : "hover:bg-gray-100"}`}
          >
            <Search className="h-5 w-5 mr-3 text-gray-500" />
            <span>Dashboard</span>
          </button>

          {/* Idea Explorer Button */}
          <button
            onClick={() => handleViewChange("ideas")}
            className={`flex items-center px-4 py-2 text-sm rounded-md w-full text-left ${activeView === "ideas" ? "bg-gray-100" : "hover:bg-gray-100"}`}
          >
            <Search className="h-5 w-5 mr-3 text-gray-500" />
            <span>Idea Explorer</span>
          </button>

          {/* Code Generation Button */}
          <button
            onClick={() => handleViewChange("code")}
            className={`flex items-center px-4 py-2 text-sm rounded-md w-full text-left ${activeView === "code" ? "bg-gray-100" : "hover:bg-gray-100"}`}
          >
            <Code className="h-5 w-5 mr-3 text-gray-500" />
            <span>Code Generation</span>
          </button>

          {/* Research Paper Writing Button */}
          <button
            onClick={() => handleViewChange("paper")}
            className={`flex items-center px-4 py-2 text-sm rounded-md w-full text-left ${activeView === "paper" ? "bg-gray-100" : "hover:bg-gray-100"}`}
          >
            <FileText className="h-5 w-5 mr-3 text-gray-500" />
            <span>Research Paper Writing</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 relative">
        <div className="flex items-center">
          {/* Profile photo as a button with user initial from API */}
          <button
            onClick={() => handleViewChange("profile")}
            className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white"
          >
            <span className="text-sm">{userInitial}</span>
          </button>
          <div className="ml-2 flex-1 truncate">
            {/* Display user name from API */}
            <div className="text-sm">{userName}</div>
          </div>
          <button onClick={toggleProfileDropdown} className="focus:outline-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Profile dropdown */}
        {isProfileDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-10">
            <button
              onClick={() => handleViewChange("profile")}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>View Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2 text-gray-500" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

