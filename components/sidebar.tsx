"use client"

import { BookOpen, ChevronDown, Code, FileText, LayoutDashboard, Lightbulb, LogOut, Menu, Search, Settings, User, PlusCircle, History } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  userName: string | null
  userInitial: string | null
  activeView?: "dashboard" | "ideas" | "code" | "paper" | "profile"
  sidebarOpen?: boolean
  setSidebarOpen?: (open: boolean) => void
}

interface SidebarItem {
  name: string
  href: string
  icon: LucideIcon
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
  const [isIdeasDropdownOpen, setIsIdeasDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = useRouter().pathname

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

  const toggleIdeasDropdown = () => {
    if (sidebarOpen) {
      setIsIdeasDropdownOpen(!isIdeasDropdownOpen)
    } else {
      // If sidebar is collapsed, navigate directly to ideas page instead of expanding
      router.push('/ideas')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navigation: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Ideas", href: "#", icon: Lightbulb },
    { name: "Code", href: "/code", icon: Code },
    { name: "Papers", href: "/paper", icon: BookOpen },
    { name: "Profile", href: "/userprofile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-500 ${
        sidebarOpen ? "w-64" : "w-16"
      } z-30`}
    >
      <div className={`transition-all duration-500 ease-in-out ${
        sidebarOpen 
          ? 'p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between' 
          : 'pt-4 px-2 flex flex-col items-center gap-3'
      }`}>
        <Link href="/" className={`flex ${sidebarOpen ? 'items-center' : 'flex-col items-center justify-center'}`}>
          <div 
            className={`
              ${sidebarOpen ? 'h-12 w-12' : 'h-10 w-10'} 
              relative flex-shrink-0 
              transform transition-transform duration-500 ease-in-out
              ${!sidebarOpen ? 'scale-110' : ''}
            `}
          >
            <Image 
              src="/ideaverse_logo.png" 
              alt="IdeaVerse Logo"
              width={sidebarOpen ? 48 : 40} 
              height={sidebarOpen ? 48 : 40}
              className="object-contain"
              priority
            />
          </div>
          <span 
            className={`
              ml-2 text-xl font-bold text-gray-900 dark:text-white
              transition-opacity duration-300 ease-in-out
              ${sidebarOpen ? 'opacity-100' : 'opacity-0 absolute left-[-9999px]'}
            `}
          >
            IdeaVerse
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
          className={`
            rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500
            transition-all duration-500 ease-in-out
            ${!sidebarOpen ? 'mt-1 transform hover:scale-110' : ''}
          `}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className={`p-2 ${sidebarOpen ? 'px-4' : 'px-2'} border-b border-gray-200 dark:border-gray-800 ${!sidebarOpen ? 'mt-2' : ''}`}>
        <button 
          onClick={() => router.push('/new-thread')} 
          className={`flex items-center ${sidebarOpen ? 'px-4 w-full justify-between' : 'px-2 w-full justify-center'} py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
          title={!sidebarOpen ? "New Thread" : undefined}
        >
          {sidebarOpen ? (
            <>
              <span className="text-sm font-medium dark:text-gray-200">New Thread</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Ctrl+P</span>
            </>
          ) : (
            <PlusCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname?.startsWith('/ideas') && item.name === "Ideas")
            
            if (item.name === "Ideas") {
              return (
                <div key={item.name}>
                  <button
                    onClick={toggleIdeasDropdown}
                    className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${
                      sidebarOpen ? 'justify-between' : 'justify-center'
                    } ${isActive ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    title={!sidebarOpen ? item.name : undefined}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''} ${
                          isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      {sidebarOpen && <span className="dark:text-gray-200">{item.name}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                          isIdeasDropdownOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    )}
                  </button>
                  
                  {sidebarOpen && isIdeasDropdownOpen && (
                    <div className="ml-9 mt-1 space-y-1">
                      <Link
                        href="/ideas"
                        className={`flex items-center px-3 py-2 text-sm rounded-md w-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          pathname === "/ideas" ? "bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <span>Create New Idea</span>
                      </Link>
                      <Link
                        href="/ideas/generated"
                        className={`flex items-center px-3 py-2 text-sm rounded-md w-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          pathname === "/ideas/generated" ? "bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <span>Generated Ideas</span>
                      </Link>
                    </div>
                  )}
                </div>
              )
            }
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${
                  sidebarOpen ? 'text-left' : 'justify-center'
                } ${isActive ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon
                  className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''} ${
                    isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {sidebarOpen && <span className="dark:text-gray-200">{item.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className={`p-2 ${sidebarOpen ? 'px-4' : 'px-2'} border-t border-gray-200 dark:border-gray-800 relative`}>
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center">
            <button
              onClick={() => sidebarOpen ? handleViewChange("profile") : handleViewChange("profile")}
              className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0"
              title={userName}
            >
              <span className="text-sm">{userInitial}</span>
            </button>
            {sidebarOpen && (
              <div className="ml-2 truncate">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{userName}</div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={toggleProfileDropdown} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {sidebarOpen && isProfileDropdownOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-40">
            <button
              onClick={() => handleViewChange("profile")}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
            >
              <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span>View Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
            >
              <LogOut className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

