"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Diamond, Sparkles, Lightbulb, Loader2, ChevronDown, Heart, Zap, Building, GraduationCap } from "lucide-react"
import { useIdea } from "@/context/IdeaContext"
import { generateIdeas, generateFollowUpQuestions, getIdea } from "@/services/idea-service"
import { useAuth } from "@/context/AuthContext"
import FollowUpQuestions from "./follow-up-questions"

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
  const [catchyLine, setCatchyLine] = useState("")
  const [followUpQuestionsLoading, setFollowUpQuestionsLoading] = useState(false)
  const [followUpQuestions, setFollowUpQuestions] = useState<any[]>([])
  const [showFollowUpQuestions, setShowFollowUpQuestions] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const catchyLines = [
    "Ready to explore new ideas?",
    "Time to spark your creativity!",
    "Let's discover something amazing",
    "What's your next big idea?",
    "Ready to innovate?",
    "Let your ideas take flight",
    "Time to think differently",
    "Ready to create something new?",
    "Let's explore possibilities",
    "What will you create today?"
  ]

  // Set random catchy line only once when component mounts
  useEffect(() => {
    setCatchyLine(catchyLines[Math.floor(Math.random() * catchyLines.length)])
  }, [])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, Math.min(300, textareaRef.current.scrollHeight))}px`;
    }
  }, [researchIdea]);

  const ideaTemplates = [
    "AI in Healthcare",
    "Sustainable Energy",
    "Smart Cities",
    "Education Tech",
    "Climate Change"
  ]

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

  const handleStartIdeaGeneration = async () => {
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
    setFollowUpQuestionsLoading(true)
    
    try {
      // Update the global state
      setExperiment(researchIdea)
      
      // Generate follow-up questions first
      const response = await generateFollowUpQuestions({
        task_description: researchIdea,
        code: "",
        num_ideas: numIdeas
      })
      
      // If we have a task ID and follow-up questions, show them
      if (response && response.task_id) {
        setCurrentTaskId(response.task_id)
        
        if (response.follow_up_questions && response.follow_up_questions.length > 0) {
          setFollowUpQuestions(response.follow_up_questions)
          setShowFollowUpQuestions(true)
        } else {
          // If no follow-up questions were generated, proceed directly to idea generation
          await handleGenerateIdeasDirectly(response.task_id)
        }
      } else {
        setError("Failed to start idea generation. Please try again.")
      }
    } catch (err) {
      console.error("Error starting idea generation:", err)
      setError("An error occurred while starting idea generation. Please try again.")
    } finally {
      setFollowUpQuestionsLoading(false)
    }
  }

  const handleFollowUpQuestionsComplete = async () => {
    if (!currentTaskId) {
      setError("Task ID is missing. Please try again.")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Fetch the updated task with answers
      const taskResponse = await getIdea(currentTaskId)
      
      // Navigate to the idea details page
      router.push(`/ideas/${currentTaskId}`)
    } catch (err) {
      console.error("Error after follow-up questions:", err)
      setError("An error occurred while processing your answers. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGenerateIdeasDirectly = async (taskId: string) => {
    setIsLoading(true)
    
    try {
      // Call the API to generate ideas directly with the existing task ID
      const response = await generateIdeas({
        task_id: taskId,
        task_description: researchIdea,
        code: "",
        num_ideas: numIdeas,
        num_reflections: 3,
        system_prompt: `Use the ${generationMethods[selectedMethod].name} method: ${generationMethods[selectedMethod].description}`
      })
      
      // Navigate to the idea details page
      router.push(`/ideas/${taskId}`)
    } catch (err) {
      console.error("Error generating ideas:", err)
      setError("An error occurred while generating ideas. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto pt-20 pb-12 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-medium text-foreground/90 mb-4 text-center tracking-tight">
            {catchyLine}
          </h1>
        </div>

        {showFollowUpQuestions ? (
          <FollowUpQuestions 
            taskId={currentTaskId || ""}
            questions={followUpQuestions}
            onComplete={handleFollowUpQuestionsComplete}
          />
        ) : (
          <div className="space-y-4">
            {/* Research idea input with controls inside */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                id="research-idea"
                className={`w-full p-4 pb-16 bg-gray-50 dark:bg-gray-700 border ${
                  error ? "border-red-500" : "border-gray-200 dark:border-gray-600"
                } rounded-lg focus:ring-2 focus:ring-slate-500/30 focus:border-transparent resize-none text-gray-900 dark:text-gray-100 min-h-[120px] max-h-[300px] overflow-y-auto`}
                placeholder="Describe your idea topic..."
                value={researchIdea}
                onChange={(e) => {
                  setResearchIdea(e.target.value)
                  if (e.target.value.trim()) setError("")
                }}
                disabled={isLoading || followUpQuestionsLoading}
              />
              
              {/* Controls inside the text area */}
              <div className="absolute left-3 bottom-3 flex items-center gap-3">
                {/* Generation method selector - dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-between px-2.5 py-1 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-500/30 dark:focus:ring-slate-300/30 text-gray-800 dark:text-gray-200 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    disabled={isLoading || followUpQuestionsLoading}
                  >
                    <div className="flex items-center">
                      <span className="mr-1.5 text-slate-600 dark:text-slate-300">
                        {generationMethods[selectedMethod].icon}
                      </span>
                      <span className="truncate">{generationMethods[selectedMethod].name}</span>
                    </div>
                    <ChevronDown className="h-3 w-3 ml-1.5 text-gray-500 dark:text-gray-400 shrink-0" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-10 top-full mt-1 w-40 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {Object.entries(generationMethods).map(([key, method]) => (
                          <li key={key}>
                            <button
                              type="button"
                              className={`w-full text-left px-3 py-1.5 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                                selectedMethod === key 
                                  ? "bg-slate-200 dark:bg-slate-300/20 text-slate-700 dark:text-slate-200" 
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
                <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm px-2.5 py-1 border border-gray-200/50 dark:border-gray-600/50 rounded-lg">
                  <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">Ideas:</span>
                  <div className="w-24">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="range"
                        id="numIdeas"
                        name="numIdeas"
                        min="1"
                        max="10"
                        value={numIdeas}
                        onChange={(e) => setNumIdeas(parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-300/80 dark:bg-gray-600/80 rounded-lg appearance-none cursor-pointer accent-slate-600 dark:accent-slate-300"
                        disabled={isLoading || followUpQuestionsLoading}
                      />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 min-w-[1.5ch]">{numIdeas}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Generate button */}
              {researchIdea.trim() && (
                <button
                  className={`absolute right-3 bottom-3 px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    isLoading || followUpQuestionsLoading
                      ? 'bg-slate-600/70 dark:bg-slate-300/80' 
                      : 'bg-slate-600 hover:bg-slate-700 dark:bg-slate-300 dark:hover:bg-slate-200'
                  } text-white dark:text-slate-800`}
                  onClick={handleStartIdeaGeneration}
                  disabled={isLoading || followUpQuestionsLoading}
                >
                  {isLoading || followUpQuestionsLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {followUpQuestionsLoading ? "Preparing..." : "Generating..."}
                    </>
                  ) : (
                    'Generate'
                  )}
                </button>
              )}
            </div>

            {/* Idea Templates */}
            <div className="flex flex-wrap gap-2 -mt-2">
              {ideaTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setResearchIdea(template)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  disabled={isLoading || followUpQuestionsLoading}
                >
                  {template}
                </button>
              ))}
            </div>

            {error && <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>}
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <a href="#" className="text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 font-medium">Read our guide to effective idea generation →</a>
        </div>
      </div>
    </div>
  )
}

