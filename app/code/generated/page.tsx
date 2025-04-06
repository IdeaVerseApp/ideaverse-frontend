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
  const { experiment } = useIdea()
  const [isLoading, setIsLoading] = useState(true)
  const [generationType, setGenerationType] = useState<"fromFile" | "fromScratch" | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [generationTime, setGenerationTime] = useState("0 MINS 0 SECS")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isGenerating, setIsGenerating] = useState(true)
  const [userData, setUserData] = useState({
    name: "Researcher Smith",
    initial: "R",
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  // Sample generated code
  const generatedCode = `import random
import statistics

def generate_random_numbers(count, start, end):
    """Generate a list of random numbers between start and end."""
    return [random.randint(start, end) for _ in range(count)]

def calculate_statistics(numbers):
    """Calculate and display various statistical measures from the list."""
    mean = statistics.mean(numbers)
    median = statistics.median(numbers)
    stdev = statistics.stdev(numbers) if len(numbers) > 1 else 0
    minimum = min(numbers)
    maximum = max(numbers)
    range_val = maximum - minimum
    
    print(f"\\nStatistics Summary:\\nMean: {mean}\\nMedian: {median}\\nStandard Deviation: {stdev}\\n" +
          f"Minimum: {minimum}\\nMaximum: {maximum}\\nRange: {range_val}")

def count_occurrences(numbers):
    """Count the occurrences of each number in the list."""
    occurrences = {num: numbers.count(num) for num in set(numbers)}
    
    for num, count in sorted(occurrences.items(), key=lambda x: x[1]):
        print(f"Number {num} appears {count} time(s) in the list, accounting for {(count/len(numbers)*100):.2f}%" +
              f" of the total numbers, which is quite significant for analysis.")
`

  useEffect(() => {
    // Get generation type from localStorage
    const type = localStorage.getItem("codeGenerationType") as "fromFile" | "fromScratch" | null
    setGenerationType(type)

    // Get uploaded file name if available
    if (type === "fromFile") {
      const fileName = localStorage.getItem("uploadedFileName")
      setUploadedFileName(fileName)
    }

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
      setIsLoading(false)
      clearInterval(timer)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleGoBack = () => {
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600">Loading generated code...</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <span className="text-blue-500 font-medium">{isGenerating ? "GENERATING" : "GENERATED"}</span>
                  {isGenerating && (
                    <div className="flex ml-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                      <div
                        className="h-2 w-2 bg-blue-500 rounded-full animate-pulse mr-1"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-4">GENERATION TIME : {generationTime}</span>
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
                      {generatedCode.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="inline-block w-8 text-right mr-4 text-gray-500 flex-shrink-0">{i + 1}</span>
                          <span className="flex-1 whitespace-nowrap">
                            {line
                              .replace(
                                /import\s+(\w+)/g,
                                '<span class="text-pink-400">import</span> <span class="text-yellow-300">$1</span>',
                              )
                              .replace(
                                /def\s+(\w+)/g,
                                '<span class="text-cyan-300">def</span> <span class="text-yellow-300">$1</span>',
                              )
                              .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-yellow-300">$&</span>')
                              .replace(/(\w+)\(/g, '<span class="text-yellow-300">$1</span>(')
                              .replace(/return/g, '<span class="text-pink-400">return</span>')
                              .replace(/for/g, '<span class="text-pink-400">for</span>')
                              .replace(/in/g, '<span class="text-pink-400">in</span>')
                              .replace(/if/g, '<span class="text-pink-400">if</span>')
                              .replace(/else/g, '<span class="text-pink-400">else</span>')
                              .replace(/print/g, '<span class="text-green-400">print</span>')}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-gray-900 bg-opacity-80">
                  <div className="flex space-x-4">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleProceed}
                    className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="mr-2">CLICK PROCEED TO EXECUTE THE GENERATED CODE OVER THE PLATFORM</span>
                    <span className="text-xs">(EXECUTION WILL BE DONE AND RESULTS WILL BE GENERATED)</span>
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
                    <span className="text-gray-700">
                      RUN THE GENERATED CODE ON YOUR LOCAL MACHINE AND UPLOAD THE SUMMARY OF RESULTS IN JSON FORMAT
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

