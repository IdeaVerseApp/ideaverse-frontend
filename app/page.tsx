"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Brain, Lightbulb, FileText, Code, ChevronDown, Moon, Sun } from "lucide-react"

// Custom animations
const customAnimations = `
@keyframes text-shadow-pulse {
  0% {
    text-shadow: 0 0 2px rgba(59, 130, 246, 0.1);
  }
  50% {
    text-shadow: 0 0 8px rgba(59, 130, 246, 0.2), 0 0 15px rgba(99, 102, 241, 0.1);
  }
  100% {
    text-shadow: 0 0 2px rgba(59, 130, 246, 0.1);
  }
}

@keyframes scale-in {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes glow {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(-8px) rotate(2deg); }
  75% { transform: translateY(8px) rotate(-2deg); }
}

@keyframes float-medium {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-15px) translateX(10px); }
}

@keyframes float-fast {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-10px) translateX(-10px); }
}

@keyframes pulse-gentle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-text-shadow-pulse {
  animation: text-shadow-pulse 2s infinite;
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out forwards;
}

.animate-glow {
  animation: glow 3s infinite;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 12s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 6s ease-in-out infinite;
}

.animate-pulse-gentle {
  animation: pulse-gentle 4s ease-in-out infinite;
}

.animate-rotate-slow {
  animation: rotate-slow 20s linear infinite;
}
`

// Typing effect component
const TypeWriter = () => {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)
  const [cursorStyle, setCursorStyle] = useState("animate-pulse")
  const [textEffect, setTextEffect] = useState("")
  const [activeHighlight, setActiveHighlight] = useState(false)
  
  const phrases = [
    "Generate an idea",
    "Generate a research paper",
    "Generate code implementations",
    "Discover breakthrough concepts",
    "Explore research directions"
  ]
  
  useEffect(() => {
    const phrase = phrases[loopNum % phrases.length]
    
    const handleTyping = () => {
      setDisplayText(current => {
        const fullPhrase = phrase
        
        if (!isDeleting) {
          // Variable speed typing for more natural effect
          const randomVariation = Math.floor(Math.random() * 80)
          setTypingSpeed(50 + randomVariation)
          
          // Add a tiny pause after certain characters for realism
          if (",. ".includes(fullPhrase[current.length - 1])) {
            setTypingSpeed(prev => prev + 100)
          }
          
          // Randomly add highlight effect while typing
          if (Math.random() > 0.8 && current.length > 1) {
            setActiveHighlight(true)
            setTimeout(() => setActiveHighlight(false), 300)
          }
          
          return fullPhrase.substring(0, current.length + 1)
        } else {
          // Slightly faster and more consistent deletion
          setTypingSpeed(30 + Math.floor(Math.random() * 30))
          return fullPhrase.substring(0, current.length - 1)
        }
      })
    }
    
    const timer = setTimeout(() => {
      handleTyping()
      
      if (!isDeleting && displayText === phrase) {
        // Pause at the end of typing with pulse effect
        setTypingSpeed(1500)
        setCursorStyle("animate-ping opacity-70")
        setTextEffect("text-shadow-pulse")
        setActiveHighlight(true)
        setTimeout(() => setActiveHighlight(false), 1000)
        setIsDeleting(true)
      } else if (isDeleting && displayText === '') {
        setCursorStyle("animate-pulse")
        setTextEffect("")
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
        setTypingSpeed(500)
      }
    }, typingSpeed)
    
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, loopNum, phrases, typingSpeed])
  
  // Add a new effect when the phrase completely changes
  useEffect(() => {
    if (displayText === "" && !isDeleting) {
      setTextEffect("scale-in")
      setTimeout(() => setTextEffect(""), 500)
    }
  }, [loopNum, isDeleting, displayText])
  
  return (
    <span className="relative inline-block">
      {/* Highlight effect behind text */}
      {activeHighlight && (
        <span className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-sm"></span>
      )}
      
      <span 
        className={`relative font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 font-bold tracking-wide drop-shadow-[0_0_5px_rgba(59,130,246,0.2)] dark:drop-shadow-[0_0_5px_rgba(147,197,253,0.2)] ${textEffect === "text-shadow-pulse" ? "animate-text-shadow-pulse" : ""} ${textEffect === "scale-in" ? "animate-scale-in" : ""}`}
      >
        {displayText}
      </span>
      <span 
        className={`absolute right-[-12px] top-1 h-6 w-[3px] rounded-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 ${cursorStyle}`}
      ></span>
      
      {/* Add subtle particle effects behind the text */}
      {!isDeleting && displayText.length > 0 && (
        <>
          <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-blue-400/30 dark:bg-blue-300/30 animate-glow animate-float"></span>
          <span className="absolute -right-3 -bottom-1 h-1.5 w-1.5 rounded-full bg-purple-400/30 dark:bg-purple-300/30 animate-glow" style={{ animationDelay: '1s' }}></span>
        </>
      )}
    </span>
  )
}

// Feature card component
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
)

export default function LandingPage() {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  
  // Initialize theme based on localStorage or system preference
  useEffect(() => {
    // Check if theme was previously set
    const storedTheme = localStorage.getItem('theme')
    
    if (storedTheme === 'dark' || 
        (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])
  
  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`
        heroRef.current.style.opacity = `${1 - (scrollPosition * 0.002)}`
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      <style jsx global>{customAnimations}</style>
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating circular elements */}
        <div className="absolute top-[15%] left-[15%] w-6 h-6 rounded-full border border-blue-300/50 dark:border-blue-500/50 animate-float-slow"></div>
        <div className="absolute top-[40%] right-[10%] w-4 h-4 rounded-full border border-purple-300/50 dark:border-purple-500/50 animate-float-medium" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[30%] left-[20%] w-5 h-5 rounded-full border border-green-300/50 dark:border-green-500/50 animate-float-fast" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-[20%] right-[20%] w-8 h-8 border border-blue-300/50 dark:border-blue-500/50 rounded-md transform rotate-45 animate-float-medium"></div>
        <div className="absolute bottom-[15%] right-[25%] w-10 h-10 border border-purple-300/50 dark:border-purple-500/50 rounded transform rotate-12 animate-float-slow" style={{ animationDelay: '3s' }}></div>
        
        {/* Small dots */}
        <div className="absolute top-[25%] left-[40%] w-1.5 h-1.5 rounded-full bg-blue-400/70 dark:bg-blue-400/70 animate-pulse-gentle"></div>
        <div className="absolute top-[65%] right-[35%] w-1.5 h-1.5 rounded-full bg-purple-400/70 dark:bg-purple-400/70 animate-pulse-gentle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[45%] left-[25%] w-1.5 h-1.5 rounded-full bg-green-400/70 dark:bg-green-400/70 animate-pulse-gentle" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header/Navigation */}
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
                <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  How It Works
                </Link>
                <Link href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  Testimonials
                </Link>
                <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  Pricing
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center">
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                Sign in
              </Link>
              {/* Theme Toggle */}
              <button
                onClick={() => {
                  const html = document.documentElement
                  html.classList.toggle('dark')
                  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light')
                }}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mx-2"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 text-yellow-500 dark:hidden" />
                <Moon className="h-5 w-5 text-gray-300 hidden dark:block" />
              </button>
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

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-20 lg:pb-32 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pointer-events-none"></div>
          
          {/* Glow elements */}
          <div className="absolute -left-40 top-40 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20 pointer-events-none"></div>
          <div className="absolute right-0 top-20 w-80 h-80 rounded-full bg-purple-200/40 blur-3xl dark:bg-purple-900/20 pointer-events-none"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-10 pointer-events-none"></div>
          
          {/* Light beams in light mode */}
          <div className="absolute left-1/4 top-1/2 w-[1px] h-40 bg-gradient-to-b from-blue-400/0 via-blue-400/60 to-blue-400/0 rotate-[30deg] dark:opacity-30"></div>
          <div className="absolute right-1/3 top-1/3 w-[1px] h-60 bg-gradient-to-b from-purple-400/0 via-purple-400/60 to-purple-400/0 -rotate-[20deg] dark:opacity-30"></div>
          <div className="absolute left-2/3 top-1/4 w-[1px] h-32 bg-gradient-to-b from-blue-400/0 via-blue-400/40 to-blue-400/0 rotate-[15deg] dark:opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left side - Text content */}
            <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Revolutionize Your <br/>
                Research with <span className="text-blue-600 dark:text-blue-400 relative">
                  AI
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm -z-10 rounded"></span>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
                <span className="font-medium">I want to </span><TypeWriter />
              </p>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                IdeaVerse leverages AI to help researchers generate novel ideas, 
                create research papers, and implement code - all in one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/signup" 
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  Get started free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                
                <Link 
                  href="#demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  See demo
                </Link>
              </div>
            </div>
            
            {/* Right side - AI Demo */}
            <div className="lg:w-1/2 lg:pl-8" ref={heroRef}>
              <div className="relative max-w-lg mx-auto">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur-xl opacity-70 dark:opacity-50 transform rotate-2"></div>
                
                {/* AI Assistant Interface */}
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Title bar */}
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                      <FileText className="h-4 w-4 mr-1.5 text-blue-500" />
                      IdeaVerse Research Paper Generator
                    </div>
                  </div>
                  
                  {/* Research Paper Preview */}
                  <div className="p-5 bg-gray-50 dark:bg-gray-900/20 h-[430px] overflow-y-auto">
                    {/* Paper header */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {/* Paper title section */}
                      <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-5">
                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
                          Eco-Efficient Neural Network Training
                        </h3>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                          Journal of Sustainable Computing Technologies
                        </p>
                        <div className="flex justify-center items-center mt-3 space-x-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Authors: AI-Generated</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Published: {new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Paper content */}
                      <div className="p-6">
                        {/* Abstract section */}
                        <div className="mb-6">
                          <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">Abstract</h4>
                          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                            <p>
                              This research paper proposes a novel approach to neural network training that optimizes energy consumption through intelligent scheduling based on renewable energy availability forecasts. Our method demonstrates a 47% reduction in carbon emissions while maintaining model accuracy within industry benchmarks.
                            </p>
                            <div className="mt-2">
                              We present empirical results from a six-month deployment across three data centers and propose a standardized framework for measuring and implementing sustainable computing practices
                              <span className="inline-block w-1 h-4 ml-0.5 bg-gray-800 dark:bg-gray-200 animate-pulse align-middle"></span>
                            </div>
                          </div>
                          
                          {/* Keywords */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="inline-flex text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-1 px-2 rounded-full">Neural Networks</span>
                            <span className="inline-flex text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-1 px-2 rounded-full">Sustainability</span>
                            <span className="inline-flex text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 py-1 px-2 rounded-full">Energy Optimization</span>
                          </div>
                        </div>
                        
                        {/* Introduction */}
                        <div className="mb-6">
                          <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">1. Introduction</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            The exponential growth in computational requirements for training modern neural networks has led to significant energy consumption and associated carbon emissions. As the AI industry continues to expand, sustainable approaches to neural network training become increasingly critical.
                          </p>
                          <div className="space-y-1.5">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full animate-pulse"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6 animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Methodology and Figure */}
                        <div className="mb-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-7/12">
                              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">2. Methodology</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                Our approach integrates renewable energy forecasting with dynamic training scheduler optimization to minimize carbon footprint while maintaining training efficiency.
                              </p>
                              <div className="space-y-1.5">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full animate-pulse"></div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full animate-pulse"></div>
                              </div>
                            </div>
                            
                            <div className="md:w-5/12">
                              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">Figure 1: Energy Consumption</div>
                                <div className="h-32 bg-white dark:bg-gray-900 rounded flex items-end p-2 justify-around">
                                  <div className="w-8 h-24 bg-red-500/50 dark:bg-red-500/30 rounded-t relative group">
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400 hidden group-hover:block">Standard</span>
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400">100%</span>
                                  </div>
                                  <div className="w-8 h-12 bg-yellow-500/50 dark:bg-yellow-500/30 rounded-t relative group">
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400 hidden group-hover:block">Optimized</span>
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400">52%</span>
                                  </div>
                                  <div className="w-8 h-8 bg-green-500/50 dark:bg-green-500/30 rounded-t relative group">
                                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400 hidden group-hover:block">Our Method</span>
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400">35%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Results and Discussion */}
                        <div>
                          <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">3. Results</h4>
                          <div className="space-y-1.5">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full animate-pulse"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full animate-pulse"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Paper footer */}
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/30 flex justify-between items-center">
                        <div className="flex space-x-3">
                          <button className="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium flex items-center">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            Export as PDF
                          </button>
                          <button className="px-3 py-1.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md font-medium">
                            Edit Paper
                          </button>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">AI-Generated</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Generation status */}
                    <div className="mt-4 px-1 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex h-2 w-2 relative mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        IdeaVerse AI generating research paper
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">62%</span> complete
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subtle tooltip */}
                <div className="absolute top-16 right-4 flex items-center group z-10">
                  <div className="relative flex items-center">
                    <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/70 shadow-sm group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors cursor-pointer">
                      <Sparkles className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </div>
                    
                    {/* Tooltip content - visible on hover */}
                    <div className="absolute right-full mr-2 bg-white dark:bg-gray-800 rounded-md py-1.5 px-3 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                      Generate papers with a single prompt
                      <div className="absolute top-1/2 right-0 w-2 h-2 bg-white dark:bg-gray-800 border-t border-r border-gray-200 dark:border-gray-700 transform translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-5 lg:bottom-10 flex flex-col items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Add large academic partners section below hero */}
      <section className="py-14 relative overflow-hidden border-y border-gray-100 dark:border-gray-800">
        {/* Background with gradient for both light and dark themes */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-gray-100 to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pointer-events-none"></div>
        
        {/* Subtle glow effects for both light and dark themes */}
        <div className="absolute -left-20 top-20 w-64 h-64 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-900/20 pointer-events-none"></div>
        <div className="absolute -right-20 bottom-10 w-64 h-64 rounded-full bg-purple-200/50 blur-3xl dark:bg-purple-900/20 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-12 text-center">Trusted by researchers from</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 gap-y-10 w-full">
              <div className="flex flex-col items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">arXiv</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">arXiv</span>
              </div>
              
              <div className="flex flex-col items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl font-bold text-orange-500 dark:text-orange-400">SS</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">Semantic Scholar</span>
              </div>
              
              <div className="flex flex-col items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">GS</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">Google Scholar</span>
              </div>
              
              <div className="flex flex-col items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">N</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">Nature</span>
              </div>
              
              <div className="flex flex-col items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl font-bold text-blue-700 dark:text-blue-400">IEEE</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">IEEE</span>
              </div>
              
              <div className="flex flex-col items-center justify-center group">
                <div className="w-16 h-16 rounded-full bg-white/90 dark:bg-gray-800 shadow-md backdrop-blur-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">S</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">Science</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900 relative">
        {/* Simple decorative elements for features section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-0 top-1/4 w-1 h-32 bg-gradient-to-b from-blue-300/0 via-blue-300/30 to-blue-300/0 dark:from-blue-600/0 dark:via-blue-600/15 dark:to-blue-600/0"></div>
          <div className="absolute right-0 bottom-1/4 w-1 h-32 bg-gradient-to-b from-purple-300/0 via-purple-300/30 to-purple-300/0 dark:from-purple-600/0 dark:via-purple-600/15 dark:to-purple-600/0"></div>
          
          <svg className="absolute top-10 right-10 w-24 h-24 text-blue-200/20 dark:text-blue-900/10 transform rotate-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" strokeWidth="2" stroke="currentColor" strokeDasharray="6 4" />
          </svg>
          
          <svg className="absolute bottom-10 left-10 w-16 h-16 text-purple-200/20 dark:text-purple-900/10 transform -rotate-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" strokeWidth="2" stroke="currentColor" strokeDasharray="6 4" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Supercharge Your Research</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              IdeaVerse provides powerful AI-driven tools to generate novel research ideas, 
              draft papers, and implement code solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Lightbulb}
              title="Idea Generation"
              description="Generate novel research ideas across multiple domains with our specialized AI models trained on research papers."
            />
            
            <FeatureCard 
              icon={FileText}
              title="Paper Drafting"
              description="Transform ideas into comprehensive research papers with proper structure, citations, and methodology sections."
            />
            
            <FeatureCard 
              icon={Code}
              title="Code Implementation"
              description="Generate functioning code implementations of research ideas in multiple programming languages."
            />
            
            <FeatureCard 
              icon={Brain}
              title="Research Assistant"
              description="Get insightful answers to research questions and assistance with literature reviews and analysis."
            />
            
            <FeatureCard 
              icon={Sparkles}
              title="Novelty Assessment"
              description="Evaluate how novel your research ideas are compared to existing literature with our uniqueness scoring."
            />
            
            <FeatureCard 
              icon={ArrowRight}
              title="Collaborative Workflow"
              description="Share and collaborate on research ideas, papers, and code implementations with team members."
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background elements for pricing section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-100/50 dark:bg-purple-900/10 blur-3xl"></div>
          
          <svg className="absolute top-1/4 left-10 w-12 h-12 text-blue-200/30 dark:text-blue-900/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" strokeWidth="3" stroke="currentColor" strokeDasharray="10 15" />
          </svg>
          
          <svg className="absolute bottom-1/4 right-10 w-16 h-16 text-purple-200/30 dark:text-purple-900/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,15 85,85 15,85" strokeWidth="3" stroke="currentColor" fill="none" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for your research needs with our credits-based system.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free Starter</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
                  <span className="text-gray-500 dark:text-gray-400 pb-1">/month</span>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                  Perfect for trying out IdeaVerse for your research projects.
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">50 free credits to start</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Basic idea generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Limited paper drafting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Community support</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-500">Code implementation</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-500">Novelty assessment</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-6 pb-6">
                <Link href="/signup" className="block w-full py-3 px-4 text-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 font-medium transition-colors">
                  Get started
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/30 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative">
              <div className="absolute top-0 right-0">
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              </div>
              
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pro Researcher</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$29</span>
                  <span className="text-gray-500 dark:text-gray-400 pb-1">/month</span>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                  For serious researchers who need comprehensive AI assistance.
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">500 credits monthly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Advanced idea generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Full paper drafting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Basic code implementation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Email & chat support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Novelty assessment</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-6 pb-6">
                <Link href="/signup?plan=pro" className="block w-full py-3 px-4 text-center rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium transition-colors">
                  Get Pro
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">$99</span>
                  <span className="text-gray-500 dark:text-gray-400 pb-1">/month</span>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                  For research teams and institutions with advanced needs.
                </p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">2000 credits monthly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Premium idea generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Advanced paper drafting</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Advanced code implementation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">Team collaboration</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-6 pb-6">
                <Link href="/contact" className="block w-full py-3 px-4 text-center rounded-lg border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium transition-colors">
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
          
          {/* BITS Pilani Special Offer */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-xl p-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <svg className="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-2">
                      SPECIAL OFFER
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free Plan for BITS Pilani Students</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Students from BITS Pilani get our Pro plan features completely free. 
                      Just sign up with your BITS email address.
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Link 
                      href="/signup?source=bits" 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    >
                      Claim offer
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Frequently Asked Questions</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How do credits work?</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Credits are used to generate content with our AI. Different features cost different amounts of credits - 
                  for example, generating a basic research idea might cost 5 credits, while drafting a full paper might cost 25-50 credits.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Can I roll over unused credits?</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, unused credits roll over month to month up to a maximum of 3 times your monthly allocation.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How do I verify I'm a BITS Pilani student?</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Sign up with your official BITS Pilani email address and we'll automatically verify your student status. Your account will be upgraded to the BITS special plan within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white relative overflow-hidden">
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
          <h2 className="text-3xl font-bold mb-6">Ready to revolutionize your research workflow?</h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-3xl mx-auto">
            Join thousands of researchers who are already using IdeaVerse to accelerate their discoveries and innovations.
          </p>
          
          <Link 
            href="/signup" 
            className="inline-flex items-center px-8 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            Get started free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

        {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
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
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Revolutionizing research workflows with AI-powered idea generation and implementation.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">API</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Guides</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Tutorials</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Webinars</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} IdeaVerse. All rights reserved.
            </p>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </Link>
              
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

