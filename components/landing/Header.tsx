"use client"

import Link from "next/link"
import Image from "next/image"

const Header = () => {
  return (
    <header className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 relative">
                <Image 
                  src="/ideaverse_logo.png" 
                  alt="IdeaVerse Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">IdeaVerse</span>
            </Link>
            
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <Link href="/#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Features
              </Link>
              <Link href="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Testimonials
              </Link>
              <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 