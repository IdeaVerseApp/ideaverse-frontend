"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserIdeas } from "@/services/idea-service"
import { Loader2, RefreshCw, Filter, SortAsc, SortDesc, Clock, Check, X, AlertCircle } from "lucide-react"

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
}

export default function   GeneratedIdeas() {
  const [ideas, setIdeas] = useState<IdeaTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState(-1)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const router = useRouter()

  const fetchIdeas = async () => {
    setLoading(true)
    setError(null) // Clear previous errors
    
    try {
      const data = await getUserIdeas({
        sort_by: sortBy,
        sort_order: sortOrder,
        status: statusFilter || undefined,
        limit: 50
      })
      
      // Check if we got a valid response (even if empty)
      if (Array.isArray(data)) {
        setIdeas(data)
      } else {
        // Handle unexpected response format
        console.warn("Unexpected response format from getUserIdeas:", data)
        setError("Received invalid data format from server")
      }
    } catch (err: any) {
      // Show specific error message if available
      setError(err?.message || "Failed to load ideas. Please try again.")
      console.error("Error fetching ideas:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas()
  }, [sortBy, sortOrder, statusFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />
      case "PENDING":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "PROCESSING":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "failed":
        return <X className="h-5 w-5 text-red-500" />
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
    router.push(`/ideas/${idea._id}`)
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 1 ? -1 : 1)
    } else {
      setSortBy(field)
      setSortOrder(-1)
    }
  }

  return (
    <div className="max-w-6xl mx-auto pt-6 pb-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Generated Ideas</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchIdeas}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
              onClick={fetchIdeas} 
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
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">{idea.status}</span>
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
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Details
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