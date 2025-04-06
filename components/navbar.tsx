"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, User, LogOut, Menu } from "lucide-react"

interface NavbarProps {
  userName: string
  userInitial: string
  sidebarOpen?: boolean
  setSidebarOpen?: (open: boolean) => void
}

export default function Navbar({ userName, userInitial, sidebarOpen, setSidebarOpen }: NavbarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const router = useRouter()

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  // Add a function to toggle the sidebar
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
    <div className="p-4 flex items-center justify-between bg-white border-b border-gray-200">
      <div className="flex items-center">
        {/* Add a sidebar toggle button that only appears when the sidebar is hidden */}
        {setSidebarOpen && !sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1 mr-2 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
        )}
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
      </div>

      <div className="relative">
        <div className="flex items-center">
          {/* Profile photo as a button with user initial */}
          <Link
            href="/userprofile"
            className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white"
          >
            <span className="text-sm">{userInitial}</span>
          </Link>
          <div className="ml-2 flex-1 truncate">
            <div className="text-sm">{userName}</div>
          </div>
          <button onClick={toggleProfileDropdown} className="focus:outline-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Profile dropdown */}
        {isProfileDropdownOpen && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-md z-10">
            <Link
              href="/userprofile"
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>View Profile</span>
            </Link>
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

