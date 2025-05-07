"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface GeneratedData {
  code: string;
  output: string;
}

interface IdeaContextType {
  experiment: string;
  setExperiment: (idea: string) => void;
  clearExperiment: () => void;
  generatedData: GeneratedData | null;
  setGeneratedData: (data: GeneratedData) => void;
  clearGeneratedData: () => void;
}

const IdeaContext = createContext<IdeaContextType | undefined>(undefined)

export function IdeaProvider({ children }: { children: ReactNode }) {
  const [experiment, setExperiment] = useState<string>("")
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null)

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

  // Clear generated data when experiment changes
  useEffect(() => {
    clearGeneratedData(); // Clear generated data when the experiment changes
  }, [experiment]);

  const clearExperiment = () => {
    setExperiment("")
    localStorage.removeItem("currentResearchIdea")
  }

  const clearGeneratedData = () => {
    setGeneratedData(null)
  }

  return (
    <IdeaContext.Provider value={{ 
      experiment, 
      setExperiment, 
      clearExperiment, 
      generatedData, 
      setGeneratedData, 
      clearGeneratedData 
    }}>
      {children}
    </IdeaContext.Provider>
  )
}

export function useIdea() {
  const context = useContext(IdeaContext)
  if (context === undefined) {
    throw new Error("useIdea must be used within an IdeaProvider")
  }
  return context
}

