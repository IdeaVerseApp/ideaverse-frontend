"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface IdeaContextType {
  experiment: string
  setExperiment: (idea: string) => void
  clearExperiment: () => void
}

const IdeaContext = createContext<IdeaContextType | undefined>(undefined)

export function IdeaProvider({ children }: { children: ReactNode }) {
  const [experiment, setExperiment] = useState<string>("")

  // Initialize from localStorage on client side
  useEffect(() => {
    const storedIdea = localStorage.getItem("currentResearchIdea")
    if (storedIdea) {
      setExperiment(storedIdea)
    }
  }, [])

  // Update localStorage when experiment changes
  useEffect(() => {
    if (experiment) {
      localStorage.setItem("currentResearchIdea", experiment)
    }
  }, [experiment])

  const clearExperiment = () => {
    setExperiment("")
    localStorage.removeItem("currentResearchIdea")
  }

  return <IdeaContext.Provider value={{ experiment, setExperiment, clearExperiment }}>{children}</IdeaContext.Provider>
}

export function useIdea() {
  const context = useContext(IdeaContext)
  if (context === undefined) {
    throw new Error("useIdea must be used within an IdeaProvider")
  }
  return context
}

