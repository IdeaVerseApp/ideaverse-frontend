"use client"

import type React from "react"
import { useState, useRef, type ChangeEvent } from "react"
import { Code, X, HelpCircle } from "lucide-react"
import { useIdea } from "@/context/IdeaContext"
import { useRouter } from "next/navigation"

export default function CodeGeneration({ ideaId }: { ideaId?: string | number }) {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [error, setError] = useState<{ message: string; type: "upload" | "experiment" | "general" } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { experiment, setGeneratedData } = useIdea() // Use the global state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const supportedFormats = [".py", ".ipynb"]
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

      if (supportedFormats.includes(fileExtension)) {
        setUploadedFile(file)
        setError(null)
        setShowUploadModal(false)
      } else {
        setError({
          message: "Unsupported file format. Please upload a supported file type.",
          type: "upload",
        })
      }
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      const supportedFormats = [".py", ".ipynb"]
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

      if (supportedFormats.includes(fileExtension)) {
        setUploadedFile(file)
        setError(null)
        setShowUploadModal(false)
      } else {
        setError({
          message: "Unsupported file format. Please upload a supported file type.",
          type: "upload",
        })
      }
    }
  }

  // Handle browse files click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Update the handleGenerateCode function to check for login status

  const handleGenerateCode = () => {
    if (!uploadedFile) {
      setError({
        message: "Please upload a base file before generating code.",
        type: "upload",
      })
      return
    }

    console.log("Experiment")
    console.log(experiment)

    if (!experiment.trim()) {
      setError({
        message: "No research idea found. Please generate a research idea first.",
        type: "experiment",
      })
      return
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push("/login")
      return
    }

    setError(null)
    setIsGenerating(true)

    // Store generation type in localStorage
    localStorage.setItem("codeGenerationType", "fromFile")
    localStorage.setItem("uploadedFileName", uploadedFile.name)

    // Call generateCode, which will handle navigation
    generateCode(uploadedFile, experiment)
  }

  const generateCode = async (uploadedFile: File | null, experiment: string) => {
    try {
      console.log("** generateCode starts **")
      const currentResearchIdea = experiment

      const formData = new FormData();
      formData.append("prompt", currentResearchIdea);

      console.log(formData)

      if (uploadedFile) {
        const uploadedFileName = localStorage.getItem("uploadedFileName") || "{}"
        console.log(uploadedFileName)

        const blob = new Blob([uploadedFile], { type: "text/plain" });
        formData.append("file", blob, uploadedFile.name);
      }

      const response = await fetch(`${apiEndpoint}/aider-generate/`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      const finalCode = data.generated_code || "# No code returned by Aider.";
      const output = data.output || ""; // Assuming the output is also returned

      // Set the generated data in context
      setGeneratedData({ code: finalCode, output });

      console.log("DATA", data)

      // Navigate to the generated code page after the API call finishes
      router.push("/code/generated");

    } catch (error) {
      console.error("** generateCode - Error")
      console.error(error)
    }
  }

  // Update the handleGenerateFromScratch function to check for login status

  const handleGenerateFromScratch = () => {
    // Open the modal when this method is called
    console.log("** handleGenerateFromScratch starts **")

    try {
      console.log("Experiment")
      console.log(experiment)
      setIsGenerating(true)
      generateCode(null, experiment)

  
    } catch (error) {
      console.error("** generateCode - Error")
      console.error(error)
      
    }
    
  }



 

  return (
    <div className="max-w-3xl mx-auto pt-16 pb-24 px-4">
      <div className="flex flex-col items-center mb-12">
        <div className="h-20 w-20 mb-6 text-black">
          <Code className="h-full w-full" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Generate Code for Your Research</h1>
        <p className="text-lg text-gray-600 text-center max-w-xl">
          Upload your base code file or generate code from scratch based on your research idea.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            PROVIDE THE BASE CODE TEMPLATE
          </button>
        </div>

        {/* File Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold">Upload files</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div
                  className="border-2 border-dashed border-purple-200 rounded-lg p-12 text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="h-16 w-16 text-gray-400 mb-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V3M12 3L8 7M12 3L16 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 17.5C20 19.9853 17.9853 22 15.5 22C13.0147 22 11 19.9853 11 17.5C11 15.0147 13.0147 13 15.5 13C17.9853 13 20 15.0147 20 17.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    <p className="text-xl font-medium mb-2">Drop files here</p>
                    <p className="text-gray-500 mb-6">Supported format: py, ipynb</p>
                    <p className="text-gray-500 mb-3">OR</p>
                    <button className="text-blue-500 hover:text-blue-700 font-medium" onClick={handleBrowseClick}>
                      Browse files
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".py,.ipynb"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t">
                <button
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded mr-2"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={() => setShowUploadModal(false)}
                  disabled={!uploadedFile}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Display uploaded file */}
        {uploadedFile && (
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-gray-700 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 2V9H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-gray-700">{uploadedFile.name}</span>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {uploadedFile && (
          <div className="flex flex-col items-center">
            <button
              className={`px-12 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium transition-colors flex items-center justify-center ${
                !uploadedFile || !experiment.trim() || isGenerating ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleGenerateCode}
              disabled={!uploadedFile || !experiment.trim() || isGenerating}
              title={
                !uploadedFile
                  ? "Please upload a base file first"
                  : !experiment.trim()
                    ? "No research idea found"
                    : "Generate code based on your file"
              }
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  <span>GENERATING...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">GENERATE</span>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </>
              )}
            </button>

            {!uploadedFile && (
              <div className="mt-2 text-amber-600 text-sm flex items-center">
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Please upload a base file first</span>
              </div>
            )}

            {uploadedFile && !experiment.trim() && (
              <div className="mt-2 text-amber-600 text-sm flex items-center">
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>No research idea found. Please generate a research idea first</span>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && error.type === "general" && (
          <div className="flex items-center justify-center text-red-500 text-sm">
            <span>{error.message}</span>
          </div>
        )}

        {/* OR Divider */}
        <div className="flex items-center justify-center">
          <div className="border-t border-gray-300 w-1/3"></div>
          <span className="px-4 text-gray-500">OR</span>
          <div className="border-t border-gray-300 w-1/3"></div>
        </div>

        {/* Generate From Scratch Button */}
        <div className="flex flex-col items-center">
          <button
            className={`px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md font-medium transition-colors flex items-center justify-center ${
              isGenerating ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleGenerateFromScratch}
            disabled={isGenerating}
            title="Generate code from scratch"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                <span>GENERATING...</span>
              </>
            ) : (
              <>
                <span>⟪</span>
                <span className="mx-2">GENERATE WHOLE CODE FROM SCRATCH</span>
                <span>⟫</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

