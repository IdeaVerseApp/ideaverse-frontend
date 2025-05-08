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
  setOutputData: (output: string) => void;
}

const IdeaContext = createContext<IdeaContextType | undefined>(undefined)

export function IdeaProvider({ children }: { children: ReactNode }) {
  const [experiment, setExperiment] = useState<string>("")
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null)

  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem("generatedData")
    if (storedData) {
      setGeneratedData(JSON.parse(storedData))
    }
  }, [])

  // Load experiment from localStorage
  useEffect(() => {
    const storedIdea = localStorage.getItem("currentResearchIdea")
    if (storedIdea) {
      setExperiment(storedIdea)
    }
  }, [])

  // Save experiment to localStorage
  useEffect(() => {
    if (experiment) {
      localStorage.setItem("currentResearchIdea", experiment)
    }
  }, [experiment])

  // Save generatedData to localStorage whenever it changes
  useEffect(() => {
    if (generatedData) {
      localStorage.setItem("generatedData", JSON.stringify(generatedData))
    }
  }, [generatedData])

  const clearExperiment = () => {
    setExperiment("")
    localStorage.removeItem("currentResearchIdea")
  }

  const clearGeneratedData = () => {
    setGeneratedData(null)
    localStorage.removeItem("generatedData") // Clear from localStorage
  }

  const setOutputData = (output: string) => {
    if (generatedData) {
      setGeneratedData({ ...generatedData, output })
    }
  }

  return (
    <IdeaContext.Provider value={{ 
      experiment, 
      setExperiment, 
      clearExperiment, 
      generatedData, 
      setGeneratedData, 
      clearGeneratedData,
      setOutputData
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

