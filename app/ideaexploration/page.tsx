"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, Code, FileText, Search, Star } from "lucide-react"
import { generateIdeaExploration } from "@/services/idea-service"
import type { IdeaExplorationResult } from "@/types/idea-exploration"
import MainLayout from "@/components/layouts/MainLayout"
import Footer from "@/components/footer"
import { useIdea } from "@/context/IdeaContext"

export default function IdeaExplorationPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<IdeaExplorationResult | null>(null)
  const [error, setError] = useState("")
  const { experiment } = useIdea() // Use the global state

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!experiment.trim()) {
          setError("No research idea found. Please go back and try again.")
          setIsLoading(false)
          return
        }

        // Call the service to generate the idea exploration
        const data = await generateIdeaExploration(experiment)
        setResult(data)
      } catch (err) {
        console.error("Error fetching idea exploration:", err)
        setError("Failed to generate idea exploration. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [experiment])

  const handleGoBack = () => {
    // Navigate specifically to the idea explorer page
    router.push("/ideas")
  }

  // Only render this page if we're actually on the ideaexploration route
  if (pathname !== "/ideaexploration") {
    return null
  }

  return (
    <MainLayout activeView="ideas">
      {/* Content */}
      <div className="w-full">
        <div className="mb-8">
          <button onClick={handleGoBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Idea Explorer
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Generating research idea exploration...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <button onClick={handleGoBack} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Go Back
            </button>
          </div>
        ) : (
          result && (
            <>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  #{result.id}. {result.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {result.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        tag === "AI"
                          ? "bg-blue-100 text-blue-800"
                          : tag === "Finance"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 mb-8">{result.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Novelty Score</div>
                    <div className="text-4xl font-bold text-blue-500">{result.scores.novelty}</div>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Feasibility Score</div>
                    <div className="text-4xl font-bold text-blue-500">{result.scores.feasibility}</div>
                  </div>
                  <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Paper Acceptance Score</div>
                    <div className="text-4xl font-bold text-blue-500">{result.scores.paperAcceptance}</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Experiments Workflow</h2>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Step 1: Data Collection</h3>
                    <ul className="space-y-2">
                      {result.workflow.dataCollection.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-500 mr-2">-</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Step 2: Model Training</h3>
                    <ul className="space-y-2">
                      {result.workflow.modelTraining.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-500 mr-2">-</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Related Research</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.relatedResearch.map((paper, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <h3 className="font-medium mb-2">{paper.title}</h3>
                        <div className="text-sm text-blue-500 mb-2">Link: {paper.link}</div>
                        <p className="text-sm text-gray-600">{paper.brief}</p>
                        <div className="mt-3">
                          <img src="/placeholder.svg?height=20&width=20" alt="University logo" className="h-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => router.push("/code")}
                >
                  <Code className="h-4 w-4 mr-2" />
                  <span>Generate Code</span>
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Star className="h-4 w-4 mr-2" />
                  <span>Save Idea</span>
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Search className="h-4 w-4 mr-2" />
                  <span>Deep Research</span>
                </button>
                <button
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => router.push("/paper")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Generate Litmap</span>
                </button>
              </div>
            </>
          )
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </MainLayout>
  )
}

