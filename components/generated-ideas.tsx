"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getUserIdeas } from "@/services/idea-service"
import { Loader2, RefreshCw, Filter, SortAsc, SortDesc, Clock, Check, X, AlertCircle, ArrowLeft, Plus } from "lucide-react"
import FollowupQuestionCards from "./followup-question-cards"

interface FollowUpQuestion {
  id: string
  question: string
  context?: string
}

interface IdeaTask {
  _id: string          // MongoDB ObjectId
  task_id: string      // UUID
  user_id: string
  task_description: string
  status: string
  created_at: string
  ideas: string[]
  thought: string
  reflection_rounds: number
  follow_up_questions?: FollowUpQuestion[]
}

export default function GeneratedIdeas() {
  const [ideas, setIdeas] = useState<IdeaTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState(-1)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedIdeaForFollowup, setSelectedIdeaForFollowup] = useState<IdeaTask | null>(null)
  const [refreshCounter, setRefreshCounter] = useState(0)
  const router = useRouter()

  // Polling state
  const [isPolling, setIsPolling] = useState(false)
  const [pollInterval, setPollInterval] = useState(15000) // Start with 15 seconds
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollAttemptsRef = useRef(0)
  const maxPollAttempts = 30 // Maximum 10 minutes of polling (30 * 20 seconds average)

  const stopPolling = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current)
      pollTimeoutRef.current = null
    }
    setIsPolling(false)
    pollAttemptsRef.current = 0
  }, [])

  // Initial fetch and when filters change
  useEffect(() => {
    const loadIdeas = async () => {
      // Stop any existing polling before fetching new data
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current)
        pollTimeoutRef.current = null
      }
      setIsPolling(false)
      pollAttemptsRef.current = 0
      
      setLoading(true)
      setError(null)
      
      try {
        const data = await getUserIdeas({
          sort_by: sortBy,
          sort_order: sortOrder,
          status: statusFilter || undefined,
          limit: 50
        })
        
        if (Array.isArray(data)) {
          setIdeas(data)
          
          // Check if we should start polling
          const hasProcessingIdeas = data.some(idea => 
            idea.status.toLowerCase() === 'processing' || 
            idea.status.toLowerCase() === 'pending'
          )
          
          if (hasProcessingIdeas) {
            setIsPolling(true)
            pollAttemptsRef.current = 0
            setPollInterval(15000)
            
            const poll = async () => {
              pollAttemptsRef.current += 1
              
              try {
                const pollData = await getUserIdeas({
                  sort_by: sortBy,
                  sort_order: sortOrder,
                  status: statusFilter || undefined,
                  limit: 50
                })
                
                if (Array.isArray(pollData)) {
                  setIdeas(pollData)
                  
                  const stillProcessing = pollData.some(idea => 
                    idea.status.toLowerCase() === 'processing' || 
                    idea.status.toLowerCase() === 'pending'
                  )
                  
                  if (stillProcessing && pollAttemptsRef.current < maxPollAttempts) {
                    const nextInterval = Math.min(
                      15000 + (pollAttemptsRef.current * 3000), // Start at 15s, increase by 3s each attempt
                      60000 // Cap at 60 seconds
                    )
                    setPollInterval(nextInterval)
                    pollTimeoutRef.current = setTimeout(poll, nextInterval)
                  } else {
                    setIsPolling(false)
                    pollAttemptsRef.current = 0
                  }
                } else {
                  setIsPolling(false)
                  pollAttemptsRef.current = 0
                }
              } catch (error) {
                console.error("Error during polling:", error)
                if (pollAttemptsRef.current < maxPollAttempts) {
                  const nextInterval = Math.min(30000, 60000) // Use longer interval on error
                  pollTimeoutRef.current = setTimeout(poll, nextInterval)
                } else {
                  setIsPolling(false)
                  pollAttemptsRef.current = 0
                }
              }
            }
            
            pollTimeoutRef.current = setTimeout(poll, 15000)
          }
        } else {
          console.warn("Unexpected response format from getUserIdeas:", data)
          setError("Received invalid data format from server")
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load ideas. Please try again.")
        console.error("Error fetching ideas:", err)
      } finally {
        setLoading(false)
      }
    }
    
    loadIdeas()
  }, [sortBy, sortOrder, statusFilter, refreshCounter]) // Include refreshCounter to trigger manual refreshes

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "failed":
        return <X className="h-5 w-5 text-red-500" />
      case "answer_followup":
        return <AlertCircle className="h-5 w-5 text-purple-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleViewIdea = (idea: IdeaTask) => {
    // If the idea needs followup questions to be answered, show the followup questions UI
    if (idea.status.toLowerCase() === "answer_followup" && idea.follow_up_questions && idea.follow_up_questions.length > 0) {
      setSelectedIdeaForFollowup(idea)
    } else {
      router.push(`/ideas/${idea._id}`)
    }
  }

  const handleFollowupComplete = () => {
    setSelectedIdeaForFollowup(null)
    // Refresh ideas to get updated statuses - trigger useEffect by updating refresh counter
    setRefreshCounter(prev => prev + 1)
  }

  const handleManualRefresh = () => {
    // Force refresh - trigger useEffect by updating refresh counter
    setRefreshCounter(prev => prev + 1)
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 1 ? -1 : 1)
    } else {
      setSortBy(field)
      setSortOrder(-1)
    }
  }

  // If a selected idea for followup exists, show the followup questions UI
  if (selectedIdeaForFollowup && selectedIdeaForFollowup.follow_up_questions) {
    return (
      <div className="max-w-6xl mx-auto pt-6 pb-12 px-4">
        <button 
          onClick={() => setSelectedIdeaForFollowup(null)} 
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Ideas
        </button>
        
        <FollowupQuestionCards 
          taskId={selectedIdeaForFollowup.task_id}
          questions={selectedIdeaForFollowup.follow_up_questions}
          onComplete={handleFollowupComplete}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto pt-6 pb-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Generated Ideas</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => router.push('/ideas')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors"
            title="Generate New Idea"
          >
            <Plus className="h-4 w-4" />
            <span>New Idea</span>
          </button>
          <button 
            onClick={handleManualRefresh}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setStatusFilter(statusFilter ? null : "completed")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                statusFilter 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>{statusFilter || "All Status"}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading ideas...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-700 dark:text-red-400 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <button 
              onClick={handleManualRefresh} 
              className="mt-2 text-sm bg-red-100 dark:bg-red-800 px-3 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : ideas.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No ideas generated yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start generating ideas to see them listed here.</p>
          <button 
            onClick={() => router.push('/ideas')} 
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create New Idea
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("task_description")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Description</span>
                    {sortBy === "task_description" && (
                      sortOrder === 1 ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort("created_at")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortBy === "created_at" && (
                      sortOrder === 1 ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ideas
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {ideas
                .filter(idea => idea.status.toLowerCase() !== 'started')
                .map((idea) => (
                <tr key={idea._id || idea.task_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(idea.status)}
                      <span className={`ml-2 text-sm capitalize ${
                        idea.status.toLowerCase() === 'answer_followup' 
                          ? 'text-purple-600 dark:text-purple-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {idea.status.toLowerCase() === 'answer_followup' ? 'Needs Follow-up' : idea.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-200 line-clamp-2">{idea.task_description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {idea.created_at ? formatDate(idea.created_at) : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {idea.ideas ? idea.ideas.length : 0} ideas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewIdea(idea)}
                      className={`text-sm font-medium ${
                        idea.status.toLowerCase() === 'answer_followup' 
                          ? 'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300'
                          : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                      }`}
                    >
                      {idea.status.toLowerCase() === 'answer_followup' ? 'Answer Questions' : 'View Details'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 