"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Download,
  Share2,
  Copy,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  FileText,
  Type,
  AlignCenter,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/AuthContext"

// Define paper section types
type PaperSection = {
  id: string
  title: string
  content: string
}

export default function NewPaperPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [generatingPaper, setGeneratingPaper] = useState(true)
  const [paperContent, setPaperContent] = useState("")
  const [activeSection, setActiveSection] = useState("editor")
  const [activePaperSection, setActivePaperSection] = useState<string>("abstract")
  const { isAuthenticated } = useAuth()
  const [userData, setUserData] = useState({
    name: isAuthenticated ? "Researcher Smith" : "Guest User",
    initial: isAuthenticated ? "R" : "G",
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [paperTitle, setPaperTitle] = useState("")
  const [researchTopic, setResearchTopic] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [showEquationMenu, setShowEquationMenu] = useState(false)
  const [showCitationMenu, setShowCitationMenu] = useState(false)
  const [paperSections, setPaperSections] = useState<PaperSection[]>([])
  const [selectedSectionType, setSelectedSectionType] = useState<string>("")
  const [exportFormat, setExportFormat] = useState("PDF")
  const [showSectionMenu, setShowSectionMenu] = useState(false)
  const [saveStatus, setSaveStatus] = useState("")
  const editorRef = useRef<HTMLTextAreaElement>(null)

  // Load research topic and selected section from localStorage
  useEffect(() => {
    const topic = localStorage.getItem("researchTopic") || ""
    const section = localStorage.getItem("selectedSection") || "Full Paper"

    setResearchTopic(topic)
    setSelectedSectionType(section)

    // Generate a title based on the research topic
    if (topic) {
      setPaperTitle(generatePaperTitle(topic))
    } else {
      setPaperTitle("Research Paper")
    }

    // Generate content based on the selected section
    generateContent(topic, section)
  }, [])

  // Generate a paper title based on the research topic
  const generatePaperTitle = (topic: string): string => {
    if (!topic) return "Research Paper"

    // Simple title generation logic - in a real app, this would be more sophisticated
    const words = topic.split(" ")
    if (words.length <= 3) {
      return `Analysis of ${topic}`
    } else if (topic.toLowerCase().includes("impact") || topic.toLowerCase().includes("effect")) {
      return topic.charAt(0).toUpperCase() + topic.slice(1)
    } else {
      return `The Impact of ${words.slice(0, 3).join(" ")} on ${words.slice(-2).join(" ")}`
    }
  }

  // Generate content based on the selected section
  const generateContent = (topic: string, sectionType: string) => {
    setGeneratingPaper(true)
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      let sections: PaperSection[] = []

      if (sectionType === "Full Paper") {
        // Generate all sections for a full paper
        sections = [
          { id: "abstract", title: "Abstract", content: generateSectionContent(topic, "Abstract") },
          { id: "introduction", title: "Introduction", content: generateSectionContent(topic, "Introduction") },
          { id: "methodology", title: "Methodology", content: generateSectionContent(topic, "Methodology") },
          { id: "results", title: "Results", content: generateSectionContent(topic, "Results") },
          { id: "discussion", title: "Discussion", content: generateSectionContent(topic, "Discussion") },
          { id: "conclusion", title: "Conclusion", content: generateSectionContent(topic, "Conclusion") },
          { id: "references", title: "References", content: generateSectionContent(topic, "References") },
        ]
      } else {
        // Generate only the selected section
        const sectionId = sectionType.toLowerCase().replace(" ", "_")
        sections = [{ id: sectionId, title: sectionType, content: generateSectionContent(topic, sectionType) }]
      }

      setPaperSections(sections)
      setActivePaperSection(sections[0].id)

      // Set the content of the active section to the editor
      const activeSection = sections[0]
      setPaperContent(activeSection.content)

      setGeneratingPaper(false)
      setIsLoading(false)
    }, 3000)
  }

  // Generate content for a specific section
  const generateSectionContent = (topic: string, sectionType: string): string => {
    // In a real app, this would call an AI service to generate content
    // For now, we'll use predefined templates

    switch (sectionType) {
      case "Abstract":
        return `\\begin{abstract}
This paper explores ${topic}. We examine the key factors and methodologies involved, while also considering the challenges and implications. Through analysis of recent studies and data, we identify patterns and propose a framework for understanding this phenomenon.
\\end{abstract}`

      case "Introduction":
        return `\\section{Introduction}
${topic} represents an important area of research with significant implications for both theory and practice. The ability to understand and predict outcomes in this domain has far-reaching consequences for multiple stakeholders (Smith et al., 2022).

Recent developments have highlighted the need for a comprehensive analysis of ${topic.toLowerCase()}. From early studies by Johnson (2018) to more recent investigations by Zhang and Williams (2023), there has been a growing body of literature addressing various aspects of this phenomenon.

However, several gaps remain in our understanding, particularly regarding:

\\begin{itemize}
  \\item The causal mechanisms underlying observed correlations
  \\item The contextual factors that moderate key relationships
  \\item The long-term implications for policy and practice
\\end{itemize}

This paper aims to address these gaps by providing a systematic analysis of ${topic.toLowerCase()}, drawing on both theoretical frameworks and empirical evidence.`

      case "Methodology":
        return `\\section{Methodology}
Our analysis combines quantitative and qualitative approaches to understand ${topic.toLowerCase()}:

\\subsection{Research Design}
We employed a mixed-methods research design to capture both the breadth and depth of the phenomenon under investigation. This approach allows for triangulation of findings and provides a more comprehensive understanding than would be possible with a single method.

\\subsection{Data Collection}
Data was collected through multiple channels:

\\begin{enumerate}
  \\item A systematic review of 150 papers published between 2018-2023
  \\item Interviews with 45 experts in the field
  \\item Analysis of case studies demonstrating key aspects of ${topic.toLowerCase()}
  \\item A survey of 500 participants regarding their experiences and perceptions
\\end{enumerate}

\\subsection{Analytical Approach}
The data was analyzed using both statistical methods and thematic analysis. For quantitative data, we employed:

\\begin{equation}
Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + \\epsilon
\\end{equation}

Where $Y$ represents the outcome variable, $X_1$ and $X_2$ are predictor variables, and $\\epsilon$ is the error term.`

      case "Results":
        return `\\section{Results}
Our analysis revealed several key findings regarding ${topic.toLowerCase()}:

\\subsection{Primary Outcomes}
The data indicates a significant relationship between the primary variables of interest. As shown in Table 1, the correlation coefficient was $r = 0.72$ ($p < 0.001$), indicating a strong positive relationship.

Further analysis revealed that this relationship was moderated by contextual factors, with stronger effects observed in certain settings. The interaction effect can be modeled as:

\\begin{equation}
Y = \\alpha + \\beta X + \\gamma Z + \\delta (X \\times Z) + \\epsilon
\\end{equation}

Where $Z$ represents the moderating variable and $\\delta$ captures the interaction effect.

\\subsection{Secondary Outcomes}
Additional analyses revealed patterns in the temporal dynamics of the observed relationships. The time-series data showed cyclical patterns with a periodicity of approximately 18 months, suggesting underlying mechanisms related to:

\\begin{itemize}
  \\item Seasonal variations in key environmental factors
  \\item Organizational learning and adaptation cycles
  \\item Policy implementation and adjustment timeframes
\\end{itemize}`

      case "Discussion":
        return `\\section{Discussion}
The findings from our study of ${topic.toLowerCase()} have several important implications for theory and practice.

\\subsection{Theoretical Implications}
Our results extend existing theoretical frameworks in several ways. First, they provide empirical support for the model proposed by Johnson (2018), while also suggesting refinements to account for contextual variations. Second, they challenge the assumption of linear relationships that has dominated much of the literature, instead pointing to more complex, non-linear dynamics.

The observed interaction effects also suggest that:

\\begin{equation}
\\frac{\\partial Y}{\\partial X} = \\beta + \\delta Z
\\end{equation}

This indicates that the marginal effect of $X$ on $Y$ is contingent on the level of $Z$, a finding that has not been adequately addressed in previous research.

\\subsection{Practical Implications}
For practitioners, our findings suggest several strategies for addressing challenges related to ${topic.toLowerCase()}:

\\begin{enumerate}
  \\item Implementing monitoring systems that capture both direct and indirect effects
  \\item Developing adaptive approaches that can respond to changing contextual conditions
  \\item Investing in capacity building to enhance organizational resilience
\\end{enumerate}

\\subsection{Limitations}
Despite the strengths of our approach, several limitations should be acknowledged. The cross-sectional nature of some of our data limits causal inferences, and the sample, while diverse, may not be fully representative of all contexts where ${topic.toLowerCase()} is relevant.`

      case "Conclusion":
        return `\\section{Conclusion}
Our analysis of ${topic.toLowerCase()} has revealed important patterns and relationships that advance our understanding of this phenomenon. The findings highlight the complex, context-dependent nature of the observed effects and suggest several directions for future research and practice.

Key contributions of this work include:

\\begin{itemize}
  \\item A more nuanced understanding of the mechanisms underlying ${topic.toLowerCase()}
  \\item Identification of important moderating factors that shape outcomes
  \\item A framework for integrating diverse perspectives on this phenomenon
  \\item Practical guidelines for addressing challenges in this domain
\\end{itemize}

Future research should explore longitudinal dynamics, examine additional contextual factors, and investigate potential interventions to address challenges related to ${topic.toLowerCase()}.`

      case "Literature Review":
        return `\\section{Literature Review}
The study of ${topic.toLowerCase()} has evolved significantly over the past decade, with several distinct streams of research emerging.

\\subsection{Historical Development}
Early work in this field focused primarily on descriptive analyses, with researchers such as Thompson (2010) and Garcia (2012) documenting patterns and establishing baseline understanding. This was followed by a more theoretical phase, during which conceptual frameworks were developed to explain observed phenomena (Wilson et al., 2015).

More recently, the field has moved toward more sophisticated empirical analyses, employing advanced methodologies to test and refine theoretical propositions (Zhang & Williams, 2023).

\\subsection{Current Perspectives}
Contemporary research on ${topic.toLowerCase()} can be categorized into several perspectives:

\\begin{itemize}
  \\item \\textbf{Functionalist approaches:} Focusing on the role of ${topic.toLowerCase()} in maintaining system stability and adaptation (Johnson, 2018)
  \\item \\textbf{Critical perspectives:} Examining power dynamics and unintended consequences (Martinez, 2020)
  \\item \\textbf{Integrative frameworks:} Attempting to synthesize diverse viewpoints into coherent explanatory models (Smith et al., 2022)
\\end{itemize}

\\subsection{Gaps in the Literature}
Despite significant advances, several important gaps remain in our understanding of ${topic.toLowerCase()}. These include limited attention to contextual factors, insufficient longitudinal analyses, and a need for more robust theoretical integration across disciplinary boundaries.`

      case "References":
        return `\\begin{thebibliography}{99}
\\bibitem{smith2022} Smith, J., Johnson, A., & Williams, T. (2022). Advances in understanding ${topic.toLowerCase()}. \\textit{Journal of Research Studies}, 45(3), 112-128.

\\bibitem{johnson2018} Johnson, A. (2018). Theoretical perspectives on ${topic.toLowerCase()}. \\textit{Annual Review of Research}, 12, 45-67.

\\bibitem{zhang2023} Zhang, L. & Williams, T. (2023). Contextual factors in ${topic.toLowerCase()}: A meta-analysis. \\textit{Research Quarterly}, 56(2), 89-104.

\\bibitem{martinez2020} Martinez, C. (2020). Critical perspectives on ${topic.toLowerCase()}. \\textit{Journal of Critical Studies}, 34(1), 23-41.

\\bibitem{wilson2015} Wilson, R., Thompson, S., & Garcia, M. (2015). Conceptual frameworks for understanding ${topic.toLowerCase()}. \\textit{Theoretical Research Journal}, 28(4), 156-172.
\\end{thebibliography}`

      default:
        return `\\section{${sectionType}}
This section on ${topic.toLowerCase()} is under development. Please edit this content to add your specific information related to ${sectionType.toLowerCase()}.`
    }
  }

  const handleGoBack = () => {
    router.push("/paper")
  }

  const handleTextSelection = () => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart
      const end = editorRef.current.selectionEnd
      setSelectedText(editorRef.current.value.substring(start, end))
    }
  }

  const insertFormatting = (format: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart
      const end = editorRef.current.selectionEnd
      const text = editorRef.current.value
      let formattedText = ""

      switch (format) {
        case "bold":
          formattedText =
            text.substring(0, start) + "\\textbf{" + text.substring(start, end) + "}" + text.substring(end)
          break
        case "italic":
          formattedText =
            text.substring(0, start) + "\\textit{" + text.substring(start, end) + "}" + text.substring(end)
          break
        case "underline":
          formattedText =
            text.substring(0, start) + "\\underline{" + text.substring(start, end) + "}" + text.substring(end)
          break
        case "itemize":
          formattedText =
            text.substring(0, start) +
            "\\begin{itemize}\n  \\item " +
            text.substring(start, end) +
            "\n  \\item \n\\end{itemize}" +
            text.substring(end)
          break
        case "enumerate":
          formattedText =
            text.substring(0, start) +
            "\\begin{enumerate}\n  \\item " +
            text.substring(start, end) +
            "\n  \\item \n\\end{enumerate}" +
            text.substring(end)
          break
        case "section":
          formattedText =
            text.substring(0, start) + "\\section{" + text.substring(start, end) + "}" + text.substring(end)
          break
        case "subsection":
          formattedText =
            text.substring(0, start) + "\\subsection{" + text.substring(start, end) + "}" + text.substring(end)
          break
        case "center":
          formattedText =
            text.substring(0, start) +
            "\\begin{center}\n" +
            text.substring(start, end) +
            "\n\\end{center}" +
            text.substring(end)
          break
        default:
          return
      }

      setPaperContent(formattedText)

      // Update the content in the paper sections
      updateSectionContent(activePaperSection, formattedText)

      // Reset selection
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus()
          editorRef.current.setSelectionRange(start, end + format.length + 2)
        }
      }, 0)
    }
  }

  const insertEquation = (type: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart
      const end = editorRef.current.selectionEnd
      const text = editorRef.current.value
      let equationText = ""

      switch (type) {
        case "inline":
          equationText = text.substring(0, start) + "$E = mc^2$" + text.substring(end)
          break
        case "block":
          equationText =
            text.substring(0, start) + "\\begin{equation}\n  E = mc^2\n\\end{equation}" + text.substring(end)
          break
        case "align":
          equationText =
            text.substring(0, start) + "\\begin{align}\n  E &= mc^2 \\\\\n  F &= ma\n\\end{align}" + text.substring(end)
          break
        default:
          return
      }

      setPaperContent(equationText)
      updateSectionContent(activePaperSection, equationText)
      setShowEquationMenu(false)
    }
  }

  const insertCitation = (type: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart
      const text = editorRef.current.value
      let citationText = ""

      switch (type) {
        case "cite":
          citationText = text.substring(0, start) + "\\cite{author2023}" + text.substring(start)
          break
        case "citep":
          citationText = text.substring(0, start) + "\\citep{author2023}" + text.substring(start)
          break
        case "citet":
          citationText = text.substring(0, start) + "\\citet{author2023}" + text.substring(start)
          break
        default:
          return
      }

      setPaperContent(citationText)
      updateSectionContent(activePaperSection, citationText)
      setShowCitationMenu(false)
    }
  }

  // Update the content of a specific section
  const updateSectionContent = (sectionId: string, content: string) => {
    setPaperSections((prevSections) =>
      prevSections.map((section) => (section.id === sectionId ? { ...section, content } : section)),
    )
  }

  // Handle changing the active paper section
  const handleSectionChange = (sectionId: string) => {
    // Save current content to the current section
    updateSectionContent(activePaperSection, paperContent)

    // Set the new active section
    setActivePaperSection(sectionId)

    // Load the content of the new section
    const section = paperSections.find((s) => s.id === sectionId)
    if (section) {
      setPaperContent(section.content)
    }
  }

  // Add a new section to the paper
  const addSection = (sectionType: string) => {
    // Generate a unique ID
    const id = `section_${Date.now()}`
    const title = sectionType
    const content = generateSectionContent(researchTopic, sectionType)

    setPaperSections((prevSections) => [...prevSections, { id, title, content }])

    setShowSectionMenu(false)
  }

  // Remove a section from the paper
  const removeSection = (sectionId: string) => {
    // Don't remove if it's the only section
    if (paperSections.length <= 1) return

    setPaperSections((prevSections) => prevSections.filter((section) => section.id !== sectionId))

    // If the active section is being removed, switch to the first available section
    if (activePaperSection === sectionId) {
      const remainingSections = paperSections.filter((section) => section.id !== sectionId)
      if (remainingSections.length > 0) {
        setActivePaperSection(remainingSections[0].id)
        setPaperContent(remainingSections[0].content)
      }
    }
  }

  // Handle saving the paper
  const handleSave = () => {
    // Save current content to the current section
    updateSectionContent(activePaperSection, paperContent)

    // In a real app, this would save to a database
    setSaveStatus("Saved")
    setTimeout(() => setSaveStatus(""), 2000)
  }

  // Only render this page if we're actually on the paper/newpaper route
  if (pathname !== "/paper/newpaper") {
    return null
  }

  // Render the LaTeX content as HTML for preview
  const renderLatexPreview = () => {
    // This is a simplified renderer for demonstration
    // In a real app, you would use a proper LaTeX to HTML converter
    const html = paperContent
      .replace(/\\section{(.*?)}/g, '<h2 class="text-2xl font-bold mt-6 mb-4">$1</h2>')
      .replace(/\\subsection{(.*?)}/g, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/\\textbf{(.*?)}/g, "<strong>$1</strong>")
      .replace(/\\textit{(.*?)}/g, "<em>$1</em>")
      .replace(/\\underline{(.*?)}/g, "<u>$1</u>")
      .replace(/\\begin{itemize}([\s\S]*?)\\end{itemize}/g, (match, p1) => {
        return (
          '<ul class="list-disc pl-5 my-3">' +
          p1.replace(/\\item\s(.*?)(?=\\item|$)/g, '<li class="mb-1">$1</li>') +
          "</ul>"
        )
      })
      .replace(/\\begin{enumerate}([\s\S]*?)\\end{enumerate}/g, (match, p1) => {
        return (
          '<ol class="list-decimal pl-5 my-3">' +
          p1.replace(/\\item\s(.*?)(?=\\item|$)/g, '<li class="mb-1">$1</li>') +
          "</ol>"
        )
      })
      .replace(
        /\\begin{abstract}([\s\S]*?)\\end{abstract}/g,
        '<div class="bg-gray-50 p-4 my-4 rounded"><strong>Abstract:</strong>$1</div>',
      )
      .replace(/\\begin{equation}([\s\S]*?)\\end{equation}/g, '<div class="my-4 py-2 text-center">$1</div>')
      .replace(/\\begin{align}([\s\S]*?)\\end{align}/g, '<div class="my-4 py-2 text-center">$1</div>')
      .replace(/\\begin{center}([\s\S]*?)\\end{center}/g, '<div class="text-center my-4">$1</div>')
      .replace(/\$(.*?)\$/g, '<span class="text-blue-800">$1</span>')
      .replace(/\\cite{(.*?)}/g, '<span class="text-blue-600">[1]</span>')
      .replace(/\\citep{(.*?)}/g, '<span class="text-blue-600">(Author, 2023)</span>')
      .replace(/\\citet{(.*?)}/g, '<span class="text-blue-600">Author (2023)</span>')
      .replace(
        /\\maketitle/g,
        `<h1 class="text-3xl font-bold text-center mb-6">${paperTitle}</h1><p class="text-center mb-8">By ${userData.name}</p>`,
      )
      .replace(/\\title{(.*?)}/g, "")
      .replace(/\\author{(.*?)}/g, "")
      .replace(/\\date{(.*?)}/g, "")
      .replace(/\\documentclass{.*?}/g, "")
      .replace(/\\usepackage{.*?}/g, "")
      .replace(/\\begin{document}/g, "")
      .replace(/\\end{document}/g, "")
      .replace(/\\bibliographystyle{.*?}/g, "")
      .replace(
        /\\begin{thebibliography}{99}([\s\S]*?)\\end{thebibliography}/g,
        '<h2 class="text-2xl font-bold mt-6 mb-4">References</h2><div class="pl-5">$1</div>',
      )
      .replace(/\\bibitem{(.*?)}(.*)/g, '<p class="mb-2">$2</p>')

    return { __html: html }
  }

  // Get the full paper content by combining all sections
  const getFullPaperContent = () => {
    let fullContent = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{natbib}

\\title{${paperTitle}}
\\author{${userData.name}}
\\date{\\today}

\\begin{document}

\\maketitle

`

    // Add each section's content
    paperSections.forEach((section) => {
      fullContent += section.content + "\n\n"
    })

    fullContent += "\\end{document}"

    return fullContent
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        userName={userData.name}
        userInitial={userData.initial}
        activeView="paper"
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
        <div className="flex-1 flex flex-col">
          {/* Paper Editor Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center">
                <button onClick={handleGoBack} className="mr-4 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  className="text-xl font-medium border-none focus:ring-0 focus:outline-none w-96"
                  placeholder="Paper Title"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <Save className="h-4 w-4 mr-1" />
                  <span>{saveStatus || "Save"}</span>
                </button>
                <div className="flex items-center space-x-2">
                  <select
                    className="text-sm border border-gray-300 rounded-md px-2 py-1.5"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option>PDF</option>
                    <option>LaTeX</option>
                    <option>Word</option>
                    <option>HTML</option>
                  </select>
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    <span>Export</span>
                  </button>
                </div>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600">
                {generatingPaper ? "Generating your research paper..." : "Loading editor..."}
              </p>
            </div>
          ) : (
            <>
              {/* Section Navigation */}
              <div className="bg-gray-100 border-b border-gray-200 p-2 overflow-x-auto">
                <div className="flex items-center space-x-1 max-w-7xl mx-auto">
                  {paperSections.map((section) => (
                    <div key={section.id} className="flex items-center">
                      <button
                        onClick={() => handleSectionChange(section.id)}
                        className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${
                          activePaperSection === section.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"
                        }`}
                      >
                        {section.title}
                      </button>
                      {paperSections.length > 1 && (
                        <button
                          onClick={() => removeSection(section.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Remove section"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="relative">
                    <button
                      onClick={() => setShowSectionMenu(!showSectionMenu)}
                      className="p-1.5 rounded-md hover:bg-gray-200 flex items-center"
                      title="Add section"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {showSectionMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40">
                        <button
                          onClick={() => addSection("Abstract")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Abstract
                        </button>
                        <button
                          onClick={() => addSection("Introduction")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Introduction
                        </button>
                        <button
                          onClick={() => addSection("Methodology")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Methodology
                        </button>
                        <button
                          onClick={() => addSection("Results")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Results
                        </button>
                        <button
                          onClick={() => addSection("Discussion")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Discussion
                        </button>
                        <button
                          onClick={() => addSection("Conclusion")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Conclusion
                        </button>
                        <button
                          onClick={() => addSection("References")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          References
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="bg-gray-100 border-b border-gray-200 p-2">
                <div className="max-w-7xl mx-auto flex items-center space-x-1">
                  <button
                    onClick={() => insertFormatting("bold")}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting("italic")}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting("underline")}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <div className="h-4 border-r border-gray-300 mx-1"></div>
                  <button
                    onClick={() => insertFormatting("itemize")}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="Bullet List"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting("enumerate")}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="Numbered List"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <div className="h-4 border-r border-gray-300 mx-1"></div>
                  <div className="relative">
                    <button
                      onClick={() => setShowEquationMenu(!showEquationMenu)}
                      className="p-1.5 rounded hover:bg-gray-200 flex items-center"
                      title="Insert Equation"
                    >
                      <span className="font-serif italic mr-1">∑</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {showEquationMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40">
                        <button
                          onClick={() => insertEquation("inline")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Inline Math
                        </button>
                        <button
                          onClick={() => insertEquation("block")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Equation Block
                        </button>
                        <button
                          onClick={() => insertEquation("align")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Aligned Equations
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowCitationMenu(!showCitationMenu)}
                      className="p-1.5 rounded hover:bg-gray-200 flex items-center"
                      title="Insert Citation"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {showCitationMenu && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-40">
                        <button
                          onClick={() => insertCitation("cite")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Citation [1]
                        </button>
                        <button
                          onClick={() => insertCitation("citep")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Citation (Author, Year)
                        </button>
                        <button
                          onClick={() => insertCitation("citet")}
                          className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                        >
                          Citation Author (Year)
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="h-4 border-r border-gray-300 mx-1"></div>
                  <button
                    onClick={() => insertFormatting("section")}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="Section"
                  >
                    <Type className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => insertFormatting("subsection")}
                    className="p-1.5 rounded hover:bg-gray-200 text-xs font-bold"
                    title="Subsection"
                  >
                    H2
                  </button>
                  <div className="h-4 border-r border-gray-300 mx-1"></div>
                  <button
                    onClick={() => insertFormatting("center")}
                    className="p-1.5 rounded hover:bg-gray-200"
                    title="Center"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Editor and Preview */}
              <div className="flex-1 flex">
                {/* Editor */}
                <div className="w-1/2 border-r border-gray-200 bg-white">
                  <div className="h-full flex flex-col">
                    <div className="p-2 bg-gray-100 border-b border-gray-200 flex justify-between">
                      <div className="flex space-x-2">
                        <button
                          className={`px-3 py-1 text-sm rounded ${activeSection === "editor" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
                          onClick={() => setActiveSection("editor")}
                        >
                          Editor
                        </button>
                        <button
                          className={`px-3 py-1 text-sm rounded ${activeSection === "outline" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
                          onClick={() => setActiveSection("outline")}
                        >
                          Outline
                        </button>
                      </div>
                      <button
                        className="px-3 py-1 text-sm rounded hover:bg-gray-200 flex items-center"
                        onClick={() => {
                          navigator.clipboard.writeText(paperContent)
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <textarea
                      ref={editorRef}
                      className="flex-1 p-4 font-mono text-sm resize-none w-full h-full focus:outline-none"
                      value={paperContent}
                      onChange={(e) => {
                        setPaperContent(e.target.value)
                        // We don't update the section content here to avoid too many re-renders
                        // It will be updated when changing sections or saving
                      }}
                      onSelect={handleTextSelection}
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="w-1/2 bg-white">
                  <div className="h-full flex flex-col">
                    <div className="p-2 bg-gray-100 border-b border-gray-200 flex justify-between">
                      <div className="flex space-x-2">
                        <button
                          className={`px-3 py-1 text-sm rounded ${activeSection === "preview" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
                          onClick={() => setActiveSection("preview")}
                        >
                          Preview
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <select className="text-sm border border-gray-200 rounded px-2 py-1">
                          <option>PDF</option>
                          <option>HTML</option>
                          <option>LaTeX</option>
                        </select>
                        <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Export</button>
                      </div>
                    </div>
                    <div className="flex-1 p-8 overflow-auto">
                      <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg p-8">
                        <div dangerouslySetInnerHTML={renderLatexPreview()} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

