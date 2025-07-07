"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import UserProfile from "@/components/user-profile"
import type { UserData } from "@/types/user"
import { useAuth } from "@/context/AuthContext"
import { getUserIdeas } from "@/services/idea-service"

export default function UserProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        // Get actual user ideas from the API
        const userIdeasResponse = await getUserIdeas({ 
          limit: 50, 
          sort_by: 'created_at', 
          sort_order: -1 
        });
        
        // Log the response to inspect structure
        console.log('User ideas API response:', userIdeasResponse);
        
        if (userIdeasResponse && userIdeasResponse.length > 0) {
          // Log the first item's structure
          console.log('Sample idea structure:', userIdeasResponse[0]);
          
          // If there are ideas in the first item, log their structure too
          if (userIdeasResponse[0].ideas && userIdeasResponse[0].ideas.length > 0) {
            console.log('Sample idea content:', userIdeasResponse[0].ideas[0]);
          }
        }
        
        // Transform the ideas data into the expected format
        const researchIdeas = Array.isArray(userIdeasResponse) ? userIdeasResponse
          .filter(task => task && task.status === 'completed')
          .map((task, index) => {
            const firstIdea = Array.isArray(task.ideas) && task.ideas.length > 0 ? task.ideas[0] : {};
            const category = (Array.isArray(task.tags) && task.tags.length > 0) 
              ? task.tags[0] 
              : (firstIdea?.category || 'Research');
            
            // Ensure all values are actual numbers from API rather than calculated
            let noveltyScore = 0;
            if (typeof firstIdea?.novelty === 'number') {
              noveltyScore = firstIdea.novelty;
            } else if (typeof firstIdea?.novelty === 'object' && typeof firstIdea?.novelty?.score === 'number') {
              noveltyScore = firstIdea.novelty.score;
            } else if (typeof firstIdea?.score === 'number') {
              noveltyScore = firstIdea.score;
            }
            
            let interestScore = 0;
            if (typeof firstIdea?.interestingness === 'number') {
              interestScore = firstIdea.interestingness;
            } else if (typeof firstIdea?.interest === 'object' && typeof firstIdea?.interest?.score === 'number') {
              interestScore = firstIdea.interest.score;
            } else if (typeof firstIdea?.interestScore === 'number') {
              interestScore = firstIdea.interestScore;
            }
            
            let feasibilityScore = 0;
            if (typeof firstIdea?.feasibility === 'number') {
              feasibilityScore = firstIdea.feasibility;
            } else if (typeof firstIdea?.feasibility === 'object' && typeof firstIdea?.feasibility?.score === 'number') {
              feasibilityScore = firstIdea.feasibility.score;
            }
            
            // Determine if there's actual paper content
            const hasPaper = !!task.paper || !!firstIdea.paper || !!firstIdea.paperUrl || !!firstIdea.paperLink;
            
            // Determine if there's actual code content
            const hasCode = !!task.code || 
                           (Array.isArray(firstIdea.code) && firstIdea.code.length > 0) || 
                           !!firstIdea.codeUrl || !!firstIdea.codeRepo || !!firstIdea.implementation;
            
            // Extract collaborator information if available
            const collaborators = task.collaborators || firstIdea.collaborators || [];
            
            return {
              id: task._id || index,
              name: user?.username || 'Researcher',
              title: task.task_description || `Research Idea ${index + 1}`,
              experiment: firstIdea?.description || firstIdea?.experiment || `Contains ${task.ideas?.length || 0} generated ideas.`,
              interestingness: interestScore,
              feasibility: feasibilityScore,
              novelty: noveltyScore,
              novel: noveltyScore > 5,
              code: hasCode ? [task.code || 'code.py'] : [],
              paper: hasPaper ? (task.paper || '/paper.pdf') : '',
              category: category,
              date: task.created_at ? formatDistanceToNow(new Date(task.created_at)) : 'Recently',
              collaborators: Array.isArray(collaborators) ? collaborators : []
            };
          }) : [];
        
        // Create user data object with real user information and ideas
        if (user) {
          const userData: UserData = {
            personalInformation: [
              {
                id: user.id || '1',
                name: user.full_name || user.username || user.email || 'Researcher',
                email: user.email,
                role: "Researcher",
                institution: user.institution || "Research Institution",
                joinDate: user.created_at || new Date().toISOString(),
              },
            ],
            researchIdeas: researchIdeas
          }
          setUserData(userData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, user, router])

  // Format relative time from date
  const formatDistanceToNow = (date: Date): string => {
    if (!date) return '';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    
    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  // Get user information
  const userName = user?.full_name || user?.username || user?.email || "Guest"
  const userInitial = userName.charAt(0)

  // Only render this page if we're actually on the userprofile route
  if (pathname !== "/userprofile") {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userInitial={userInitial}
        activeView="profile"
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
        <main className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-600">Loading user profile...</p>
            </div>
          ) : (
            <UserProfile userData={userData} />
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

