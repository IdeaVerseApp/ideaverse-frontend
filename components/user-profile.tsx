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
    : "March 2024"
  const researchIdeas = userData?.researchIdeas || []

  // Calculate metrics
  const totalIdeas = researchIdeas.length
  const avgNovelty = researchIdeas.length > 0 
    ? researchIdeas.reduce((sum, idea) => sum + idea.novelty, 0) / researchIdeas.length 
    : 0
  const avgInterestingness = researchIdeas.length > 0
    ? researchIdeas.reduce((sum, idea) => sum + idea.interestingness, 0) / researchIdeas.length
    : 0

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
                    <span className="font-medium text-gray-900 dark:text-white">{new Set(researchIdeas.map((idea) => idea.category)).size || "0"}</span>
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
                {Array.from(new Set(researchIdeas.map((idea) => idea.category))).map((category, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-full text-sm text-blue-700 dark:text-blue-300">
                    {category || "Research"}
                  </span>
                ))}
                {researchIdeas.length === 0 && (
                  <>
                    <span className="px-3 py-1 bg-blue-100/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-full text-sm text-blue-700 dark:text-blue-300">Machine Learning</span>
                    <span className="px-3 py-1 bg-blue-100/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-full text-sm text-blue-700 dark:text-blue-300">Quantum Computing</span>
                    <span className="px-3 py-1 bg-blue-100/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-full text-sm text-blue-700 dark:text-blue-300">Bioinformatics</span>
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
                  <div className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">{researchIdeas.filter((idea) => idea.paper).length}</div>
                  <div className="text-sm text-center text-blue-600 dark:text-blue-400">Research Papers</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-5 rounded-lg border border-blue-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2">
                    <Code className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">
                    {researchIdeas.filter((idea) => idea.code && idea.code.length > 0).length}
                  </div>
                  <div className="text-sm text-center text-blue-600 dark:text-blue-400">Code Projects</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-5 rounded-lg border border-blue-100 dark:border-slate-800">
                  <div className="flex justify-center mb-2">
                    <Users className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">{Math.min(5, Math.ceil(researchIdeas.length / 2)) || "0"}</div>
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
                      style={{ width: `${avgNovelty * 10}%` }}
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
                      style={{ width: `${avgInterestingness * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute -bottom-16 -right-8 w-40 h-40 bg-gradient-to-br from-slate-400/10 to-blue-400/10 blur-xl rounded-full"></div>
              
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                Recent Activity
              </h2>

              <div className="space-y-4 relative z-10">
                {researchIdeas.slice(0, 4).map((idea, index) => (
                  <div key={index} className="p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow group">
                    <div className="flex items-start gap-3">
                      {index % 2 === 0 ? (
                        <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                      ) : (
                        <Code className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {index === 0
                            ? `Generated research idea: ${idea.title}`
                            : index === 1
                              ? `Created code for ${idea.title}`
                              : index === 2
                                ? `Drafted research paper for ${idea.title}`
                                : `Shared ${idea.title} with collaborators`}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" /> {idea.date || "Recently"}
                        </div>
                      </div>
                      <button className="text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {researchIdeas.length === 0 && (
                  <div className="p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">No recent activity</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1" /> Now
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top Research Ideas */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div className="absolute -top-16 -left-8 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-slate-400/10 blur-xl rounded-full"></div>
              
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                <Star className="w-6 h-6 mr-2 text-blue-500 dark:text-blue-400" />
                Top Research Ideas
              </h2>

              <div className="space-y-5 relative z-10">
                {researchIdeas.slice(0, 3).map((idea, index) => (
                  <div key={index} className="p-5 bg-gradient-to-r from-white/90 to-white/60 dark:from-gray-700/90 dark:to-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow group">
                    <div className="flex items-start gap-3">
                      <div className="min-w-[3rem] h-12 rounded-md flex items-center justify-center bg-gradient-to-br from-blue-500 to-slate-600 text-white font-bold text-lg">
                        {(idea.novelty + idea.interestingness) / 2 > 7 ? "A+" : 
                          (idea.novelty + idea.interestingness) / 2 > 5 ? "A" : "B+"}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-1">{idea.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{idea.experiment}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center text-blue-600 dark:text-blue-400">
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            <span>Novelty: {idea.novelty.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center text-slate-600 dark:text-slate-400">
                            <Flame className="h-3.5 w-3.5 mr-1" />
                            <span>Interest: {idea.interestingness.toFixed(1)}</span>
                          </div>
                          {idea.category && (
                            <div className="flex items-center text-blue-600 dark:text-blue-400">
                              <BookOpen className="h-3.5 w-3.5 mr-1" />
                              <span>{idea.category}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button className="text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {researchIdeas.length === 0 && (
                  <div className="p-5 bg-gradient-to-r from-white/90 to-white/60 dark:from-gray-700/90 dark:to-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">No saved research ideas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Start exploring ideas to see them here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

