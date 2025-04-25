"use client"

import { useState, useEffect, useMemo, memo } from "react"
import { Plus, MoreVertical, Star, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { UserData, ResearchIdea } from "@/types/user"
import { useAuth } from "@/context/AuthContext"

// Dropdown menu for idea actions - memoized to prevent unnecessary re-renders
const IdeaActionsMenu = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10 w-40">
      <div className="py-1">
        <button className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">
          <Star className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="dark:text-gray-200">Refine Idea</span>
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg
            className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span className="dark:text-gray-200">Copy Idea</span>
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg
            className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span className="dark:text-gray-200">Save Idea</span>
        </button>
      </div>
    </div>
  )
})

IdeaActionsMenu.displayName = 'IdeaActionsMenu'

// Research idea card component - memoized to prevent unnecessary re-renders
const ResearchIdeaCard = memo(({
  idea,
  index,
  onNavigate,
}: {
  idea: ResearchIdea
  index: number
  onNavigate: (view: "ideas" | "code" | "paper", ideaId?: string | number) => void
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleExpandGenerate = () => {
    // Check if user is logged in using auth context
    if (!isAuthenticated) {
      // Redirect to login page if not logged in
      router.push("/login")
      return
    }

    onNavigate("ideas", idea.id)
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mb-6 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            #{index + 1}. {idea.title}
          </h3>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <IdeaActionsMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>
        </div>

        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <p>Seed Idea: {idea.experiment.split(" ").slice(0, 8).join(" ")}...</p>
          <div className="flex flex-wrap gap-x-8 mt-2">
            <span>Idea</span>
            <span>Cost $0.20</span>
            <span>Generation Method: Diamond Mine</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-3">{idea.experiment}</p>

        <div className="text-gray-500 dark:text-gray-400 text-sm">
          <p>
            The number of pages is 8... <button className="text-blue-500 dark:text-blue-400 hover:underline">Read more</button>
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <div className="text-blue-500 dark:text-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>

          <button
            onClick={handleExpandGenerate}
            className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span>Expand & Generate</span>
          </button>
        </div>
      </div>

      <div className="flex border-t border-gray-200 dark:border-gray-700">
        <div className="w-1/2 p-4 flex flex-col items-center border-r border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Novelty Score</div>
          <div className="text-4xl font-bold text-blue-400 dark:text-blue-500">{idea.novelty * 10}</div>
        </div>
        <div className="w-1/2 p-4 flex flex-col items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Feasibility Score</div>
          <div className="text-4xl font-bold text-blue-400 dark:text-blue-500">{idea.feasibility * 10}</div>
        </div>
      </div>
    </div>
  )
})

ResearchIdeaCard.displayName = 'ResearchIdeaCard'

interface DashboardProps {
  onNavigate: (view: "ideas" | "code" | "paper", ideaId?: string | number) => void
  userData?: UserData | null
}

export default function Dashboard({ onNavigate, userData }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [researchIdeas, setResearchIdeas] = useState<ResearchIdea[]>([])
  const router = useRouter()

  // Use userData if provided, otherwise fetch mock data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (userData) {
          setResearchIdeas(userData.researchIdeas)
        } else {
          // Mock data if userData is not provided
          const mockIdeas: ResearchIdea[] = [
            {
              id: 1,
              name: "Dr. Alex Johnson",
              title: "Adaptive Compiler Optimization",
              experiment:
                "A compiler enhancement that leverages reinforcement learning to dynamically tune code optimizations based on hardware performance data.",
              interestingness: 8,
              feasibility: 2,
              novelty: 7.8,
              novel: true,
              code: ["compiler_opt.py", "reinforcement_model.py"],
              paper: "/papers/adaptive_compiler.pdf",
              category: "Compiler Design",
              date: "2 days ago",
            },
            {
              id: 2,
              name: "Dr. Sarah Chen",
              title: "Code Refactoring AI",
              experiment:
                "An AI tool that progressively suggests code refactoring steps by analyzing performance bottlenecks, ensuring minimal manual intervention.",
              interestingness: 7,
              feasibility: 8,
              novelty: 4.5,
              novel: true,
              code: ["refactor_ai.py", "code_analyzer.py"],
              paper: "",
              category: "Software Engineering",
              date: "1 week ago",
            },
            {
              id: 3,
              name: "Dr. Michael Rodriguez",
              title: "Quantum Code Accelerators",
              experiment:
                "A framework for automatically identifying code segments that can benefit from quantum acceleration and generating the necessary quantum circuits.",
              interestingness: 9,
              feasibility: 6.6,
              novelty: 2,
              novel: true,
              code: ["quantum_accelerator.py"],
              paper: "/papers/quantum_acceleration.pdf",
              category: "Quantum Computing",
              date: "2 weeks ago",
            },
          ]
          setResearchIdeas(mockIdeas)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userData])

  // Memoize the research ideas to prevent unnecessary re-renders
  const memoizedIdeas = useMemo(() => {
    return researchIdeas.map((idea, index) => (
      <ResearchIdeaCard
        key={idea.id}
        idea={idea}
        index={index}
        onNavigate={onNavigate}
      />
    ))
  }, [researchIdeas, onNavigate])

  // Get user name if available
  const userName = userData?.personalInformation[0]?.name || "Researcher"

  const handleNavigate = (view: "ideas" | "code" | "paper", ideaId?: string | number) => {
    onNavigate(view, ideaId)
  }

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-24 px-4">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="h-16 w-16 mb-4">
          <svg viewBox="0 0 100 60" className="h-full w-full text-blue-500 dark:text-blue-400">
            <path
              d="M30,30 C30,16.8 41.8,5 55,5 C68.2,5 80,16.8 80,30 C80,43.2 68.2,55 55,55 C48.5,55 42.5,52.5 38,48.5 C33.5,52.5 27.5,55 21,55 C7.8,55 -4,43.2 -4,30 C-4,16.8 7.8,5 21,5 C27.5,5 33.5,7.5 38,11.5 C42.5,7.5 48.5,5 55,5"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="21" cy="30" r="12" fill="currentColor" fillOpacity="0.2" />
            <circle cx="55" cy="30" r="12" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          Explore your recent research ideas or create new ones. Your AI-powered research companion is ready to help.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <button
          onClick={() => handleNavigate("ideas")}
          className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 px-6 py-3 rounded-md font-medium flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Generate New Idea</span>
        </button>
        <button className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-6 py-3 rounded-md font-medium flex items-center justify-center">
          <svg
            className="h-5 w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>View All Papers</span>
        </button>
      </div>

      {/* Recent Ideas Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Ideas</h2>
          <button className="text-blue-600 dark:text-blue-400 flex items-center text-sm font-medium hover:underline">
            <span>View All</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        ) : (
          <div>{memoizedIdeas}</div>
        )}
      </div>

      {/* Research Metrics */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Research Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Ideas Generated</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">48</div>
            <div className="mt-1 text-sm text-green-600 dark:text-green-400">+12% from previous period</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Average Novelty</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">All ideas</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">7.4</div>
            <div className="mt-1 text-sm text-red-600 dark:text-red-400">-2.1% from previous period</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Code Snippets</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generated</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white">124</div>
            <div className="mt-1 text-sm text-green-600 dark:text-green-400">+18.3% from previous period</div>
          </div>
        </div>
      </div>
    </div>
  )
}

