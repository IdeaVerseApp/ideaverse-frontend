"use client"

import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

const Hero = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-gray-950 dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#0c2144,transparent)]"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
            Your <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-400/20 dark:to-purple-400/20 blur-xl rounded-full"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 animate-text-shadow-pulse">
                AI Lab
              </span>
            </span> for Research
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-gray-600 dark:text-gray-300">
            Explore Ideas. Generate Papers. Run Experiments.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center rounded-full bg-gray-900 dark:bg-white py-3 px-6 text-base font-semibold text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-white transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Start exploring
              <ArrowRight className="w-5 h-5 ml-2 -mr-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center text-base font-semibold leading-6 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
            >
              Learn more 
              <ChevronRight className="w-5 h-5 ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
      {mounted && (
      <div className="relative mt-8 md:mt-12">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="[perspective:2500px]">
            <div className="relative [transform-style:preserve-3d] group h-[350px]">
              


              {/* Window 2 (Middle) */}
              <div className="absolute top-0 left-1/2 w-[100%] h-auto rounded-lg overflow-hidden bg-gray-800 shadow-2xl border border-white/10 
                [transform:translateX(0%)_translateY(0px)_translateZ(0px)_rotateY(30deg)_rotateX(30deg)] 
                ">
                <div className="relative">
                  <img src="/cascading_windows/Image 2.png" alt="App screenshot 2" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-black/70 pointer-events-none" />
                </div>
              </div>

              {/* Window 1 (Front) */}
              <div className="absolute top-0  w-[100%] h-auto rounded-lg overflow-hidden bg-gray-800 shadow-2xl border border-white/10 
                [transform:translateX(0%)_translateY(0px)_translateZ(0px)_rotateY(30deg)_rotateX(30deg)] 
               ">
                <div className="relative">
                  <img src="/cascading_windows/Image 1.png" alt="App screenshot 1" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-black/70 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )}
    </section>
  )
}

export default Hero