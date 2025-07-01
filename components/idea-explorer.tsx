"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Diamond, Sparkles, Lightbulb, Loader2, ChevronDown, Heart, Zap, Building, GraduationCap, ArrowRight } from "lucide-react"
import { useIdea } from "@/context/IdeaContext"
import { generateIdeas, generateFollowUpQuestions, getIdea } from "@/services/idea-service"
import { useAuth } from "@/context/AuthContext"
import FollowUpQuestions from "./follow-up-questions"
import { motion } from "framer-motion"

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

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setError("")
    setFollowUpQuestionsLoading(true)
    
    try {
      setExperiment(researchIdea)
      
      const response = await generateFollowUpQuestions({
        task_description: researchIdea,
        code: "",
        num_ideas: numIdeas
      })
      
      if (response && response.task_id) {
        setCurrentTaskId(response.task_id)

        const waitForQuestions = async () => {
          let attempts = 0;
          const maxAttempts = 10;
          while (attempts < maxAttempts) {
            try {
              const updatedTask = await getIdea(response.task_id)
              if (updatedTask.follow_up_questions && updatedTask.follow_up_questions.length > 0) {
                setFollowUpQuestions(updatedTask.follow_up_questions)
                setShowFollowUpQuestions(true)
                return
              }
            } catch (err) {
              console.error("Polling attempt failed", err)
            }
            await new Promise(res => setTimeout(res, 2000))
            attempts += 1
          }
          await handleGenerateIdeasDirectly(response.task_id)
        }

        waitForQuestions()
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
      const taskResponse = await getIdea(currentTaskId)
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
      const response = await generateIdeas({
        task_id: taskId,
        task_description: researchIdea,
        code: "",
        num_ideas: numIdeas,
        num_reflections: 3,
        system_prompt: `Use the ${generationMethods[selectedMethod].name} method: ${generationMethods[selectedMethod].description}`
      })
      
      router.push(`/ideas/${taskId}`)
    } catch (err) {
      console.error("Error generating ideas:", err)
      setError("An error occurred while generating ideas. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 -z-10 h-full w-full bg-gray-900 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]"></div>
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <h1 className="text-5xl font-bold text-gray-50 mb-6 text-center tracking-tight">
            {catchyLine}
          </h1>

          {showFollowUpQuestions ? (
            <FollowUpQuestions 
              taskId={currentTaskId || ""}
              questions={followUpQuestions}
              onComplete={handleFollowUpQuestionsComplete}
            />
          ) : (
            <div className="space-y-6 w-full">
              <div className="relative w-full">
                <textarea
                  ref={textareaRef}
                  id="research-idea"
                  className="w-full p-6 pb-20 bg-gray-800/80 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 transition-colors duration-300 resize-none text-gray-100 text-lg placeholder-gray-400 min-h-[150px] max-h-[400px] overflow-y-auto backdrop-blur-sm"
                  placeholder="Describe your idea topic..."
                  value={researchIdea}
                  onChange={(e) => {
                    setResearchIdea(e.target.value)
                    if (e.target.value.trim()) setError("")
                  }}
                  disabled={isLoading || followUpQuestionsLoading}
                />
                
                <div className="absolute left-4 bottom-4 flex items-center gap-4 w-full pr-8">
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center justify-between px-3 py-1.5 bg-gray-700/80 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-gray-200 hover:bg-gray-700 transition-colors"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      disabled={isLoading || followUpQuestionsLoading}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-blue-400">
                          {generationMethods[selectedMethod].icon}
                        </span>
                        <span className="truncate">{generationMethods[selectedMethod].name}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                    </button>
                    {dropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-0 mb-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden"
                      >
                        {Object.keys(generationMethods).map((key) => (
                          <button
                            key={key}
                            className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 flex items-center"
                            onClick={() => {
                              setSelectedMethod(key as GenerationMethod)
                              setDropdownOpen(false)
                            }}
                          >
                            <span className="mr-3 text-blue-400">{generationMethods[key as GenerationMethod].icon}</span>
                            {generationMethods[key as GenerationMethod].name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>Ideas:</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={numIdeas}
                      onChange={(e) => setNumIdeas(parseInt(e.target.value))}
                      className="w-24 h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                      disabled={isLoading || followUpQuestionsLoading}
                    />
                    <span className="font-semibold">{numIdeas}</span>
                  </div>

                  <button
                    onClick={handleStartIdeaGeneration}
                    className="ml-auto flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                    disabled={isLoading || followUpQuestionsLoading || !researchIdea.trim()}
                  >
                    {isLoading || followUpQuestionsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Generating</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="text-gray-400">or try a template:</span>
                {ideaTemplates.map((template) => (
                  <button
                    key={template}
                    onClick={() => setResearchIdea(template)}
                    className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full hover:bg-gray-700 hover:border-gray-600 transition-colors text-gray-300"
                    disabled={isLoading || followUpQuestionsLoading}
                  >
                    {template}
                  </button>
                ))}
              </div>
              
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}

              <div className="text-center mt-8">
                <a href="#" className="text-sm text-gray-400 hover:text-gray-200 transition-colors flex items-center justify-center gap-2">
                  Read our guide to effective idea generation
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

