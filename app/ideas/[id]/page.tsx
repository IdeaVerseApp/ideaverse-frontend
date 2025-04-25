"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import type { UserData } from "@/types/user"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"
import React from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

// Corrected API URL based on backend logs
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface IdeaDetail {
  _id: string          // MongoDB ObjectId
  task_id: string      // UUID for task
  user_id: string
  task_description: string
  status: string
  ideas: any[]         // Updated from string[] to any[] to support object ideas
  thought: string
  reflection_rounds: number
  error?: string
}

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params at component level
  const id = params?.id;

  const router = useRouter()
  const { token, isAuthenticated, loading: authLoading, refreshAuthState } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [idea, setIdea] = useState<IdeaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Mock data for now
        const mockData: UserData = {
          personalInformation: [
            {
              id: 1,
              name: "Researcher Smith",
              email: "researcher@example.com",
              role: "Principal Investigator",
              institution: "University Research Lab",
              joinDate: "2023-01-15",
            },
          ],
          researchIdeas: [],
        }

        setUserData(mockData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

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

  // Update the debug section to use id instead of ideaId
  useEffect(() => {
    if (id) {
      console.log("Debug - Current idea ID:", id);
      console.log("Debug - API URL:", API_URL);
      console.log("Debug - Full API endpoint:", `${API_URL}/ideas/${id}`);
    }
  }, [id]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          userName={userName}
          userInitial={userInitial}
          activeView="ideas"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}
        >
          {/* Navbar */}
          <Navbar
            userName={userName}
            userInitial={userInitial}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Content */}
          <div className="flex-1 container mx-auto px-4 py-6">
            <button 
              onClick={handleBackClick}
              className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Ideas</span>
            </button>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-muted-foreground">Loading idea details...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Error</h3>
                <p>{error}</p>
                <button 
                  onClick={handleBackClick} 
                  className="mt-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-4 py-2 rounded-md hover:bg-red-200 dark:hover:bg-red-800/30"
                >
                  Back to Ideas
                </button>
              </div>
            ) : idea ? (
              <div className="bg-card dark:bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">Research Idea</h1>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${idea.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
                      idea.status === "PENDING" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" : 
                      idea.status === "PROCESSING" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
                    {idea.status}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-medium text-card-foreground mb-2">Description</h2>
                  <p className="text-muted-foreground">{idea.task_description}</p>
                </div>

                {idea.thought && (
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-card-foreground mb-2">Thought Process</h2>
                    <div className="bg-card p-4 rounded-lg">
                      <p className="text-muted-foreground">{idea.thought}</p>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h2 className="text-lg font-medium text-card-foreground mb-2">Generated Ideas</h2>
                  {idea.ideas && idea.ideas.length > 0 ? (
                    <div className="space-y-6">
                      {idea.ideas.map((ideaItem, index) => (
                        <div key={index} className="bg-card dark:bg-card border border-border rounded-xl shadow-sm p-6 hover:border-blue-300 transition-all">
                          <div className="flex flex-col">
                            <div className="flex items-center mb-4">
                              <div className="bg-blue-500 text-white h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                {index + 1}
                              </div>
                              <h3 className="text-xl font-bold text-foreground">
                                {typeof ideaItem === 'string' 
                                  ? `Research Idea ${index + 1}` 
                                  : (ideaItem.Title || ideaItem.Name || `Research Idea ${index + 1}`)}
                              </h3>
                            </div>
                            
                            {typeof ideaItem !== 'string' && (
                              <>
                                {/* Scores grid similar to ideaexploration */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                                  {ideaItem.Interestingness !== undefined && (
                                    <div className="flex flex-col items-center p-3 border border-border rounded-lg">
                                      <div className="text-sm text-muted-foreground mb-1">Interestingness</div>
                                      <div className="text-2xl font-bold text-blue-500">{ideaItem.Interestingness}</div>
                                    </div>
                                  )}
                                  {ideaItem.Feasibility !== undefined && (
                                    <div className="flex flex-col items-center p-3 border border-border rounded-lg">
                                      <div className="text-sm text-muted-foreground mb-1">Feasibility</div>
                                      <div className="text-2xl font-bold text-green-500">{ideaItem.Feasibility}</div>
                                    </div>
                                  )}
                                  {ideaItem.Novelty !== undefined && (
                                    <div className="flex flex-col items-center p-3 border border-border rounded-lg">
                                      <div className="text-sm text-muted-foreground mb-1">Novelty</div>
                                      <div className="text-2xl font-bold text-purple-500">{ideaItem.Novelty}</div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Experiment details */}
                                {ideaItem.Experiment && (
                                  <div className="mb-4 mt-2">
                                    <h4 className="text-md font-semibold mb-2 text-card-foreground">Experiment Details</h4>
                                    <div className="bg-card p-4 rounded-lg">
                                      <p className="text-muted-foreground">{ideaItem.Experiment}</p>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            
                            {/* For string-based ideas */}
                            {typeof ideaItem === 'string' && (
                              <div className="bg-card p-4 rounded-lg mt-2">
                                <p className="text-muted-foreground">{ideaItem}</p>
                              </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              <button className="flex items-center px-3 py-1.5 border border-border rounded-md hover:bg-card text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Save</span>
                              </button>
                              <button className="flex items-center px-3 py-1.5 border border-border rounded-md hover:bg-card text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                <span>Share</span>
                              </button>
                              <button className="flex items-center px-3 py-1.5 border border-border rounded-md hover:bg-card text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Research</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : idea.status === "PENDING" || idea.status === "PROCESSING" ? (
                    <div className="flex items-center justify-center p-12 bg-card rounded-lg">
                      <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-4"></div>
                      <p className="text-lg text-muted-foreground">Generating research ideas...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-card rounded-lg">
                      <p className="text-lg text-muted-foreground mb-4">No ideas generated yet.</p>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Generate Ideas
                      </button>
                    </div>
                  )}
                </div>

                {idea.error && (
                  <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Error</h2>
                    <p className="text-red-700 dark:text-red-400">{idea.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card dark:bg-card border border-border rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">Idea not found</h3>
                <p className="text-muted-foreground mb-4">The requested idea could not be found.</p>
                <button 
                  onClick={handleBackClick} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Back to Ideas
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  );
} 