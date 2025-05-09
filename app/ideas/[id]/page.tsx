"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Download } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import type { UserData } from "@/types/user"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"
import React from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useIdea } from "@/context/IdeaContext"
import LitMapDiagram from "@/components/LitMapDiagram"

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Corrected API URL based on backend logs
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Interface for similar paper
interface SimilarPaper {
  title: string;
  abstract?: string;
  authors: string[];
  year?: number;
  source: string;
  source_url: string;
  journal?: string;
  doi?: string;
  semantic_similarity: number;
  citations?: number;
  venue?: string;
  keywords: string[];
  pdf_url?: string;
  icon?: string;
}

// Add this interface at the top of the file with the other interfaces
interface IdeaItem {
  Name: string;
  Title: string;
  Experiment: string;
  Interestingness: number;
  Feasibility: number;
  Novelty: number;
  description?: string;
  implementation_steps?: string[];
  expected_outcomes?: string[];
  potential_challenges?: string[];
  mitigation_strategies?: string[];
  scientific_merit?: number;
  innovation_level?: number;
  thought?: string;
}

// Update the IdeaDetail interface to use the IdeaItem type
interface IdeaDetail {
  _id: string          // MongoDB ObjectId
  task_id: string      // UUID for task
  user_id: string
  task_description: string
  status: string
  ideas: IdeaItem[]    // Use our new type instead of any[]
  thought: string
  reflection_rounds: number
  error?: string
  similar_papers?: SimilarPaper[]  // Added similar papers
  created_at?: string
}

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params at component level
  const id = params.id;

  const router = useRouter()
  const { token, isAuthenticated, loading: authLoading, refreshAuthState, user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [idea, setIdea] = useState<IdeaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const { experiment } = useIdea();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isAuthenticated && user) {
          // Use actual authenticated user data
          const userData: UserData = {
            personalInformation: [
              {
                id: 1,
                name: user.username || user.full_name || user.email,
                email: user.email,
                role: "Researcher",
                institution: "Research Institution",
                joinDate: new Date().toISOString(),
              },
            ],
            researchIdeas: [],
          }
          setUserData(userData)
        } else {
          setUserData(null)
        }
      } catch (error) {
        console.error("Error setting user data:", error)
      }
    }

    fetchUserData()
  }, [isAuthenticated, user])

  // Check auth state and refresh if necessary
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      if (!authLoading && !isAuthenticated) {
        try {
          const authStatus = await refreshAuthState();
          if (!authStatus) {
            router.push("/login");
          }
        } catch (error) {
          console.error("Auth refresh failed:", error);
          router.push("/login");
        }
      }
    };
    
    checkAuthAndFetch();
  }, [authLoading, isAuthenticated, refreshAuthState, router]);

  // Fetch idea details and set up SSE
  useEffect(() => {
    const fetchIdeaDetails = async () => {
      if (!id || authLoading) return;
      
      if (!isAuthenticated || !token) {
        // Don't try to fetch if not authenticated
        return;
      }
      
      setLoading(true);
      try {
        console.log(`Fetching idea from: ${API_URL}/ideas/${id}`);
        
        // Fetch initial idea details using the id from URL params
        const response = await axios.get(`${API_URL}/ideas/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("API response:", response.data);
        setIdea(response.data);
        setLoading(false);

        // If the task is still in progress, set up SSE connection
        if (response.data.status === "PENDING" || response.data.status === "PROCESSING") {
          const sse = new EventSource(`${API_URL}/ideas/events/${id}`);
          
          sse.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setIdea(data);
            
            // Close connection when completed or failed
            if (data.status === "completed" || data.status === "failed") {
              sse.close();
            }
          };
          
          sse.onerror = () => {
            sse.close();
          };
          
          setEventSource(sse);
        }
      } catch (err) {
        console.error("Error fetching idea details:", err);
        const error = err as any;
        
        if (error.response?.status === 404) {
          console.error("Endpoint not found. URL:", `${API_URL}/ideas/${id}`);
          setError(`Idea not found. The requested idea may have been deleted or doesn't exist. (ID: ${id})`);
        } else if (error.response?.status === 401) {
          // Handle 401 errors by trying to refresh auth
          try {
            await refreshAuthState();
          } catch (authError) {
            console.error("Auth refresh failed:", authError);
            setError("Authentication error. Please login again.");
          }
        } else {
          setError(`Failed to load idea details. Error: ${error.message || "Unknown error"}`);
        }
        setLoading(false);
      }
    };

    fetchIdeaDetails();

    return () => {
      // Clean up SSE connection
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [id, token, isAuthenticated, authLoading, refreshAuthState]);

  // Get user information
  const userName = userData?.personalInformation[0]?.name || "Researcher"
  const userInitial = userName.charAt(0)

  const handleBackClick = () => {
    router.push("/ideas/generated");
  };

  const handleDownloadPdf = async () => {
    if (!idea) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let yOffset = margin;

    // Helper functions
    const addSectionTitle = (title: string) => {
      yOffset += 24;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yOffset);
      yOffset += 16;
      doc.setFont('helvetica', 'normal');
    };
    const addSubTitle = (title: string) => {
      yOffset += 18;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yOffset);
      yOffset += 12;
      doc.setFont('helvetica', 'normal');
    };
    const addText = (text: string, fontSize = 11, indent = 0, extraSpace = 14) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - indent);
      doc.text(lines, margin + indent, yOffset);
      yOffset += lines.length * (fontSize + 7) + extraSpace;
    };
    const addList = (items: string[], numbered = false, indent = 20, extraSpace = 12) => {
      if (!items || items.length === 0) return;
      items.forEach((item, idx) => {
        const prefix = numbered ? `${idx + 1}. ` : '\u2022 ';
        addText(`${prefix}${item}`, 11, indent, 4);
      });
      yOffset += extraSpace;
    };
    const addHorizontalLine = () => {
      yOffset += 8;
      doc.setDrawColor(180);
      doc.setLineWidth(0.5);
      doc.line(margin, yOffset, pageWidth - margin, yOffset);
      yOffset += 10;
    };
    const checkNewPage = (neededHeight = 40) => {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (yOffset + neededHeight > pageHeight - margin) {
        doc.addPage();
        yOffset = margin;
      }
    };

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Research Idea Details', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += 30;
    doc.setFont('helvetica', 'normal');

    // Task ID
    doc.setFontSize(10);
    doc.text(`Task ID: ${idea.task_id}`, margin, yOffset);
    yOffset += 16;
    addHorizontalLine();

    // Seed Idea
    addSectionTitle('Seed Idea / Task Description');
    addText(idea.task_description || experiment, 11);
    addHorizontalLine();

    // Generated Ideas
    addSectionTitle('Generated Ideas');
    idea.ideas.forEach((genIdea, idx) => {
      checkNewPage(120);
      addSubTitle(`Idea ${idx + 1}: ${genIdea.Title}`);
      if (genIdea.Name) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Name:`, margin, yOffset);
        doc.setFont('helvetica', 'normal');
        doc.text(genIdea.Name, margin + 50, yOffset);
        yOffset += 16;
      }
      // Description
      if (genIdea.description) {
        addSubTitle('Description');
        addText(genIdea.description, 11, 10);
      }
      // Experiment
      if (genIdea.Experiment) {
        addSubTitle('Experiment');
        addText(genIdea.Experiment, 11, 10);
      }
      // Scores
      addSubTitle('Scores');
      addText(`Interestingness: ${genIdea.Interestingness}`, 11, 10);
      addText(`Feasibility: ${genIdea.Feasibility}`, 11, 10);
      addText(`Novelty: ${genIdea.Novelty}`, 11, 10);
      if (genIdea.scientific_merit !== undefined)
        addText(`Scientific Merit: ${(genIdea.scientific_merit * 100).toFixed(0)}%`, 11, 10);
      if (genIdea.innovation_level !== undefined)
        addText(`Innovation Level: ${(genIdea.innovation_level * 100).toFixed(0)}%`, 11, 10);
      // Implementation Steps
      if (genIdea.implementation_steps && genIdea.implementation_steps.length > 0) {
        addSubTitle('Implementation Steps');
        addList(genIdea.implementation_steps, true, 20);
      }
      // Expected Outcomes
      if (genIdea.expected_outcomes && genIdea.expected_outcomes.length > 0) {
        addSubTitle('Expected Outcomes');
        addList(genIdea.expected_outcomes, false, 20);
      }
      // Potential Challenges
      if (genIdea.potential_challenges && genIdea.potential_challenges.length > 0) {
        addSubTitle('Potential Challenges');
        addList(genIdea.potential_challenges, false, 20);
      }
      // Mitigation Strategies
      if (genIdea.mitigation_strategies && genIdea.mitigation_strategies.length > 0) {
        addSubTitle('Mitigation Strategies');
        addList(genIdea.mitigation_strategies, false, 20);
      }
      // Developer's Thought
      if (genIdea.thought) {
        addSubTitle("Developer's Thought");
        doc.setFont('helvetica', 'italic');
        addText(genIdea.thought, 11, 10);
        doc.setFont('helvetica', 'normal');
      }
      addHorizontalLine();
    });

    // Similar Papers Table
    if (idea.similar_papers && idea.similar_papers.length > 0) {
      checkNewPage(120);
      addSectionTitle('Similar Research Papers');
      autoTable(doc, {
        startY: yOffset,
        head: [['Title', 'Authors', 'Year', 'Source', 'Similarity']],
        body: idea.similar_papers.map(paper => [
          paper.title,
          paper.authors.slice(0, 2).join(", ") + (paper.authors.length > 2 ? " et al." : ""),
          paper.year || 'N/A',
          paper.source,
          paper.semantic_similarity.toFixed(3)
        ]),
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133], fontStyle: 'bold', fontSize: 11 },
        bodyStyles: { fontSize: 10 },
        margin: { left: margin, right: margin },
        styles: { cellPadding: 4 },
        didDrawPage: (data) => {
          if (data.cursor) {
            yOffset = data.cursor.y + 10;
          }
        }
      });
      addHorizontalLine();
    }

    doc.save(`idea_${idea.task_id || 'details'}.pdf`);
  };

  // Update the debug section to use id instead of ideaId
  useEffect(() => {
    if (id) {
      console.log("Debug - Current idea ID:", id);
      console.log("Debug - API URL:", API_URL);
      console.log("Debug - Full API endpoint:", `${API_URL}/ideas/${id}`);
    }
  }, [id]);

  // Helper for elapsed time
  function getElapsedTime(createdAt?: string) {
    if (!createdAt) return null;
    const start = new Date(createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // Helper for source bubble color
  function getSourceBubbleClass(source: string) {
    const s = source.toLowerCase();
    if (s.includes("arxiv")) {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
    if (s.includes("semantic scholar")) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
    if (s.includes("springer")) {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    }
    // Default
    return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }

  if (loading || authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background dark:bg-background">
        {/* Sidebar placeholder */}
        <div className={`fixed top-0 left-0 z-40 w-64 h-screen bg-card border-r border-border transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}></div>
        {/* Navbar placeholder */}
        <div className={`fixed top-0 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} w-[calc(100%-0px)] sm:w-[calc(100%-0px)] md:w-[calc(100%-64px)] lg:w-[calc(100%-256px)]`}>
          <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6"></div>
        </div>

        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background dark:bg-background">
        {/* Sidebar */}
        <Sidebar
          userName={userName}
          userInitial={userInitial}
          activeView="ideas"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          {/* Navbar */}
          <Navbar
            userName={userName}
            userInitial={userInitial}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 p-6 bg-muted/40 dark:bg-muted/40">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleBackClick}
                className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 dark:text-foreground dark:bg-primary dark:hover:bg-primary/90"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Generated Ideas
              </button>
              <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md" role="alert">
                <div className="flex">
                  <div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1z"/></svg></div>
                  <div>
                    <p className="font-bold">Error Loading Idea</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  if (!idea) {
    // This case should ideally be covered by loading or error state
    // but as a fallback:
    return (
      <div className="flex flex-col min-h-screen bg-background dark:bg-background">
        {/* Sidebar */}
        <Sidebar
          userName={userName}
          userInitial={userInitial}
          activeView="ideas"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          {/* Navbar */}
          <Navbar
            userName={userName}
            userInitial={userInitial}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 p-6 flex items-center justify-center bg-muted/40 dark:bg-muted/40">
            <div className="text-center">
              <h1 className="text-xl font-semibold text-foreground">Idea not found.</h1>
              <p className="text-muted-foreground">The idea may have been deleted or the link is incorrect.</p>
              <button
                onClick={handleBackClick}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 dark:text-foreground dark:bg-primary dark:hover:bg-primary/90"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Generated Ideas
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  // Main content rendering when idea is available
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          userName={userName}
          userInitial={userInitial}
          activeView="ideas"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "ml-0"}`}>
          <Navbar
            userName={userName}
            userInitial={userInitial}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 p-4 sm:p-6 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6 gap-2">
                <button
                  onClick={handleBackClick}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
              </div>

              { idea ? (
              <div className="bg-card dark:bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">Research Idea</h1>
                  <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${idea.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
                        idea.status === "PENDING" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : 
                        idea.status === "PROCESSING" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
                      {idea.status}
                    </div>
                    {idea.status === "PROCESSING" && (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                      </span>
                    )}
                    {idea.created_at && (
                      <span className="text-xs text-muted-foreground ml-2">Started {getElapsedTime(idea.created_at)}</span>
                    )}
                  </div>
                </div>

                {/* Seed Idea Display */}
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-card-foreground mb-1 uppercase tracking-wider">Seed Idea</h2>
                  <div className="bg-muted dark:bg-gray-800 px-4 py-3 rounded-lg text-sm text-muted-foreground whitespace-pre-line break-words max-w-3xl shadow-sm">
                    {idea.task_description || experiment}
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-medium text-card-foreground mb-2">Generated Ideas</h2>
                  {idea.ideas && idea.ideas.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                      {idea.ideas.map((ideaItem, index) => (
                        <div key={index} className="p-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                          <div className="flex items-start mb-3">
                            <div className="mr-4 flex-shrink-0">
                              <span className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white text-xl font-bold">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{ideaItem.Title}</h3>
                              {ideaItem.Name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 italic">({ideaItem.Name})</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Scores: Interestingness, Feasibility, Novelty */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {/* Interestingness */}
                            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-lg shadow text-center">
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-300 mb-1">Interestingness</p>
                              <p className="text-4xl font-bold text-blue-700 dark:text-blue-200">{ideaItem.Interestingness}</p>
                            </div>
                            {/* Feasibility */}
                            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 p-4 rounded-lg shadow text-center">
                              <p className="text-sm font-medium text-green-600 dark:text-green-300 mb-1">Feasibility</p>
                              <p className="text-4xl font-bold text-green-700 dark:text-green-200">{ideaItem.Feasibility}</p>
                            </div>
                            {/* Novelty */}
                            <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 p-4 rounded-lg shadow text-center">
                              <p className="text-sm font-medium text-purple-600 dark:text-purple-300 mb-1">Novelty</p>
                              <p className="text-4xl font-bold text-purple-700 dark:text-purple-200">{ideaItem.Novelty}</p>
                            </div>
                          </div>
                          
                          {/* Description section */}
                          {ideaItem.description && (
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
                              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{ideaItem.description}</p>
                            </div>
                          )}

                          {/* Experiment section */}
                          {ideaItem.Experiment && (
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
                              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Experiment Details</h4>
                              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{ideaItem.Experiment}</p>
                            </div>
                          )}
                          
                          {/* Implementation Steps section */}
                          {ideaItem.implementation_steps && ideaItem.implementation_steps.length > 0 && (
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
                              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Implementation Steps</h4>
                              <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                                {ideaItem.implementation_steps.map((step: string, stepIndex: number) => (
                                  <li key={stepIndex} className="leading-relaxed">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                          
                          {/* Expected Outcomes section */}
                          {ideaItem.expected_outcomes && ideaItem.expected_outcomes.length > 0 && (
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
                              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Outcomes</h4>
                              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                                {ideaItem.expected_outcomes.map((outcome: string, outcomeIndex: number) => (
                                  <li key={outcomeIndex} className="leading-relaxed">{outcome}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Challenges and Mitigation Strategies */}
                          {(ideaItem.potential_challenges && ideaItem.potential_challenges.length > 0) || 
                           (ideaItem.mitigation_strategies && ideaItem.mitigation_strategies.length > 0) ? (
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
                              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Challenges & Mitigation</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {ideaItem.potential_challenges && ideaItem.potential_challenges.length > 0 && (
                                  <div>
                                    <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Potential Challenges</h5>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                                      {ideaItem.potential_challenges.map((challenge: string, challengeIndex: number) => (
                                        <li key={challengeIndex} className="leading-relaxed">{challenge}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {ideaItem.mitigation_strategies && ideaItem.mitigation_strategies.length > 0 && (
                                  <div>
                                    <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Mitigation Strategies</h5>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                                      {ideaItem.mitigation_strategies.map((strategy: string, strategyIndex: number) => (
                                        <li key={strategyIndex} className="leading-relaxed">{strategy}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : null}
                          
                          {/* Scientific Merit and Innovation Level */}
                          {(ideaItem.scientific_merit !== undefined || ideaItem.innovation_level !== undefined) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                              {ideaItem.scientific_merit !== undefined && (
                                <div className="bg-gray-100 dark:bg-gray-700/80 p-4 rounded-lg">
                                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Scientific Merit</p>
                                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{(ideaItem.scientific_merit * 100).toFixed(0)}%</p>
                                </div>
                              )}
                              {ideaItem.innovation_level !== undefined && (
                                <div className="bg-gray-100 dark:bg-gray-700/80 p-4 rounded-lg">
                                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Innovation Level</p>
                                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{(ideaItem.innovation_level * 100).toFixed(0)}%</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Thought for this specific idea */}
                          {ideaItem.thought && (
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
                              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Developer&apos;s Thought</h4>
                              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed italic">{ideaItem.thought}</p>
                            </div>
                          )}

                          {/* Download PDF button just above LitMapDiagram */}
                          {idea && idea.similar_papers && idea.similar_papers.length > 0 && (
                            <div className="mb-4 flex justify-end">
                              <button
                                onClick={handleDownloadPdf}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                              >
                                <Download className="mr-2 h-5 w-5" />
                                Download PDF
                              </button>
                            </div>
                          )}

                          {/* Literature Map Diagram */}
                          {idea && idea.similar_papers && idea.similar_papers.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Literature Context Map</h4>
                              <LitMapDiagram 
                                currentIdea={ideaItem} 
                                similarPapers={idea.similar_papers} 
                                className="mb-6"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (idea.status === "started" || idea.status === "PENDING" || idea.status === "PROCESSING") ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg">
                      <div className="flex items-center mb-4">
                        <span className="relative flex h-4 w-4 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                        </span>
                        <span className="text-lg text-muted-foreground">Generating research ideas...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-card rounded-lg">
                      <p className="text-lg text-muted-foreground mb-4">No ideas generated yet.</p>
                    </div>
                  )}
                </div>

                {idea.error && (
                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Error</h2>
                    <p className="text-red-700 dark:text-red-400">{idea.error}</p>
                  </div>
                )}

                {/* Similar Papers Section */}
                {idea.similar_papers && idea.similar_papers.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-medium text-card-foreground mb-4">Similar Research Papers</h2>
                    <div className="space-y-4">
                      {idea.similar_papers.map((paper, index) => (
                        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:border-blue-300 transition-all">
                          <div className="flex items-start">
                            {paper.source && (
                              <div className="mr-3 flex-shrink-0">
                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getSourceBubbleClass(paper.source)}`}>
                                  {paper.source}
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground hover:text-blue-500">
                                <a href={paper.source_url} target="_blank" rel="noopener noreferrer">
                                  {paper.title}
                                </a>
                              </h3>
                              <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-2">
                                {paper.authors.length > 0 && (
                                  <span>
                                    {paper.authors.slice(0, 3).join(", ")}
                                    {paper.authors.length > 3 && " et al."}
                                  </span>
                                )}
                                {paper.year && <span>({paper.year})</span>}
                                {paper.journal && <span className="italic">{paper.journal}</span>}
                              </div>
                              
                              {paper.abstract && (
                                <div className="mt-2">
                                  <p className="text-sm text-muted-foreground line-clamp-3">{paper.abstract}</p>
                                </div>
                              )}
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                {paper.semantic_similarity && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    Similarity: {(paper.semantic_similarity * 100).toFixed(1)}%
                                  </span>
                                )}
                                {paper.citations !== undefined && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                    Citations: {paper.citations}
                                  </span>
                                )}
                                {paper.keywords && paper.keywords.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {paper.keywords.slice(0, 3).map((keyword, kidx) => (
                                      <span key={kidx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-2 flex gap-2">
                                {paper.pdf_url && (
                                  <a 
                                    href={paper.pdf_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    PDF
                                  </a>
                                )}
                                {paper.doi && (
                                  <a 
                                    href={`https://doi.org/${paper.doi}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    DOI: {paper.doi}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading idea details or idea not found.</p>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
} 