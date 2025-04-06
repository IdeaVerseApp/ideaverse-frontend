"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, BookOpen, Edit, AlignLeft, Download, Share2 } from "lucide-react"

export default function ResearchPaperWriting() {
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState("Full Paper")
  const [researchTopic, setResearchTopic] = useState("")
  const [error, setError] = useState("")

  const handleGenerateDraft = () => {
    if (!researchTopic.trim()) {
      setError("Please enter a research topic before generating")
      return
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.push("/login")
      return
    }

    // Store the research topic and selected section in localStorage
    localStorage.setItem("researchTopic", researchTopic)
    localStorage.setItem("selectedSection", selectedSection)

    // Navigate to the paper editor
    router.push("/paper/newpaper")
  }

  return (
    <div className="max-w-3xl mx-auto pt-16 pb-24 px-4">
      <div className="flex flex-col items-center mb-12">
        <div className="h-20 w-20 mb-6 text-black">
          <FileText className="h-full w-full" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Research Paper Assistant</h1>
        <p className="text-lg text-gray-600 text-center max-w-xl">
          Get help drafting, structuring, and refining your research papers with AI assistance.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">Research Topic</div>
            <div className="flex space-x-2">
              <select
                className="text-sm border border-gray-200 rounded px-2 py-1"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option>Full Paper</option>
                <option>Abstract</option>
                <option>Introduction</option>
                <option>Methodology</option>
                <option>Results</option>
                <option>Discussion</option>
                <option>Conclusion</option>
                <option>Literature Review</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <textarea
              className={`w-full p-4 border ${error ? "border-red-500" : "border-gray-200"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[150px]`}
              placeholder="Describe your research topic and what you'd like to write about..."
              value={researchTopic}
              onChange={(e) => {
                setResearchTopic(e.target.value)
                if (e.target.value.trim()) setError("")
              }}
            />

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateDraft}
                className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <Edit className="h-5 w-5 mr-2" />
                <span>Generate Draft</span>
              </button>
              <button className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <AlignLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            <span className="font-medium">Research Paper Draft</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">The Impact of Artificial Intelligence on Scientific Research</h2>

          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Abstract</span>
          </div>
          <p className="text-gray-800 mb-6">
            This paper explores the transformative impact of artificial intelligence (AI) on scientific research
            methodologies and outcomes. We examine how AI-driven tools are accelerating discovery across disciplines,
            from drug development to astrophysics, while also considering the methodological and ethical challenges that
            arise. Through analysis of recent case studies and a survey of researchers, we identify key patterns in AI
            adoption and propose a framework for responsible integration of AI in scientific workflows.
          </p>

          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Introduction</span>
          </div>
          <p className="text-gray-800 mb-6">
            Scientific research stands at the cusp of a paradigm shift driven by artificial intelligence (AI) and
            machine learning technologies. The ability of AI systems to process vast datasets, identify patterns beyond
            human perception, and generate novel hypotheses is fundamentally altering how science is conducted (Smith et
            al., 2022). From protein folding predictions that once took years now solved in hours (AlphaFold Team,
            2021), to the discovery of new materials with precisely engineered properties (Johnson, 2023), AI is
            accelerating the pace of scientific discovery across disciplines.
          </p>

          <p className="text-gray-800">
            However, this integration of AI into scientific workflows raises important questions about research
            methodology, reproducibility, and the changing role of human scientists. As algorithms increasingly
            contribute to or even lead certain aspects of scientific inquiry, the scientific community must develop new
            frameworks for understanding what constitutes scientific knowledge and how it is validated (Zhang &
            Williams, 2023)...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <h3 className="font-medium mb-1">Citation Suggestions</h3>
          <p className="text-sm text-gray-500">
            We've identified 15 relevant papers from recent literature that would strengthen your research.
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
          <h3 className="font-medium mb-1">Journal Recommendations</h3>
          <p className="text-sm text-gray-500">
            Based on your topic, consider submitting to: Nature AI, Science Advances, or PLOS Computational Biology.
          </p>
        </div>
      </div>
    </div>
  )
}

