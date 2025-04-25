"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Diamond, Sparkles, Lightbulb, Loader2, ChevronDown } from "lucide-react"
import { useIdea } from "@/context/IdeaContext"
import { generateIdeas } from "@/services/idea-service"
import { useAuth } from "@/context/AuthContext"

interface IdeaExplorerProps {
  ideaId?: string | number
}

type GenerationMethod = "auto" | "reverse-spark" | "idea-chain" | "diamond-mine"

export default function IdeaExplorer({ ideaId }: IdeaExplorerProps) {
  const router = useRouter()
  const { experiment, setExperiment } = useIdea()
  const { isAuthenticated } = useAuth()
  const [researchIdea, setResearchIdea] = useState(experiment)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [numIdeas, setNumIdeas] = useState(5)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<GenerationMethod>("diamond-mine")

  const generationMethods = {
    "auto": {
      name: "Auto",
      description: "Adapts to each query",
      icon: <Sparkles className="h-4 w-4" />
    },
    "reverse-spark": {
      name: "Reverse Spark",
      description: "Start with problems, uncover solutions",
      icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 16l10-10M17 16V6h-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    },
    "idea-chain": {
      name: "Idea Chain",
      description: "Expand ideas step by step",
      icon: <Lightbulb className="h-4 w-4" />
    },
    "diamond-mine": {
      name: "Diamond Mine",
      description: "Generate many ideas, refine the best",
      icon: <Diamond className="h-4 w-4" />
    }
  }

  const handleGenerateIdeas = async () => {
    if (!researchIdea.trim()) {
      setError("Please enter a research idea before generating")
      return
    }

    // Check if user is logged in using auth context
    if (!isAuthenticated) {
      // Redirect to login page if not logged in
      router.push("/login")
      return
    }

    setError("")
    setIsLoading(true)
    
    try {
      // Update the global state
      setExperiment(researchIdea)
      
      // Call the API to generate ideas
      const response = await generateIdeas({
        task_description: researchIdea,
        code: "",
        num_ideas: numIdeas,
        num_reflections: 3,
        system_prompt: `Use the ${generationMethods[selectedMethod].name} method: ${generationMethods[selectedMethod].description}`
      })
      
      // Navigate to the idea details page if we have a task ID
      if (response && response.task_id) {
        router.push(`/ideas/${response.task_id}`)
      } else {
        setError("Failed to start idea generation. Please try again.")
      }
    } catch (err) {
      console.error("Error generating ideas:", err)
      setError("An error occurred while generating ideas. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto pt-20 pb-12 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-center">Which idea topic would you like to explore?</h1>
        </div>

        <div className="space-y-4">
          {/* Research idea input */}
          <div className="relative">
            <textarea
              id="research-idea"
              className={`w-full p-4 pr-32 bg-gray-50 dark:bg-gray-700 border ${
                error ? "border-red-500" : "border-gray-200 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-slate-500/30 focus:border-transparent resize-none text-gray-900 dark:text-gray-100`}
              placeholder="Describe your idea topic..."
              rows={3}
              value={researchIdea}
              onChange={(e) => {
                setResearchIdea(e.target.value)
                if (e.target.value.trim()) setError("")
              }}
              disabled={isLoading}
            />
            {researchIdea.trim() && (
              <button
                className={`absolute right-3 bottom-3 px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  isLoading 
                    ? 'bg-slate-600/70 dark:bg-slate-300/80' 
                    : 'bg-slate-600 hover:bg-slate-700 dark:bg-slate-300 dark:hover:bg-slate-200'
                } text-white dark:text-slate-800`}
                onClick={handleGenerateIdeas}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            )}
          </div>

          {error && <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>}

          {/* Controls row */}
          <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800/50 p-3 rounded-lg">
            {/* Generation method selector - dropdown */}
            <div className="relative w-40">
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/30 dark:focus:ring-slate-300/30 text-gray-800 dark:text-gray-200"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={isLoading}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-slate-600 dark:text-slate-300">
                    {generationMethods[selectedMethod].icon}
                  </span>
                  <span className="truncate">{generationMethods[selectedMethod].name}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-40 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <ul className="py-1 max-h-60 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {Object.entries(generationMethods).map(([key, method]) => (
                      <li key={key}>
                        <button
                          type="button"
                          className={`w-full text-left px-3 py-1.5 flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedMethod === key 
                              ? "bg-slate-100/50 dark:bg-slate-300/20 text-slate-700 dark:text-slate-200" 
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                          onClick={() => {
                            setSelectedMethod(key as GenerationMethod)
                            setDropdownOpen(false)
                          }}
                        >
                          <span className="mr-2 text-slate-600 dark:text-slate-300">{method.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{method.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Number of ideas slider */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Ideas:</span>
              <div className="w-32">
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    id="numIdeas"
                    name="numIdeas"
                    min="1"
                    max="10"
                    value={numIdeas}
                    onChange={(e) => setNumIdeas(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-slate-600 dark:accent-slate-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 min-w-[2ch]">{numIdeas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <a href="#" className="text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 font-medium">Read our guide to effective idea generation →</a>
        </div>
      </div>
    </div>
  )
}

