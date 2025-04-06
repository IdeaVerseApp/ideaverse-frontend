"use client"

import { useState, useEffect } from "react"
import { Plus, MoreVertical, Star, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { UserData, ResearchIdea } from "@/types/user"

// Dropdown menu for idea actions
const IdeaActionsMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40">
      <div className="py-1">
        <button className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
          <Star className="h-4 w-4 mr-2 text-gray-500" />
          <span>Refine Idea</span>
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
          <svg
            className="h-4 w-4 mr-2 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy Idea</span>
        </button>
        <button className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
          <svg
            className="h-4 w-4 mr-2 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>Save Idea</span>
        </button>
      </div>
    </div>
  )
}

// Research idea card component
const ResearchIdeaCard = ({
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

  const handleExpandGenerate = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push("/login")
      return
    }

    onNavigate("ideas", idea.id)
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white mb-6 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-gray-700">
            #{index + 1}. {idea.title}
          </h3>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
            <IdeaActionsMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>
        </div>

        <div className="text-gray-500 mb-4">
          <p>Seed Idea: {idea.experiment.split(" ").slice(0, 8).join(" ")}...</p>
          <div className="flex flex-wrap gap-x-8 mt-2">
            <span>Idea</span>
            <span>Cost $0.20</span>
            <span>Generation Method: Diamond Mine</span>
          </div>
        </div>

        <p className="text-gray-600 mb-3">{idea.experiment}</p>

        <div className="text-gray-500 text-sm">
          <p>
            The number of pages is 8... <button className="text-blue-500 hover:underline">Read more</button>
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <div className="text-blue-500">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>

          <button
            onClick={handleExpandGenerate}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span>Expand & Generate</span>
          </button>
        </div>
      </div>

      <div className="flex border-t border-gray-200">
        <div className="w-1/2 p-4 flex flex-col items-center border-r border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Novelty Score</div>
          <div className="text-4xl font-bold text-blue-400">{idea.novelty * 10}</div>
        </div>
        <div className="w-1/2 p-4 flex flex-col items-center">
          <div className="text-sm text-gray-500 mb-1">Feasibility Score</div>
          <div className="text-4xl font-bold text-blue-400">{idea.feasibility * 10}</div>
        </div>
      </div>
    </div>
  )
}

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
        console.error("Error fetching research ideas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userData])

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
          <svg viewBox="0 0 100 60" className="h-full w-full text-blue-500">
            <path
              d="M30,30 C30,16.8 41.8,5 55,5 C68.2,5 80,16.8 80,30 C80,43.2 68.2,55 55,55 C48.5,55 42.5,52.5 38,48.5 C33.5,52.5 27.5,55 21,55 C7.8,55 -4,43.2 -4,30 C-4,16.8 7.8,5 21,5 C27.5,5 33.5,7.5 38,11.5 C42.5,7.5 48.5,5 55,5"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">IdeaVerse</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Discover, develop, and document groundbreaking research ideas with AI assistance
        </p>
      </div>

      {/* Welcome Message */}
      {userData && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-medium">
            Welcome back, <span className="font-bold">{userName}</span>
          </h2>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Research Ideas</h2>
        <button
          className="flex items-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          onClick={() => handleNavigate("ideas")}
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>Create New Research Thread</span>
        </button>
      </div>

      {/* Research Ideas Section */}
      <div className="mb-8">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="h-7 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between mt-6">
                  <div className="h-10 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-40 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {researchIdeas.map((idea, index) => (
              <ResearchIdeaCard key={idea.id} idea={idea} index={index} onNavigate={handleNavigate} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
            onClick={() => router.push("/ideas")}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Idea Explorer</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">Brainstorm and develop new research concepts with AI assistance</p>
          </div>

          <div
            className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
            onClick={() => router.push("/code")}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Code Generation</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">Generate implementation code for your research algorithms and models</p>
          </div>

          <div
            className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
            onClick={() => router.push("/paper")}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Research Paper</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">Draft and structure research papers with AI writing assistance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

