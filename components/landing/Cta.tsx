"use client"

import Link from "next/link"
import { Github, FileText } from "lucide-react"

const Cta = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white relative overflow-hidden">
      {/* Minimalist CTA background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-full h-20 text-white/5" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
        </svg>
        
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse-gentle"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white/40 rounded-full animate-pulse-gentle" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white relative z-10">
          Hey devs! Want to join us in building the future?
        </h2>
        <p className="text-base sm:text-lg mb-6 text-white/90 max-w-2xl mx-auto">
          Contribute your skills to Ideaverse and help shape the next generation of AI research tools.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="https://github.com"
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm sm:text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
          >
            <Github className="w-4 h-4 mr-2" />
            Contribute on GitHub
          </Link>
          <Link
            href="/documentation"
            className="inline-flex items-center px-6 py-2.5 border border-white text-sm sm:text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Documentation
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Cta
