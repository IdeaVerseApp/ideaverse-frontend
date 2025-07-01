"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const Team = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20 opacity-80"></div>
        <div className="absolute animate-pulse-glow opacity-30 top-20 -left-24 w-72 h-72 bg-blue-200 dark:bg-blue-900/40 rounded-full blur-3xl"></div>
        <div className="absolute animate-float-subtle opacity-20 bottom-20 -right-24 w-72 h-72 bg-indigo-200 dark:bg-indigo-900/40 rounded-full blur-3xl"></div>
        <svg className="absolute opacity-5 dark:opacity-[0.02] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" width="800" height="400" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="200" r="150" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="400" cy="200" r="100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meet the Team</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The minds behind IdeaVerse</p>
          <div className="mt-2">
            <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
              Learn more about us <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Dhruv Kumar */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-md flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transform hover:-translate-y-1 border border-blue-50 dark:border-blue-900/30">
            <div className="flex-shrink-0">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-700">
                <Image 
                  src="/Dhruv Kumar.jpeg" 
                  alt="Dhruv Kumar" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dhruv Kumar</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">GenAI Scientist & Professor</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Research in GenAI @ BITS Pilani</p>
            </div>
          </div>
          
          {/* Rohit Singhee */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-md flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transform hover:-translate-y-1 border border-blue-50 dark:border-blue-900/30">
            <div className="flex-shrink-0">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-700">
                <Image 
                  src="/Rohit Singhee.jpeg" 
                  alt="Rohit Singhee" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rohit Singhee</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">ME CS Student & GenAI Researcher</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Dev, Microservices & Backend</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team
