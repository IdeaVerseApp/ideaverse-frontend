"use client"

import { useState, useEffect } from "react"

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
        className={`relative font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 font-bold tracking-wide drop-shadow-[0_0_2px_rgba(59,130,246,0.1)] dark:drop-shadow-[0_0_2px_rgba(147,197,253,0.1)] ${textEffect === "text-shadow-pulse" ? "animate-text-shadow-pulse" : ""} ${textEffect === "scale-in" ? "animate-scale-in" : ""}`}
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

export default TypeWriter; 