"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2, ArrowLeft, Download, BookOpen, RefreshCw, ExternalLink, ChevronDown, ChevronRight, Star, TrendingUp, Database, Target, Globe, Clock } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import type { UserData } from "@/types/user"
import { useAuth } from "@/context/AuthContext"
import React from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useIdea } from "@/context/IdeaContext"
import LitMapDiagram from "@/components/LitMapDiagram"
import { submitIdeaFeedback, getIdea } from "@/services/idea-service"
import FollowupQuestionCards from "@/components/followup-question-cards"
import type { IdeaDetail, FollowUpQuestion, FollowUpAnswer, IdeaFeedback, IdeaItem } from "@/types/idea"
import { downloadIdeaAsPdf } from "@/lib/pdf"
import { useIdeaDetails } from "@/hooks/useIdeaDetails"
import { getElapsedTime, getDurationBetween, getSourceBubbleClass, getSourceHomepage } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function IdeaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ideaId = params.id as string
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { idea, loading, error, setIdea } = useIdeaDetails(ideaId, isAuthenticated, authLoading)

  const [userData, setUserData] = useState<UserData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { experiment, setExperiment } = useIdea()
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [expandedIdeas, setExpandedIdeas] = useState<Record<number, boolean>>({})
  const [feedbackState, setFeedbackState] = useState<Record<number, IdeaFeedback>>({})
  const [submittingFeedback, setSubmittingFeedback] = useState<Record<number, boolean>>({})
  const [feedbackSuccess, setFeedbackSuccess] = useState<Record<number, boolean>>({})
  const [followUpExpanded, setFollowUpExpanded] = useState(false) // For collapsible follow-up questions - collapsed by default
  const [feedbackExpanded, setFeedbackExpanded] = useState<Record<number, boolean>>({})
  const [individualIdeas, setIndividualIdeas] = useState<IdeaItem[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState<boolean>(true);

  // Load individual ideas when the main idea task loads
  useEffect(() => {
    const loadIndividualIdeas = async () => {
      if (!idea || !idea.ideas || idea.ideas.length === 0) return;
      
      // Check if ideas are already complete objects or just IDs
      const needsLoading = idea.ideas.some(i => typeof i === 'string' || !i.name);
      
      if (!needsLoading) {
        // Ideas are already complete objects
        setIndividualIdeas(idea.ideas as IdeaItem[]);
        
        // Initialize feedback state from individual ideas
        const initialFeedback: Record<number, IdeaFeedback> = {};
        
        if (idea.ideas && Array.isArray(idea.ideas)) {
          idea.ideas.forEach((ideaItem: any, index: number) => {
            if (ideaItem && ideaItem.feedback) {
              // Check if feedback is stored under "user" key
              const userFeedback = ideaItem.feedback?.user;
              if (userFeedback && userFeedback.overall && userFeedback.novelty && userFeedback.feasibility) {
                initialFeedback[index] = userFeedback as IdeaFeedback;
              }
            }
          });
        }
        
        // Fallback: check for task-level feedback
        if (Object.keys(initialFeedback).length === 0 && idea.feedback) {
          // Check if feedback is stored under "user" key (individual idea feedback)
          const userFeedback = (idea.feedback as any)?.user;
          if (userFeedback) {
            const feedbackData = userFeedback as IdeaFeedback;
            if (feedbackData.overall && feedbackData.novelty && feedbackData.feasibility) {
              initialFeedback[0] = feedbackData;
            }
          } else {
            // Original logic for other feedback structures
            // Two possible shapes:
            // 1. An object keyed by idea index ("0", "1", ...).
            // 2. A direct IdeaFeedback object (for standalone individual ideas).
            const maybeIdeaFeedback = idea.feedback as unknown as IdeaFeedback;
            const isDirectIdeaFeedback =
              typeof maybeIdeaFeedback === "object" &&
              maybeIdeaFeedback !== null &&
              "overall" in maybeIdeaFeedback &&
              "novelty" in maybeIdeaFeedback &&
              "feasibility" in maybeIdeaFeedback;

            if (isDirectIdeaFeedback) {
              initialFeedback[0] = maybeIdeaFeedback;
            } else {
              // Task-level feedback keyed by idea index
              Object.entries(idea.feedback as Record<string, IdeaFeedback>).forEach(
                ([key, value]) => {
                  const idx = parseInt(key);
                  if (!isNaN(idx)) {
                    initialFeedback[idx] = value;
                  }
                }
              );
            }
          }
        }
        
        setFeedbackState(initialFeedback);
        
        setLoadingIdeas(false);
        return;
      }
      
      setLoadingIdeas(true);
      try {
        const loadedIdeas: IdeaItem[] = [];
        
        for (const ideaItem of idea.ideas) {
          // If it's already a complete idea object with name, use it directly
          if (typeof ideaItem !== 'string' && ideaItem.name) {
            loadedIdeas.push(ideaItem as IdeaItem);
            continue;
          }
          
          // Otherwise, fetch the individual idea by ID
          const ideaId = typeof ideaItem === 'string' ? ideaItem : ideaItem._id;
          if (!ideaId) {
            console.error('Invalid idea item:', ideaItem);
            continue;
          }
          
          try {
            const ideaData = await getIdea(ideaId);
            // If the response is a single idea with required fields, convert it to IdeaItem
            if (ideaData && typeof ideaData === 'object') {
              if ('name' in ideaData && 'title' in ideaData) {
                // It's already in IdeaItem format
                loadedIdeas.push(ideaData as unknown as IdeaItem);
              } 
              // If it's an idea task with ideas array, use the first idea
              else if ('ideas' in ideaData && Array.isArray(ideaData.ideas) && ideaData.ideas.length > 0) {
                loadedIdeas.push(ideaData.ideas[0] as IdeaItem);
              } else {
                // Create a placeholder with available data
                loadedIdeas.push({
                  name: `Idea ${loadedIdeas.length + 1}`,
                  title: ideaData.task_description || 'Unknown idea format',
                  experiment: '',
                  description: 'Could not parse complete idea details from the server response.',
                  _id: ideaId
                });
              }
            } else {
              // Fallback placeholder
              loadedIdeas.push({
                name: `Idea ${loadedIdeas.length + 1}`,
                title: 'Unknown idea format',
                experiment: '',
                description: 'Could not parse idea details from the server response.',
                _id: ideaId
              });
            }
          } catch (err) {
            console.error(`Failed to load idea ${ideaId}:`, err);
            // Add a placeholder for failed ideas
            loadedIdeas.push({
              name: `Idea ${loadedIdeas.length + 1}`,
              title: 'Failed to load idea details',
              experiment: '',
              description: 'Could not retrieve idea details from the server.',
              _id: ideaId
            });
          }
        }
        
        setIndividualIdeas(loadedIdeas);
        
        // Initialize feedback state from individual ideas (second location)
        const initialFeedback: Record<number, IdeaFeedback> = {};
        
        if (idea.ideas && Array.isArray(idea.ideas)) {
          idea.ideas.forEach((ideaItem: any, index: number) => {
            if (ideaItem && ideaItem.feedback) {
              // Check if feedback is stored under "user" key
              const userFeedback = ideaItem.feedback?.user;
              if (userFeedback && userFeedback.overall && userFeedback.novelty && userFeedback.feasibility) {
                initialFeedback[index] = userFeedback as IdeaFeedback;
              }
            }
          });
        }
        
        // Fallback: check for task-level feedback
        if (Object.keys(initialFeedback).length === 0 && idea.feedback) {
          // Check if feedback is stored under "user" key (individual idea feedback)
          const userFeedback = (idea.feedback as any)?.user;
          if (userFeedback) {
            const feedbackData = userFeedback as IdeaFeedback;
            if (feedbackData.overall && feedbackData.novelty && feedbackData.feasibility) {
              initialFeedback[0] = feedbackData;
            }
          } else {
            // Original logic for other feedback structures
            // Two possible shapes:
            // 1. An object keyed by idea index ("0", "1", ...).
            // 2. A direct IdeaFeedback object (for standalone individual ideas).
            const maybeIdeaFeedback = idea.feedback as unknown as IdeaFeedback;
            const isDirectIdeaFeedback =
              typeof maybeIdeaFeedback === "object" &&
              maybeIdeaFeedback !== null &&
              "overall" in maybeIdeaFeedback &&
              "novelty" in maybeIdeaFeedback &&
              "feasibility" in maybeIdeaFeedback;

            if (isDirectIdeaFeedback) {
              initialFeedback[0] = maybeIdeaFeedback;
            } else {
              // Task-level feedback keyed by idea index
              Object.entries(idea.feedback as Record<string, IdeaFeedback>).forEach(
                ([key, value]) => {
                  const idx = parseInt(key);
                  if (!isNaN(idx)) {
                    initialFeedback[idx] = value;
                  }
                }
              );
            }
          }
        }
        
        setFeedbackState(initialFeedback);
      } catch (err) {
        console.error('Error loading individual ideas:', err);
      } finally {
        setLoadingIdeas(false);
      }
    };
    
    loadIndividualIdeas();
  }, [idea]);

  // Toggle the expanded state of an idea
  const toggleIdeaExpand = (index: number) => {
    setExpandedIdeas(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Toggle follow-up questions section
  const toggleFollowUpExpanded = () => {
    setFollowUpExpanded(prev => !prev)
  }

  // Toggle feedback section
  const toggleFeedbackExpand = (index: number) => {
    setFeedbackExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

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
                name: user.full_name || user.username || user.email,
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

  // Check auth state
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // When we navigate away, save the current idea description to context
  useEffect(() => {
    if (idea?.task_description) {
      setExperiment(idea.task_description)
    }
    
    return () => {
      // Cleanup if needed
    }
  }, [idea, setExperiment])

  // Get user information
  const userName = userData?.personalInformation[0]?.name || "Researcher"
  const userInitial = userName.charAt(0)

  const handleBackClick = () => {
    router.push("/ideas/generated");
  };

  const handleDownloadPdf = () => {
    if (idea) {
      downloadIdeaAsPdf(idea, experiment);
    }
  };

  // Match follow-up answers with their questions
  const getFollowUpQuestionsWithAnswers = () => {
    if (!idea || !idea.follow_up_questions) return []
    
    return idea.follow_up_questions.map((question: FollowUpQuestion) => {
      // Check if the question already has an answer field (new backend structure)
      if (question.answer) {
        return {
          ...question,
          answer: question.answer
        }
      }
      
      // Fallback to old structure with separate follow_up_answers array
      const answer = idea.follow_up_answers?.find(
        (a: FollowUpAnswer) => a.question_id === question.id
      )
      
      return {
        ...question,
        answer: answer ? answer.answer : null
      }
    })
  }

  // Handle feedback submission
  const handleFeedbackSubmit = async (ideaIndex: number) => {
    if (!idea || !individualIdeas || !feedbackState[ideaIndex]) return;
    
    setSubmittingFeedback(prev => ({ ...prev, [ideaIndex]: true }));
    setFeedbackSuccess(prev => ({ ...prev, [ideaIndex]: false }));
    
    try {
      // Get the individual idea ID
      const selectedIdea = individualIdeas[ideaIndex];
      if (!selectedIdea || !selectedIdea._id) {
        throw new Error("Selected idea ID not found");
      }

      const individualIdeaId = selectedIdea._id;
      console.log(`Submitting feedback for individual idea ${individualIdeaId}`);
      
      await submitIdeaFeedback(individualIdeaId, feedbackState[ideaIndex]);
      setFeedbackSuccess(prev => ({ ...prev, [ideaIndex]: true }));
      
      // Update the local idea state with the submitted feedback
      if (idea) {
        const isDirectIdeaFeedback =
          idea.feedback &&
          typeof idea.feedback === "object" &&
          "overall" in idea.feedback &&
          "novelty" in idea.feedback &&
          "feasibility" in idea.feedback;

        if (isDirectIdeaFeedback) {
          // Stand-alone individual idea
          setIdea({
            ...idea,
            feedback: feedbackState[ideaIndex] as any
          });
        } else {
          // Task-level feedback keyed by idea index
          setIdea({
            ...idea,
            feedback: {
              ...(idea.feedback || {}),
              [ideaIndex]: feedbackState[ideaIndex]
            }
          });
        }
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFeedbackSuccess(prev => ({ ...prev, [ideaIndex]: false }));
      }, 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      // Error handling could be added here
    } finally {
      setSubmittingFeedback(prev => ({ ...prev, [ideaIndex]: false }));
    }
  };

  // Handle rating change
  const handleRatingChange = (ideaIndex: number, aspectKey: 'overall' | 'novelty' | 'feasibility', value: number) => {
    setFeedbackState(prev => ({
      ...prev,
      [ideaIndex]: {
        ...prev[ideaIndex] || {
          overall: { score: 0, text: '' },
          novelty: { score: 0, text: '' },
          feasibility: { score: 0, text: '' }
        },
        [aspectKey]: {
          ...prev[ideaIndex]?.[aspectKey] || { score: 0, text: '' },
          score: value
        }
      }
    }));
  };

  // Handle comment change
  const handleCommentChange = (ideaIndex: number, aspectKey: 'overall' | 'novelty' | 'feasibility', value: string) => {
    setFeedbackState(prev => ({
      ...prev,
      [ideaIndex]: {
        ...prev[ideaIndex] || {
          overall: { score: 0, text: '' },
          novelty: { score: 0, text: '' },
          feasibility: { score: 0, text: '' }
        },
        [aspectKey]: {
          ...prev[ideaIndex]?.[aspectKey] || { score: 0, text: '' },
          text: value
        }
      }
    }));
  };

  // Star rating component
  const StarRating = ({ value, onChange, max = 5 }: { value: number, onChange: (value: number) => void, max?: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(max)].map((_, i) => (
          <Star 
            key={i}
            className={`h-6 w-6 cursor-pointer ${i < value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            onClick={() => onChange(i + 1)}
          />
        ))}
      </div>
    );
  };

  // Helper to bold prefix (e.g., "Step 1:") within list items
  const formatTextWithBoldPrefix = (text: string) => {
    const idx = text.indexOf(":");
    if (idx !== -1) {
      return (
        <>
          <span className="font-semibold">{text.slice(0, idx + 1)}</span>
          {text.slice(idx + 1)}
        </>
      );
    }
    return text;
  };

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
      <div className="flex min-h-screen bg-background dark:bg-background">
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
          <main className="flex-1 p-4 sm:p-6 bg-background dark:bg-background">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6 gap-2">
                <button
                  onClick={handleBackClick}
                  className="inline-flex items-center px-4 py-2 border border-border dark:border-border text-sm font-medium rounded-md shadow-sm text-foreground dark:text-foreground bg-card dark:bg-card hover:bg-accent dark:hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center px-4 py-2 border border-border dark:border-border text-sm font-medium rounded-md shadow-sm text-foreground dark:text-foreground bg-card dark:bg-card hover:bg-accent dark:hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </button>
              </div>

              { idea ? (
              // This ID is essential for the PDF export functionality.
              // The html2pdf.js library uses it to identify the content to capture.
              <div id="pdf-content" className="bg-card dark:bg-card border border-border rounded-lg p-6 shadow-sm">
                { (idea.status?.toLowerCase() === "answer_followup" || idea.status?.toLowerCase() === "waiting_for_answers") && idea.follow_up_questions && idea.follow_up_questions.length > 0 ? (
                <>
                  <button 
                    onClick={handleBackClick} 
                    className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Ideas
                  </button>
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Seed Idea: {idea.task_description}
                    </h1>
                    <FollowupQuestionCards 
                      taskId={idea.task_id}
                      questions={idea.follow_up_questions}
                      onComplete={() => {
                        // Refresh the idea data
                        if (ideaId) {
                          getIdea(ideaId).then(data => {
                            // Map API response to IdeaDetail
                            setIdea({
                              _id: data.task_id,
                              ...data
                            } as IdeaDetail);
                          }).catch(err => {
                            console.error("Error refreshing idea:", err);
                          });
                        }
                      }}
                    />
                  </div>
                </>
                                ) : (
                <div className="space-y-6">
                  {/* Main Content Section */}
                  <div className="flex items-center justify-between mb-6">
                    <button 
                      onClick={handleBackClick} 
                      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Ideas
                    </button>
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
                      {idea.status === "completed" && idea.created_at && idea.updated_at && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 ml-1 cursor-help">
                                <Clock className="h-3 w-3 mr-1" />
                                {getDurationBetween(idea.created_at, idea.updated_at)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs font-medium">
                              Time taken
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>

                  {/* Seed Idea Display */}
                  <div className="mb-6 flex flex-col items-start">
                    <h2 className="text-sm font-semibold text-card-foreground mb-1 uppercase tracking-wider">Seed Idea</h2>
                    <div className="bg-muted dark:bg-gray-800 px-4 py-3 rounded-lg text-sm text-muted-foreground whitespace-pre-line break-words max-w-md shadow-sm">
                      {idea.task_description || experiment}
                    </div>
                  </div>

                  {/* Follow-up Questions Section - Below seed idea, collapsed by default */}
                  {idea.follow_up_questions && idea.follow_up_questions.length > 0 && (
                    <div className="mb-8 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                      <div 
                        className="px-6 py-4 cursor-pointer hover:bg-gray-100/60 dark:hover:bg-gray-800/40 transition-all duration-200"
                        onClick={toggleFollowUpExpanded}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Follow-up Questions & Answers
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {getFollowUpQuestionsWithAnswers().length} questions available
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              {followUpExpanded ? 'Collapse' : 'Expand'}
                            </span>
                            {followUpExpanded ? (
                              <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {followUpExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/50">
                          <div className="p-6">
                            <div className="space-y-6">
                              {getFollowUpQuestionsWithAnswers().map((item: any, index: number) => (
                                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                                  {/* Question */}
                                  <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex items-start gap-3">
                                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-white text-sm font-bold">Q</span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Question {index + 1}
                                          </span>
                                        </div>
                                        <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                                          {item.question}
                                        </p>
                                        {item.context && (
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                                            Context: {item.context}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Answer */}
                                  <div className="px-6 py-4">
                                    {item.answer ? (
                                      <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <span className="text-white text-sm font-bold">A</span>
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                              Answer
                                            </span>
                                          </div>
                                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {item.answer}
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <span className="text-white text-sm font-bold">A</span>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-gray-500 dark:text-gray-400 italic">
                                            No answer provided yet
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Research Analytics Section - Collapsible */}
                  {(() => {
                    // Collect all similar papers from all ideas and task level
                    const allSimilarPapers = [
                      ...(idea.similar_papers || []),
                      ...(idea.ideas || []).flatMap(ideaItem => ideaItem.similar_papers || [])
                    ];
                    
                    if (allSimilarPapers.length === 0) return null;
                    
                    const totalPapersScanned = allSimilarPapers.length;
                    const avgSimilarity = totalPapersScanned > 0 
                      ? allSimilarPapers.reduce((acc, paper) => acc + (paper.semantic_similarity || 0), 0) / totalPapersScanned
                      : 0;
                    
                    // Publication year distribution
                    const yearDistribution = allSimilarPapers.reduce((acc, paper) => {
                      const year = paper.year || 'Unknown';
                      acc[year] = (acc[year] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    
                    const yearChartData = Object.entries(yearDistribution)
                      .filter(([year]) => year !== 'Unknown' && parseInt(year) >= 2015)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([year, count]) => ({ year, count }));
                    
                    // Source distribution
                    const sourceDistribution = allSimilarPapers.reduce((acc, paper) => {
                      const source = paper.source || 'Unknown';
                      acc[source] = (acc[source] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    
                    const sourceChartData = Object.entries(sourceDistribution)
                      .map(([source, count]) => ({ source, count: count as number }))
                      .sort((a, b) => (b.count as number) - (a.count as number))
                      .slice(0, 6);
                    
                    // Source colors for pie chart - Enhanced vibrant colors
                    const sourceColors = {
                      'arXiv': '#e74c3c',        // Vibrant red
                      'IEEE': '#1abc9c',         // Turquoise
                      'Semantic Scholar': '#3498db', // Bright blue
                      'Scopus': '#2ecc71',       // Emerald green
                      'PubMed': '#f39c12',       // Orange
                      'ACM': '#9b59b6',          // Purple
                      'Google Scholar': '#e67e22', // Dark orange
                      'DBLP': '#34495e',         // Dark blue-gray
                      'ResearchGate': '#16a085', // Dark turquoise
                      'Unknown': '#95a5a6'       // Gray
                    };
                    
                    const totalCitations = allSimilarPapers.reduce((acc, paper) => acc + (paper.citations || 0), 0);
                    
                    return (
                      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="analytics" className="border-none">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4">
                                  <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                                                 <div className="text-left">
                                   <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Analysis Insights</h2>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Insights from {totalPapersScanned} research papers</p>
                                 </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                              <div className="space-y-8">
                                {/* Key Metrics Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/20">
                                    <div className="flex items-center mb-2">
                                      <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Top Similar Papers</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalPapersScanned.toLocaleString()}</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Research literature</div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/20">
                                    <div className="flex items-center mb-2">
                                      <Target className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Avg Similarity</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">{(avgSimilarity * 100).toFixed(1)}%</div>
                                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">Semantic relevance</div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800/20">
                                    <div className="flex items-center mb-2">
                                      <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Citations</span>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalCitations.toLocaleString()}</div>
                                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Research impact</div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800/20">
                                    <div className="flex items-center mb-2">
                                      <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Data Sources</span>
                                    </div>
                                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{Object.keys(sourceDistribution).length}</div>
                                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">Research databases</div>
                                  </div>
                                </div>

                                {/* Charts Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* Publication Year Trend */}
                                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                      <TrendingUp className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                                      Publication Years
                                    </h3>
                                    {yearChartData.length > 0 ? (
                                      <ResponsiveContainer width="100%" height={200}>
                                        <RechartsBarChart data={yearChartData}>
                                          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                          <YAxis tick={{ fontSize: 12 }} />
                                          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        </RechartsBarChart>
                                      </ResponsiveContainer>
                                    ) : (
                                      <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                                        <p>No publication year data available</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Source Distribution */}
                                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                      <Globe className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                                      Research Sources
                                    </h3>
                                    {sourceChartData.length > 0 ? (
                                      <div className="flex items-center">
                                        <ResponsiveContainer width="60%" height={200}>
                                          <PieChart>
                                            <Pie
                                              data={sourceChartData}
                                              cx="50%"
                                              cy="50%"
                                              outerRadius={80}
                                              dataKey="count"
                                              label={false}
                                            >
                                              {sourceChartData.map((entry, index) => (
                                                <Cell 
                                                  key={`cell-${index}`} 
                                                  fill={sourceColors[entry.source as keyof typeof sourceColors] || sourceColors.Unknown} 
                                                />
                                              ))}
                                            </Pie>
                                          </PieChart>
                                        </ResponsiveContainer>
                                        <div className="w-40% pl-4 space-y-2">
                                          {sourceChartData.map((item, index) => (
                                            <div key={item.source} className="flex items-center text-sm">
                                              <div 
                                                className="w-3 h-3 rounded-full mr-2" 
                                                style={{ 
                                                  backgroundColor: sourceColors[item.source as keyof typeof sourceColors] || sourceColors.Unknown 
                                                }}
                                              />
                                              <span className="text-gray-700 dark:text-gray-300 flex-1">{item.source}</span>
                                              <span className="text-gray-500 dark:text-gray-400 font-medium">{item.count}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                                        <p>No source data available</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800/20">
                                  <div className="flex items-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Research Insights</h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400 mb-1">Most Active Source</p>
                                      <p className="font-semibold text-indigo-700 dark:text-indigo-300">
                                        {sourceChartData.length > 0 ? sourceChartData[0].source : 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400 mb-1">Peak Publication Year</p>
                                      <p className="font-semibold text-indigo-700 dark:text-indigo-300">
                                        {yearChartData.length > 0 
                                          ? yearChartData.reduce((max, curr) => (curr.count as number) > (max.count as number) ? curr : max).year 
                                          : 'N/A'
                                        }
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-600 dark:text-gray-400 mb-1">High-Impact Papers</p>
                                      <p className="font-semibold text-indigo-700 dark:text-indigo-300">
                                        {allSimilarPapers.filter(p => (p.citations || 0) > 100).length} papers
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    );
                  })()}

                  <div className="mb-4">
                    <h2 className="text-lg font-medium text-card-foreground mb-2">Generated Ideas</h2>
                    {loadingIdeas ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : individualIdeas && individualIdeas.length > 0 ? (
                      <div className="space-y-4">
                        {individualIdeas.map((ideaItem, index) => (
                          <div key={ideaItem._id || index} className="bg-card dark:bg-card border border-border dark:border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Compressed idea view - always visible */}
                            <div 
                              className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:bg-accent dark:hover:bg-accent transition-colors"
                              onClick={() => toggleIdeaExpand(index)}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="flex-shrink-0">
                                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-sm">
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-lg font-semibold text-foreground dark:text-foreground break-words">
                                    {ideaItem.title || ideaItem.Title || 'Untitled Idea'}
                                  </h3>
                                  {/* Only show name if it's different from title */}
                                  {(ideaItem.name || ideaItem.Name) && 
                                   (ideaItem.name !== ideaItem.title && ideaItem.Name !== ideaItem.Title) && (
                                    <p className="text-sm text-muted-foreground dark:text-muted-foreground break-words">
                                      {(ideaItem.name || ideaItem.Name)?.replace(/_/g, ' ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-end gap-3 ml-auto">
                                <div className="flex flex-wrap justify-end gap-2">
                                  <div className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center gap-1.5 shadow-sm">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
                                    <span>Interestingness: {(ideaItem.interestingness || ideaItem.Interestingness || 0).toFixed(1)}</span>
                                  </div>
                                  <div className="px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-1.5 shadow-sm">
                                    <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                                    <span>Feasibility: {(ideaItem.feasibility?.score || ideaItem.Feasibility || 0).toFixed(1)}</span>
                                  </div>
                                  <div className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium flex items-center gap-1.5 shadow-sm">
                                    <div className="h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400"></div>
                                    <span>Novelty: {(ideaItem.novelty?.score || ideaItem.Novelty || 0).toFixed(1)}</span>
                                  </div>
                                </div>
                                <div className="text-gray-400 dark:text-gray-500">
                                  {expandedIdeas[index] ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                                                            {/* Expanded idea details */}
                            {expandedIdeas[index] && (
                              <div className="p-6 pt-2 bg-muted dark:bg-muted border-t border-border">
                                {/* Idea Evolution Section */}
                                {ideaItem.reflection_rounds && ideaItem.reflection_rounds.length > 0 && (
                                  <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                      <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                      Idea Evolution Through Reflection Rounds
                                    </h4>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                                      <div className="relative">
                                        {/* Vertical Timeline */}
                                        <div className="space-y-6">
                                          {ideaItem.reflection_rounds.map((round: any, roundIndex: number) => {
                                            // Professional color scheme
                                            const getColorScheme = (index: number) => {
                                              const schemes = [
                                                { 
                                                  circle: 'bg-slate-600 dark:bg-slate-500',
                                                  bg: 'bg-slate-50 dark:bg-slate-800/50',
                                                  border: 'border-slate-200 dark:border-slate-600',
                                                  badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
                                                  text: 'text-slate-700 dark:text-slate-300'
                                                },
                                                {
                                                  circle: 'bg-blue-600 dark:bg-blue-500',
                                                  bg: 'bg-blue-50 dark:bg-blue-900/20',
                                                  border: 'border-blue-200 dark:border-blue-700',
                                                  badge: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300',
                                                  text: 'text-blue-700 dark:text-blue-300'
                                                },
                                                {
                                                  circle: 'bg-indigo-600 dark:bg-indigo-500',
                                                  bg: 'bg-indigo-50 dark:bg-indigo-900/20',
                                                  border: 'border-indigo-200 dark:border-indigo-700',
                                                  badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300',
                                                  text: 'text-indigo-700 dark:text-indigo-300'
                                                },
                                                {
                                                  circle: 'bg-emerald-600 dark:bg-emerald-500',
                                                  bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                                                  border: 'border-emerald-200 dark:border-emerald-700',
                                                  badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300',
                                                  text: 'text-emerald-700 dark:text-emerald-300'
                                                },
                                                {
                                                  circle: 'bg-violet-600 dark:bg-violet-500',
                                                  bg: 'bg-violet-50 dark:bg-violet-900/20',
                                                  border: 'border-violet-200 dark:border-violet-700',
                                                  badge: 'bg-violet-100 text-violet-700 dark:bg-violet-800 dark:text-violet-300',
                                                  text: 'text-violet-700 dark:text-violet-300'
                                                }
                                              ];
                                              return schemes[index % schemes.length];
                                            };
                                            
                                            const colorScheme = getColorScheme(roundIndex);
                                            
                                            return (
                                              <div key={roundIndex} className="relative flex items-start">
                                                                                                 {/* Vertical line connector */}
                                                 {ideaItem.reflection_rounds && roundIndex < ideaItem.reflection_rounds.length - 1 && (
                                                   <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-300 dark:bg-slate-600"></div>
                                                 )}
                                                
                                                {/* Round number circle */}
                                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ${colorScheme.circle}`}>
                                                  {round.round_number || roundIndex + 1}
                                                </div>
                                                
                                                {/* Round content */}
                                                <div className="ml-6 flex-1">
                                                  <div className={`p-4 rounded-lg border ${colorScheme.bg} ${colorScheme.border}`}>
                                                    <div className="mb-3">
                                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorScheme.badge}`}>
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                        </svg>
                                                                                                                 Round {round.round_number || roundIndex + 1}
                                                         {roundIndex === 0 && ' - Initial'}
                                                         {ideaItem.reflection_rounds && roundIndex === ideaItem.reflection_rounds.length - 1 && roundIndex > 0 && ' - Final'}
                                                         {ideaItem.reflection_rounds && roundIndex > 0 && roundIndex < ideaItem.reflection_rounds.length - 1 && ' - Refined'}
                                                      </span>
                                                    </div>
                                                    <div className={`prose prose-sm max-w-none ${colorScheme.text}`}>
                                                      <p className="text-sm leading-relaxed m-0">
                                                        {round.idea || round.content || 'No content available'}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                      
                                      {/* Summary footer */}
                                      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                          <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="font-medium">Evolution Summary</span>
                                          </div>
                                          <span>{ideaItem.reflection_rounds.length} reflection round{ideaItem.reflection_rounds.length > 1 ? 's' : ''} completed</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Scores: Interestingness, Feasibility, Novelty */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                  {/* Interestingness */}
                                  <div className="bg-card dark:bg-card border border-border dark:border-border p-4 rounded-xl shadow-sm text-center">
                                    <p className="text-sm font-medium text-primary dark:text-primary mb-1">Interestingness</p>
                                    <p className="text-4xl font-bold text-foreground dark:text-foreground">
                                      {(ideaItem.interestingness || ideaItem.Interestingness || 0).toFixed(1)}
                                    </p>
                                  </div>
                                  {/* Feasibility */}
                                  <div className="bg-card dark:bg-card border border-border dark:border-border p-4 rounded-xl shadow-sm text-center">
                                    <p className="text-sm font-medium text-primary dark:text-primary mb-1">Feasibility</p>
                                    <p className="text-4xl font-bold text-foreground dark:text-foreground">
                                      {(ideaItem.feasibility?.score || ideaItem.Feasibility || 0).toFixed(1)}
                                    </p>
                                  </div>
                                  {/* Novelty */}
                                  <div className="bg-card dark:bg-card border border-border dark:border-border p-4 rounded-xl shadow-sm text-center">
                                    <p className="text-sm font-medium text-primary dark:text-primary mb-1">Novelty</p>
                                    <p className="text-4xl font-bold text-foreground dark:text-foreground">
                                      {(ideaItem.novelty?.score || ideaItem.Novelty || 0).toFixed(1)}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Description section */}
                                {ideaItem.description && (
                                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-6 bg-white dark:bg-gray-800/80 shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{ideaItem.description}</p>
                                  </div>
                                )}

                                {/* Experiment section */}
                                {(ideaItem.experiment || ideaItem.Experiment) && (
                                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-6 bg-white dark:bg-gray-800/80 shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Experiment Details</h4>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                      {ideaItem.experiment || ideaItem.Experiment}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Implementation Steps section */}
                                {ideaItem.implementation_steps && ideaItem.implementation_steps.length > 0 && (
                                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-6 bg-white dark:bg-gray-800/80 shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Implementation Steps</h4>
                                    <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                      {ideaItem.implementation_steps.map((step: string, stepIndex: number) => (
                                        <li key={stepIndex} className="leading-relaxed">{formatTextWithBoldPrefix(step)}</li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                                
                                {/* Expected Outcomes section */}
                                {ideaItem.expected_outcomes && ideaItem.expected_outcomes.length > 0 && (
                                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-6 bg-white dark:bg-gray-800/80 shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected Outcomes</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                      {ideaItem.expected_outcomes.map((outcome: string, outcomeIndex: number) => (
                                        <li key={outcomeIndex} className="leading-relaxed">{formatTextWithBoldPrefix(outcome)}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {/* Challenges and Mitigation Strategies */}
                                {(ideaItem.potential_challenges && ideaItem.potential_challenges.length > 0) || 
                                 (ideaItem.mitigation_strategies && ideaItem.mitigation_strategies.length > 0) ? (
                                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-6 bg-white dark:bg-gray-800/80 shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Challenges & Mitigation</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {ideaItem.potential_challenges && ideaItem.potential_challenges.length > 0 && (
                                        <div>
                                          <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Potential Challenges</h5>
                                          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                            {ideaItem.potential_challenges.map((challenge: string, challengeIndex: number) => (
                                              <li key={challengeIndex} className="leading-relaxed">{formatTextWithBoldPrefix(challenge)}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {ideaItem.mitigation_strategies && ideaItem.mitigation_strategies.length > 0 && (
                                        <div>
                                          <h5 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Mitigation Strategies</h5>
                                          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                            {ideaItem.mitigation_strategies.map((strategy: string, strategyIndex: number) => (
                                              <li key={strategyIndex} className="leading-relaxed">{formatTextWithBoldPrefix(strategy)}</li>
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
                                      <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 p-5 rounded-xl shadow-sm">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Scientific Merit</p>
                                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{(ideaItem.scientific_merit * 100).toFixed(0)}%</p>
                                      </div>
                                    )}
                                    {ideaItem.innovation_level !== undefined && (
                                      <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 p-5 rounded-xl shadow-sm">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Innovation Level</p>
                                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">{(ideaItem.innovation_level * 100).toFixed(0)}%</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Thought for this specific idea */}
                                {ideaItem.thought && (
                                  <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 mb-6 bg-white dark:bg-gray-800/80 shadow-sm">
                                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Developer&apos;s Thought</h4>
                                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed italic">{ideaItem.thought}</p>
                                  </div>
                                )}

                                {/* Determine which similar papers to use - individual idea or task level */}
                                {(() => {
                                  const similarPapers = ideaItem.similar_papers || idea.similar_papers || [];
                                  return similarPapers.length > 0 && (
                                    <>
                                      {/* Download PDF button */}
                                      <div className="mb-4 flex justify-end">
                                        <button
                                          onClick={handleDownloadPdf}
                                          className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                                        >
                                          <Download className="mr-2 h-5 w-5" />
                                          Download PDF
                                        </button>
                                      </div>

                                      {/* Literature Map Diagram */}
                                      <div className="mt-6">
                                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Literature Context Map</h4>
                                        <LitMapDiagram 
                                          currentIdea={ideaItem} 
                                          similarPapers={similarPapers} 
                                          className="mb-6"
                                        />
                                      </div>

                                      {/* Similar Papers Section for this idea */}
                                      <div className="mt-8">
                                        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Similar Research Papers for this Idea</h4>
                                        <div className="space-y-4">
                                          {similarPapers.map((paper: any, paperIndex: number) => (
                                            <div key={paperIndex} className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:border-blue-300 transition-all shadow-sm">
                                              {/* Header with source badge and title */}
                                              <div className="p-6">
                                                <div className="flex items-start gap-4">
                                                  {/* Fixed width source badge */}
                                                  <div className="flex-shrink-0 w-24">
                                                    {paper.source && (
                                                      <a 
                                                        href={getSourceHomepage(paper.source)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`inline-flex items-center justify-center w-full px-3 py-2 rounded-lg text-xs font-semibold hover:shadow-md transition-shadow ${getSourceBubbleClass(paper.source)}`}
                                                      >
                                                        {paper.source.replace(/_/g, ' ')}
                                                      </a>
                                                    )}
                                                  </div>
                                                  
                                                  {/* Content */}
                                                  <div className="flex-1 min-w-0">
                                                                                                         <h5 className="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500 transition-colors">
                                                       {(paper.url || paper.source_url) ? (
                                                         <a href={paper.url || paper.source_url} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                                                           {paper.title}
                                                         </a>
                                                       ) : (
                                                         <span className="block">{paper.title}</span>
                                                       )}
                                                     </h5>
                                                    
                                                    {/* Authors and metadata */}
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                                      {paper.authors && paper.authors.length > 0 && (
                                                        <span className="flex items-center">
                                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                          </svg>
                                                          {paper.authors.slice(0, 3).join(", ")}
                                                          {paper.authors.length > 3 && " et al."}
                                                        </span>
                                                      )}
                                                      {paper.year && (
                                                        <span className="flex items-center">
                                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                          </svg>
                                                          {paper.year}
                                                        </span>
                                                      )}
                                                      {paper.journal && (
                                                        <span className="flex items-center italic">
                                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                          </svg>
                                                          {paper.journal}
                                                        </span>
                                                      )}
                                                    </div>
                                                    
                                                    {/* Abstract */}
                                                    {paper.abstract && (
                                                      <div className="mt-3">
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                                          {paper.abstract}
                                                        </p>
                                                      </div>
                                                    )}
                                                    
                                                    {/* Metrics */}
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                      {paper.semantic_similarity && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                          </svg>
                                                          {(paper.semantic_similarity * 100).toFixed(1)}% similar
                                                        </span>
                                                      )}
                                                      {paper.citations !== undefined && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                          </svg>
                                                          {paper.citations} citations
                                                        </span>
                                                      )}
                                                    </div>
                                                    
                                                    {/* Keywords */}
                                                    {paper.keywords && paper.keywords.length > 0 && (
                                                      <div className="mt-3">
                                                        <div className="flex flex-wrap gap-1">
                                                          {paper.keywords.slice(0, 5).map((keyword: string, kidx: number) => (
                                                            <span key={kidx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                              #{keyword.replace(/_/g, ' ')}
                                                            </span>
                                                          ))}
                                                          {paper.keywords.length > 5 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400">
                                                              +{paper.keywords.length - 5} more
                                                            </span>
                                                          )}
                                                        </div>
                                                      </div>
                                                    )}
                                                    
                                                    {/* Action links */}
                                                    <div className="mt-4 flex gap-4">
                                                      {paper.pdf_url && (
                                                        <a 
                                                          href={paper.pdf_url} 
                                                          target="_blank" 
                                                          rel="noopener noreferrer"
                                                          className="inline-flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                                        >
                                                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                                          </svg>
                                                          Download PDF
                                                        </a>
                                                      )}
                                                      {paper.doi && (
                                                        <a 
                                                          href={`https://doi.org/${paper.doi}`} 
                                                          target="_blank" 
                                                          rel="noopener noreferrer"
                                                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                                        >
                                                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                                          </svg>
                                                          DOI: {paper.doi}
                                                        </a>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            )}

                            {/* Feedback Section */}
                            <div className="mt-6">
                              <div 
                                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => toggleFeedbackExpand(index)}
                              >
                                <div className="flex justify-between items-center">
                                  <h5 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                                    {feedbackState[index] ? 'Edit Feedback' : 'Provide Feedback'}
                                  </h5>
                                  {feedbackExpanded[index] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                </div>
                              </div>

                              {feedbackExpanded[index] && (
                                <div className="mt-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                  <div className="max-w-md mx-auto">
                                    {['overall', 'novelty', 'feasibility'].map((aspect) => {
                                      const aspectKey = aspect as keyof IdeaFeedback;
                                      const feedbackValue = feedbackState[index]?.[aspectKey]?.score || 0;
                                      const feedbackText = feedbackState[index]?.[aspectKey]?.text || '';
                                      
                                      return (
                                        <div key={aspect} className="mb-6">
                                          <div className="flex justify-between items-center mb-2">
                                            <label className="font-medium text-gray-800 dark:text-gray-200 capitalize">{aspect}</label>
                                            <span className="text-lg font-bold text-center text-primary">
                                              {feedbackValue.toFixed(1)} / 5
                                            </span>
                                          </div>
                                          <Slider
                                            value={[feedbackValue]}
                                            onValueChange={(value) => handleRatingChange(index, aspectKey, value[0])}
                                            max={5}
                                            step={0.5}
                                          />
                                          <Textarea
                                            value={feedbackText}
                                            onChange={(e) => handleCommentChange(index, aspectKey, e.target.value)}
                                            placeholder={`Tell us more about the ${aspect}...`}
                                            className="mt-3 bg-gray-50 dark:bg-gray-700/50"
                                          />
                                        </div>
                                      );
                                    })}
                                    <Button
                                      onClick={() => handleFeedbackSubmit(index)}
                                      disabled={submittingFeedback[index]}
                                      className="w-full"
                                    >
                                      {submittingFeedback[index] ? 'Submitting...' : 'Submit Feedback'}
                                    </Button>
                                    {feedbackSuccess[index] && (
                                      <p className="mt-2 text-sm text-center text-green-600 dark:text-green-400">Feedback submitted successfully!</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No ideas found for this task.</p>
                        {idea.status === "processing" && (
                          <div className="mt-4 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            <span>Ideas are being generated...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {idea.error && (
                    <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h2 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Error</h2>
                      <p className="text-red-700 dark:text-red-400">{idea.error}</p>
                    </div>
                  )}

                  {/* Global Similar Papers Section - only show if not already shown in individual ideas */}
                  {idea.similar_papers && idea.similar_papers.length > 0 && 
                   (!idea.ideas || idea.ideas.length === 0 || !idea.ideas.some((ideaItem: any) => ideaItem.similar_papers && ideaItem.similar_papers.length > 0)) && (
                    <div className="mt-8">
                      <h2 className="text-lg font-medium text-card-foreground mb-4">Similar Research Papers (Task Level)</h2>
                      <div className="space-y-4">
                        {idea.similar_papers.map((paper: any, index: number) => (
                          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden hover:border-blue-300 transition-all shadow-sm">
                            <div className="p-6">
                              <div className="flex items-start gap-4">
                                {/* Fixed width source badge */}
                                <div className="flex-shrink-0 w-24">
                                  {paper.source && (
                                    <a 
                                      href={getSourceHomepage(paper.source)} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={`inline-flex items-center justify-center w-full px-3 py-2 rounded-lg text-xs font-semibold hover:shadow-md transition-shadow ${getSourceBubbleClass(paper.source)}`}
                                    >
                                      {paper.source.replace(/_/g, ' ')}
                                    </a>
                                  )}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                                                     <h3 className="font-semibold text-foreground hover:text-blue-500 transition-colors">
                                     {(paper.url || paper.source_url) ? (
                                       <a href={paper.url || paper.source_url} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                                         {paper.title}
                                       </a>
                                     ) : (
                                       <span className="block">{paper.title}</span>
                                     )}
                                   </h3>
                                  
                                  {/* Authors and metadata */}
                                  <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                    {paper.authors.length > 0 && (
                                      <span className="flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        {paper.authors.slice(0, 3).join(", ")}
                                        {paper.authors.length > 3 && " et al."}
                                      </span>
                                    )}
                                    {paper.year && (
                                      <span className="flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        {paper.year}
                                      </span>
                                    )}
                                    {paper.journal && (
                                      <span className="flex items-center italic">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                        {paper.journal}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Abstract */}
                                  {paper.abstract && (
                                    <div className="mt-3">
                                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {paper.abstract}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Metrics */}
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {paper.semantic_similarity && (
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {(paper.semantic_similarity * 100).toFixed(1)}% similar
                                      </span>
                                    )}
                                    {paper.citations !== undefined && (
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {paper.citations} citations
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Keywords */}
                                  {paper.keywords && paper.keywords.length > 0 && (
                                    <div className="mt-3">
                                      <div className="flex flex-wrap gap-1">
                                        {paper.keywords.slice(0, 5).map((keyword: string, kidx: number) => (
                                          <span key={kidx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                            #{keyword.replace(/_/g, ' ')}
                                          </span>
                                        ))}
                                        {paper.keywords.length > 5 && (
                                          <span className="inline-flex items-center px-2 py-1 rounded text-xs text-gray-500 dark:text-gray-400">
                                            +{paper.keywords.length - 5} more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Action links */}
                                  <div className="mt-4 flex gap-4">
                                    {paper.pdf_url && (
                                      <a 
                                        href={paper.pdf_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                        </svg>
                                        Download PDF
                                      </a>
                                    )}
                                    {paper.doi && (
                                      <a 
                                        href={`https://doi.org/${paper.doi}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                        </svg>
                                        DOI: {paper.doi}
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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