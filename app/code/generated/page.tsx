"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Copy, ArrowLeft, ArrowRight } from "lucide-react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useIdea } from "@/context/IdeaContext"

export default function GeneratedCodePage() {
  const router = useRouter()
  const pathname = usePathname()
  const { generatedData, clearGeneratedData } = useIdea()
  const [generationTime, setGenerationTime] = useState("0 MINS 0 SECS")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isGenerating, setIsGenerating] = useState(true)
  const [userData, setUserData] = useState({
    name: "Researcher Smith",
    initial: "R",
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // Simulate generation time
    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1
        const mins = Math.floor(newTime / 60)
        const secs = newTime % 60
        setGenerationTime(`${mins} MINS ${secs} SECS`)
        return newTime
      })
    }, 1000)

    // Simulate generation completion after 4 seconds
    setTimeout(() => {
      setIsGenerating(false)
      clearInterval(timer)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const handleCopyCode = () => {
    if (generatedData) {
      navigator.clipboard.writeText(generatedData.code)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleGoBack = () => {
    clearGeneratedData()
    router.push("/code")
  }

  const handleProceed = () => {
    // In a real app, this would execute the code
    alert("Code execution would start here")
  }

  const handleUpload = () => {
    // In a real app, this would handle file upload
    alert("File upload would start here")
  }

  // Only render this page if we're actually on the code/generated route
  if (pathname !== "/code/generated") {
    return null
  }

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
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
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
              Back to Code Generation
            </button>
          </div>

          {isGenerating || !generatedData ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600">Generating Code...</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <span className="text-blue-500 font-medium">GENERATED</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleCopyCode}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                    title="Copy code"
                  >
                    {copySuccess ? "COPIED!" : "COPY"}
                    <Copy className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Code Display */}
              <div className="relative h-[calc(100vh-350px)]">
                <div className="overflow-auto h-full w-full" style={{ overflowX: "auto", overflowY: "auto" }}>
                  <pre className="bg-gray-900 text-gray-100 text-sm whitespace-pre min-w-full">
                    <code>
                      {generatedData.code.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="inline-block w-8 text-right mr-4 text-gray-500 flex-shrink-0">{i + 1}</span>
                          <span className="flex-1 whitespace-nowrap">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
                
              </div>

              {/* Action Buttons */}
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleProceed}
                    className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                  >
                    <span className="mr-2 text-sm">CLICK PROCEED TO EXECUTE THE GENERATED CODE OVER THE PLATFORM</span>
                    <br></br><span className="text-xs">(EXECUTION WILL BE DONE AND RESULTS WILL BE GENERATED)</span>
                  </button>
                </div>

                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 8l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                      Run the generated code on your local machine 
                      <br></br> Upload the summary of results in JSON format
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4 border border-gray-300 rounded-md px-3 py-2">
                      <svg
                        className="h-5 w-5 mr-2 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-gray-700">base_file.json</span>
                    </div>
                    <button
                      onClick={handleUpload}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center"
                    >
                      <span>UPLOAD</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

