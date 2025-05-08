"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useIdea } from "@/context/IdeaContext"


export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<string | null>(null) // Change type to string | null
  const { generatedData} = useIdea()
  useEffect(() => {
    // Fetch or retrieve the results data here
    const fetchResults = async () => {
      console.log(generatedData);
      
      // Check if generatedData is defined
      if (generatedData) {
        const data = generatedData.output || null;
        setResults(data);
      } else {
        setResults(null); // Set results to null if generatedData is not available
      }

      console.log(results);
    }

    fetchResults()
  }, [generatedData])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userName="Researcher Smith" userInitial="R" activeView="code" sidebarOpen={true} setSidebarOpen={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar userName="Researcher Smith" userInitial="R" sidebarOpen={true} setSidebarOpen={() => {}} />

        {/* Content */}
        <div className="overflow-auto h-[400px]">
          <h1 className="text-2xl font-bold mb-4">Results</h1>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md">
            {results ? JSON.stringify(results, null, 2) : "Loading..."}
          </pre>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
