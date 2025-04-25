import { Calendar, FileText, Code, BookOpen, Star, Users, Clock } from "lucide-react"
import type { UserData } from "@/types/user"

interface UserProfileProps {
  userData: UserData | null
}

export default function UserProfile({ userData }: UserProfileProps) {
  // If no user data is provided, return a message
  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 text-center">
          <p className="text-lg text-gray-600">Please log in to view your profile.</p>
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

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl mb-4">
                {userInitial}
              </div>
              <h2 className="text-xl font-bold mb-1">{userName}</h2>
              <p className="text-gray-500 mb-4">{userInfo?.email || "researcher@example.com"}</p>
              <div className="w-full border-t border-gray-200 my-4"></div>
              <div className="w-full">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">{joinDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Research fields</span>
                  <span className="font-medium">{new Set(researchIdeas.map((idea) => idea.category)).size}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Ideas generated</span>
                  <span className="font-medium">{researchIdeas.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="font-medium mb-4">Research Interests</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(researchIdeas.map((idea) => idea.category))).map((category, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {category || "Research"}
                </span>
              ))}
              {researchIdeas.length === 0 && (
                <>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Machine Learning</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Quantum Computing</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Bioinformatics</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Research Activity</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{researchIdeas.filter((idea) => idea.paper).length}</div>
                <div className="text-sm text-gray-500">Papers</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Code className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">
                  {researchIdeas.filter((idea) => idea.code && idea.code.length > 0).length}
                </div>
                <div className="text-sm text-gray-500">Code Projects</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">{researchIdeas.length}</div>
                <div className="text-sm text-gray-500">Ideas</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{Math.min(5, Math.ceil(researchIdeas.length / 2))}</div>
                <div className="text-sm text-gray-500">Collaborations</div>
              </div>
            </div>

            <h3 className="font-medium mb-3">Recent Activity</h3>
            <div className="space-y-4">
              {researchIdeas.slice(0, 3).map((idea, index) => (
                <div key={index} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  {index === 0 ? (
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  ) : index === 1 ? (
                    <Code className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  )}
                  <div>
                    <div className="font-medium">
                      {index === 0
                        ? `Generated research idea: ${idea.title}`
                        : index === 1
                          ? `Created code for ${idea.title}`
                          : `Drafted research paper for ${idea.title}`}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" /> {idea.date || "Recently"}
                    </div>
                  </div>
                </div>
              ))}

              {researchIdeas.length === 0 && (
                <div className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">No recent activity</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1" /> Now
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Saved Research Ideas</h2>

            <div className="space-y-4">
              {researchIdeas.slice(0, 3).map((idea, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium mb-1">{idea.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{idea.experiment}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    <span>{Math.floor(Math.random() * 15) + 1} related papers</span>
                  </div>
                </div>
              ))}

              {researchIdeas.length === 0 && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium mb-1">No saved research ideas</h3>
                  <p className="text-sm text-gray-600">Start exploring ideas to see them here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

