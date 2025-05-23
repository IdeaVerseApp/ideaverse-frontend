"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Copy, ArrowLeft, ArrowRight } from "lucide-react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useIdea } from "@/context/IdeaContext"
import { json } from "stream/consumers"

export default function GeneratedCodePage() {
  const router = useRouter()
  const pathname = usePathname()
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { generatedData, clearGeneratedData, setOutputData } = useIdea()
  const [generationTime, setGenerationTime] = useState("0 MINS 0 SECS")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userData, setUserData] = useState({
    name: "Researcher Smith",
    initial: "R",
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // Check if generatedData is available immediately
    console.log("Generated Data: ")
    console.log(generatedData)
    if (generatedData) {
      setIsGenerating(false); // Set to false if data is available
    } else {
      // Simulate generation time
      //generatedData = localStorage.getItem("")
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
      const timeout = setTimeout(() => {
        setIsGenerating(false)
        clearInterval(timer)
      }, 4000)

      return () => {
        clearInterval(timer)
        clearTimeout(timeout)
      }
    }
  }, [generatedData]) // Add generatedData as a dependency


  const handleCopyCode = () => {
    if (generatedData) {
      const textToCopy = generatedData.code;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 5000);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
      } else {
        // Fallback for browsers that do not support the Clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Fallback: Failed to copy: ", err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    }
  }

  const handleGoBack = () => {
    console.log("from here 2")
    clearGeneratedData()
    router.push("/code")
  }

  const handleGoToResults = () => {
    router.push("/code/results")
  }

  

  const handleProceed = async () => {
    // alert("Code execution would start here")
    try {
      const generatedCode = {"code": generatedData?.code}
      console.log(generatedCode)
      const response = await fetch(`${apiEndpoint}/run-code/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedCode)
      });
      const data = await response.json();
      // console.log(response)
      console.log(data)

      setOutputData(data.result);
      if(data.result)
        setOutputData(data.result)
      else if (data.error){
        setOutputData("Error - " + data.error)
      }
      console.log(generatedData)
      router.push('/code/results')
      
    } catch (error) {
      
    }
    
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string); // Parse the JSON data
          console.log("json data")
          console.log(jsonData)
          setOutputData(jsonData); // Update the output in context
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // Handle error (e.g., show an alert)
        }
      };

      reader.readAsText(file); // Read the file as text
    }
  };

  const handleUploadButtonClick = () => {
    // This function can be used to trigger any additional logic if needed
    console.log("Upload button clicked");
    router.push('/code/results'); // Navigate to results page

  };

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
          <div className="mb-8 flex justify-between items-center">
            <button onClick={handleGoBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Code Generation
            </button>
           
            {generatedData?.output && ( // Check if generatedData.output is not null
              <button onClick={handleGoToResults} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                <ArrowRight className="h-4 w-4 mr-1" />
                View Results
              </button>
            )}
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
              <div className="overflow-auto h-[400px]">
                <div className="overflow-auto h-full w-full" style={{ overflowX: "auto", overflowY: "auto" }}>
                  <pre className="bg-gray-900 text-gray-100 text-sm whitespace-pre min-w-full">
                    <code>
                      {generatedData.code.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="inline-block w-8 text-right mr-4 text-gray-500 flex-shrink-0">{i + 1}</span>
                          <span className="flex-1 whitespace-pre-wrap">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
                
              </div>

              {/* Action Buttons */}
              <div className="p-6 space-y-8">
                <div className="flex flex-col items-center justify-center">
                <button
                    onClick={handleProceed}
                    className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
                  >
                    <span>PROCEED</span>
                  </button>
                  <span className="text-xs mt-2 text-center">
                    Click Proceed to execute the generated code over the platform
                  </span>
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
                    <input
                      type="file"
                      accept=".json"
                      className="mr-4 rounded-md px-3 py-2"
                      onChange={handleUpload}
                    />
                    <button
                      onClick={handleUploadButtonClick}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors flex items-center"
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

