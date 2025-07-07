import { Calendar, FileText, Code, BookOpen, Star, Users, Clock, Sparkles, LineChart, Award, Flame, Zap, ArrowRight, Brain, Share2 } from "lucide-react"
import type { UserData } from "@/types/user"

interface UserProfileProps {
  userData: UserData | null
}

export default function UserProfile({ userData }: UserProfileProps) {
  // If no user data is provided, return a message
  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto pt-8 pb-24 px-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 mb-6 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // Get user information or use defaults if not available
  const userInfo = userData?.personalInformation[0]
  const userName = userInfo?.name || "Researcher"
  const userInitial = userName.charAt(0)
  const joinDate = userInfo?.joinDate
    ? new Date(userInfo.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently joined"
  const researchIdeas = userData?.researchIdeas || []

  // Calculate metrics
  const totalIdeas = researchIdeas.length
  const papersCount = researchIdeas.filter(idea => idea.paper).length
  const codeProjectsCount = researchIdeas.filter(idea => idea.code && idea.code.length > 0).length
  
  // Count unique collaborators across all ideas
  const collaboratorsSet = new Set()
  researchIdeas.forEach(idea => {
    if (idea.collaborators && Array.isArray(idea.collaborators)) {
      idea.collaborators.forEach(collaborator => {
        if (collaborator) collaboratorsSet.add(collaborator)
      })
    }
  })
  const collaboratorsCount = collaboratorsSet.size
  
  const avgNovelty = researchIdeas.length > 0 
    ? researchIdeas.reduce((sum, idea) => sum + (idea.novelty || 0), 0) / researchIdeas.length 
    : 0
  const avgInterestingness = researchIdeas.length > 0
    ? researchIdeas.reduce((sum, idea) => sum + (idea.interestingness || 0), 0) / researchIdeas.length
    : 0

  // Get unique categories from research ideas
  const uniqueCategories = Array.from(new Set(researchIdeas.map(idea => idea.category).filter(Boolean)))

  return (
    <div className="relative">
      {/* Background grid with gradient overlay - matching landing page */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,#0c2144,transparent)]"></div>
      </div>

      <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 relative z-10">
        {/* Hero section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-slate-500 dark:from-blue-400 dark:to-slate-400">Research Portfolio</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Track your ideas, monitor progress, and manage your research journey</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 mb-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-blue-400/10 to-slate-400/10 blur-xl rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-gradient-to-br from-blue-400/10 to-slate-400/10 blur-xl rounded-full"></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div className="h-28 w-28 bg-gradient-to-br from-blue-500 to-slate-600 dark:from-blue-600 dark:to-slate-700 rounded-full flex items-center justify-center text-white text-4xl mb-4 shadow-lg border-2 border-white dark:border-gray-700">
                  {userInitial}
                </div>
                <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{userName}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-2">{userInfo?.email || "researcher@example.com"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {userInfo?.role || "Researcher"}
                </p>
                
                <div className="w-full border-t border-gray-200 dark:border-gray-700 my-6"></div>
                
                <div className="w-full">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member since
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{joinDate}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Research fields
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{uniqueCategories.length || "0"}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ideas generated
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{researchIdeas.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Interests */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute -bottom-16 -right-8 w-32 h-32 bg-gradient-to-br from-slate-400/10 to-blue-400/10 blur-xl rounded-full"></div>
              
              <h3 className="font-medium mb-4 text-gray-900 dark:text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Research Interests
              </h3>
              
              <div className="flex flex-wrap gap-2 relative z-10">
                {uniqueCategories.length > 0 ? (
                  uniqueCategories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-full text-sm text-blue-700 dark:text-blue-300">
                      {category}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-3 py-1 bg-gray-100/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-500 dark:text-gray-400">
                      No research interests yet
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Research Metrics */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute -top-16 -left-8 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-slate-400/10 blur-xl rounded-full"></div>
              
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <LineChart className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                Research Metrics
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-5 rounded-lg border border-blue-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2">
                    <Sparkles className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">{totalIdeas}</div>
                  <div className="text-sm text-center text-blue-600 dark:text-blue-400">Total Ideas</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-5 rounded-lg border border-blue-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2">
                    <FileText className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">{papersCount}</div>
                  <div className="text-sm text-center text-blue-600 dark:text-blue-400">Research Papers</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-5 rounded-lg border border-blue-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2">
                    <Code className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">{codeProjectsCount}</div>
                  <div className="text-sm text-center text-blue-600 dark:text-blue-400">Code Projects</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-5 rounded-lg border border-blue-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2">
                    <Users className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">{collaboratorsCount || "0"}</div>
                  <div className="text-sm text-center text-blue-600 dark:text-blue-400">Collaborations</div>
                </div>
              </div>
              
              {/* Performance Indicators */}
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 border border-blue-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <Award className="w-4 h-4 mr-1" /> Novelty Score
                    </span>
                    <span className="text-sm text-blue-500 dark:text-blue-400">{avgNovelty.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-slate-700/30 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-slate-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(avgNovelty * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 border border-blue-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <Flame className="w-4 h-4 mr-1" /> Interest Score
                    </span>
                    <span className="text-sm text-blue-500 dark:text-blue-400">{avgInterestingness.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-slate-700/30 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-slate-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(avgInterestingness * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Research Ideas */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                  Recent Research Ideas
                </span>
              </h2>

              {researchIdeas.length > 0 ? (
                <div className="space-y-4">
                  {researchIdeas.slice(0, 5).map((idea) => (
                    <div key={idea.id} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-900/10 border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">{idea.title}</h3>
                        {idea.category && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                            {idea.category}
                          </span>
                        )}
                      </div>
                      {idea.experiment && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{idea.experiment}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs">
                          {idea.novelty > 0 && (
                            <span className="flex items-center text-blue-600 dark:text-blue-400">
                              <Zap className="w-3 h-3 mr-1" /> Novelty: {idea.novelty.toFixed(1)}
                            </span>
                          )}
                          {idea.date && (
                            <span className="text-gray-500 dark:text-gray-400">{idea.date}</span>
                          )}
                        </div>
                        {(idea.paper || (idea.code && idea.code.length > 0)) && (
                          <div className="flex items-center space-x-2">
                            {idea.paper && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                <FileText className="w-3 h-3 inline" /> Paper
                              </span>
                            )}
                            {idea.code && idea.code.length > 0 && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                <Code className="w-3 h-3 inline" /> Code
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                  <Sparkles className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No research ideas yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Generate some ideas to start building your portfolio</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

