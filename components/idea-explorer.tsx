"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Diamond, Sparkles, Lightbulb } from "lucide-react"
import { useIdea } from "@/context/IdeaContext"

interface IdeaExplorerProps {
  ideaId?: string | number
}

export default function IdeaExplorer({ ideaId }: IdeaExplorerProps) {
  const router = useRouter()
  const { experiment, setExperiment, clearGeneratedData } = useIdea()
  const [researchIdea, setResearchIdea] = useState(experiment)
  const [error, setError] = useState("")

  const handleGenerateIdeas = () => {
    if (!researchIdea.trim()) {
      setError("Please enter a research idea before generating")
      return
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push("/login")
      return
    }

    setError("")
    // Update the global state
    setExperiment(researchIdea)
    console.log("from here 1")
    clearGeneratedData()
    // Navigate to the idea exploration page
    router.push("/ideaexploration")
  }

  return (
    <div className="max-w-3xl mx-auto pt-16 pb-24 px-4">
      <div className="flex flex-col items-center mb-12">
        <div className="h-20 w-20 mb-6">
          <svg viewBox="0 0 100 60" className="h-full w-full text-purple-600">
            <path
              d="M30,30 C30,16.8 41.8,5 55,5 C68.2,5 80,16.8 80,30 C80,43.2 68.2,55 55,55 C48.5,55 42.5,52.5 38,48.5 C33.5,52.5 27.5,55 21,55 C7.8,55 -4,43.2 -4,30 C-4,16.8 7.8,5 21,5 C27.5,5 33.5,7.5 38,11.5 C42.5,7.5 48.5,5 55,5"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">What research idea are you exploring?</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col space-y-4">
          {/* Text input for research ideas - now takes up the whole box */}
          <textarea
            className={`w-full p-4 border ${error ? "border-red-500" : "border-gray-200"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[150px]`}
            placeholder="Enter your research idea here..."
            value={researchIdea}
            onChange={(e) => {
              setResearchIdea(e.target.value)
              if (e.target.value.trim()) setError("")
            }}
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Generate button */}
          <button
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            onClick={handleGenerateIdeas}
          >
            Generate Ideas
          </button>
        </div>
      </div>

      

      <div className="mt-8 grid grid-cols-2 gap-4">
       
   
      </div>
    </div>
  )
}

