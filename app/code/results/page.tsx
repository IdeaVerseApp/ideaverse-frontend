"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useIdea } from "@/context/IdeaContext"
import { Copy, ArrowLeft, ArrowRight } from "lucide-react"


export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<string | null>(null) // Change type to string | null
  const { generatedData} = useIdea()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userData, setUserData] = useState({
    name: "Researcher Smith",
    initial: "R",
  })

  const handleGoBack = () => {
    router.push("/code/generated")
  }

  const handleProceedToPaperGeneration = () => {
    router.push("/paper")
  }

  const handleBackToGenerateCode = () => {
    router.push("/code")
  }

  useEffect(() => {
    // Fetch or retrieve the results data here
    const fetchResults = async () => {
      console.log("lol")
      console.log(generatedData);
      
      // Check if generatedData is defined
      if (generatedData) {
        const data = generatedData.output || null;
        console.log("data -- " + data)
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
        <Sidebar
            userName={userData.name}
            userInitial={userData.initial}
            activeView="code"
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
            {/* Navbar */}
            <Navbar
            userName={userData.name}
            userInitial={userData.initial}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            />

            {/* Content */}
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <button onClick={handleGoBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Generated Code
                    </button>
                </div>
                    
                    {!results ? 
                        (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-lg text-gray-600">Generating Results...</p>
                            </div>
                        ) 
                        : 
                        (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                                {/* Header */}
                                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <span className="text-blue-500 font-medium">RESULTS</span>
                                    </div>
                                </div>

                                {/* Code Display */}
                                <div className="overflow-auto h-[400px]">
                                    <div className="overflow-auto h-full w-full" style={{ overflowX: "auto", overflowY: "auto" }}>
                                    <pre className="bg-gray-900 text-gray-100 text-sm whitespace-pre min-w-full">
                                    
                                        {results &&
                                        JSON.stringify((results), null, 2)
                                            .split("\n")
                                            .map((line, i) => (
                                            <div key={i} className="flex">
                                                <span className="inline-block w-8 text-right mr-4 text-gray-500 flex-shrink-0">{i + 1}</span>
                                                <span className="flex-1 whitespace-pre-wrap">{line}</span>
                                            </div>
                                        ))}
                                    
                                    </pre>
                                    </div>
                                </div>
                            </div>
                        )
                    }
            </div>

            {/*Action Buttons */}
            <div className="p-6 space-y-8 mr-2 ml-2">
                <div className="flex items-center justify-between">
                   
                    <button
                        onClick={handleBackToGenerateCode}
                        className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span>REGENERATE CODE</span>
                        
                    </button>
                    <button
                        onClick={handleProceedToPaperGeneration}
                        className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
                    >
                        
                        <span>GENERATE RESEARCH PAPER</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                        
                    </button>
                </div>
            </div>

            {/* Footer */}
            <Footer />

        </div>

      

        

        


    </div>
 
    
  )
}
