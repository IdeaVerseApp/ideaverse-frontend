'use client';

import { useState, useEffect } from 'react';
import { generateIdeas } from '@/services/idea-service';
import { Sparkle, Loader2, ExternalLink, Bookmark, Lightbulb, AlertCircle, Brain, ChevronRight, Zap, LineChart, BarChart, Beaker, FlaskConical, FileText, Code } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Sample mock data for testing
const MOCK_IDEAS = [
  {
    title: "Neural Network Optimization for Low-Resource Environments",
    description: "Research how to optimize neural networks to run efficiently on devices with limited computational resources, such as IoT devices or old smartphones.",
    score: 8.7,
    category: "Machine Learning",
    novelty: 0.87,
    feasibility: 0.76
  },
  {
    title: "Explainable AI for Medical Diagnoses",
    description: "Develop machine learning models that not only predict medical conditions but provide clear explanations for their diagnoses that medical professionals can understand and verify.",
    score: 9.2,
    category: "Healthcare AI",
    novelty: 0.92,
    feasibility: 0.81
  },
  {
    title: "Sustainable Computing Framework",
    description: "Create a framework to measure and optimize the environmental impact of computation, including energy usage, carbon footprint, and hardware lifecycle considerations.",
    score: 8.5,
    category: "Green Computing",
    novelty: 0.85,
    feasibility: 0.79
  }
];

// Animation variants for elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [numIdeas, setNumIdeas] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const [useMockData, setUseMockData] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentGenerations, setRecentGenerations] = useState(0);

  useEffect(() => {
    // Update counter when ideas are generated
    if (ideas.length > 0) {
      setRecentGenerations(prev => prev + 1);
    }
  }, [ideas]);

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    if (useMockData) {
      // Use mock data instead of API call
      setTimeout(() => {
        // Generate a random subset of ideas based on numIdeas
        const mockIdeasSubset = [...MOCK_IDEAS];
        // Add more dynamic mock ideas based on the prompt
        if (numIdeas > mockIdeasSubset.length) {
          for (let i = mockIdeasSubset.length; i < numIdeas; i++) {
            const noveltyScore = Math.round((7 + Math.random() * 3) * 10) / 100;
            const feasibilityScore = Math.round((6 + Math.random() * 4) * 10) / 100;
            
            mockIdeasSubset.push({
              title: `${prompt} Research Direction ${i+1}`,
              description: `This research direction explores ${prompt.toLowerCase()} with a focus on innovative approaches and methodologies.`,
              score: Math.round((7 + Math.random() * 3) * 10) / 10,
              category: ["AI", "Machine Learning", "Data Science", "Healthcare", "Quantum Computing"][Math.floor(Math.random() * 5)],
              novelty: noveltyScore,
              feasibility: feasibilityScore
            });
          }
        }
        setIdeas(mockIdeasSubset.slice(0, numIdeas));
        setLoading(false);
      }, 1500); // Simulate API delay
      return;
    }
    
    try {
      const response = await generateIdeas({
        task_description: prompt,
        code: "",
        num_ideas: numIdeas,
        num_reflections: 2
      });
      
      console.log("API Response:", response);
      
      if (response && response.ideas && Array.isArray(response.ideas)) {
        setIdeas(response.ideas);
      } else {
        console.error("Unexpected API response format:", response);
        setErrorMessage('Received an unexpected response from the server. Try using the test data option.');
        setIdeas([]); // Reset ideas if format is wrong
      }
    } catch (error) {
      console.error('Failed to generate ideas:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate ideas';
      setErrorMessage(`${errorMsg}. Try enabling the test data option below.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = activeCategory === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.category?.toLowerCase() === activeCategory.toLowerCase());

  const categories = ['all', ...new Set(ideas.map(idea => idea.category).filter(Boolean))];

  return (
    <MainLayout activeView="dashboard">
      <div className="space-y-8">
        {/* Hero dashboard section */}
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-blue-800 opacity-20"></div>
            <div className="absolute inset-0 bg-grid-white/[0.2]"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/30 filter blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/30 filter blur-3xl"></div>
          </div>
          
          <div className="relative px-8 py-12 sm:px-12 text-white z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl font-bold mb-2">Welcome to IdeaVerse</h1>
                <p className="text-blue-100">Generate breakthrough research ideas with AI</p>
                
                <div className="mt-6 flex items-center text-sm">
                  <div className="flex items-center mr-6">
                    <Zap className="h-4 w-4 mr-2" />
                    <span>{recentGenerations} Recent Generations</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    <span>{ideas.length} Ideas Created</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 w-full md:w-auto">
                <div className="text-sm opacity-90 mb-2">Your Research Credits</div>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-3">250</div>
                  <div className="bg-green-500/20 text-green-300 text-xs py-1 px-2 rounded-full">
                    +50 this month
                  </div>
                </div>
                <div className="mt-2 text-xs text-blue-100">
                  <button className="underline">Upgrade for more</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Idea Generator Card */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-1"
          >
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between mb-5"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Generate Ideas</h2>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-[6px]"></div>
                <Sparkle className="h-5 w-5 text-blue-500 dark:text-blue-400 relative" />
              </div>
            </motion.div>
            
            <form onSubmit={handleGenerateIdeas} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What are you exploring?
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your research interest or problem you're trying to solve..."
                  disabled={loading}
                />
              </motion.div>
              
              {/* Number of ideas slider */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="dashboard-numIdeas" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of ideas
                  </label>
                  <div className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                    {numIdeas}
                  </div>
                </div>
                <input
                  type="range"
                  id="dashboard-numIdeas"
                  min="1"
                  max="10"
                  value={numIdeas}
                  onChange={(e) => setNumIdeas(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-md appearance-none cursor-pointer accent-blue-600"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </motion.div>
              
              {/* API/Mock toggle with better design */}
              <motion.div 
                variants={itemVariants}
                className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start">
                  <span className="relative inline-flex mr-3 mt-0.5">
                    <input
                      type="checkbox"
                      id="useMockData"
                      checked={useMockData}
                      onChange={() => setUseMockData(!useMockData)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
                    />
                    {useMockData && (
                      <span className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                        <span className="h-2 w-2 bg-blue-600 dark:bg-blue-500 rounded-full"></span>
                      </span>
                    )}
                  </span>
                  <div>
                    <label htmlFor="useMockData" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Use demo data
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {useMockData 
                        ? "Using demo data for quick testing" 
                        : "Using production API for real results"}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading || !prompt.trim()}
                className={`w-full ${
                  loading || !prompt.trim() 
                    ? 'bg-blue-300 dark:bg-blue-700/50 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                } text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center shadow-sm`}
                whileHover={!loading && prompt.trim() ? { scale: 1.02 } : {}}
                whileTap={!loading && prompt.trim() ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating ideas...
                  </>
                ) : (
                  <>
                    <Sparkle className="h-4 w-4 mr-2" />
                    Generate Research Ideas
                  </>
                )}
              </motion.button>
              
              {/* Error message */}
              {errorMessage && (
                <motion.div 
                  variants={itemVariants}
                  className="flex items-start text-red-500 dark:text-red-400 text-sm mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Generated Ideas Display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Ideas</h2>
              
              {/* Category filter tabs */}
              {ideas.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap transition-colors
                        ${activeCategory === category
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                      `}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {filteredIdeas.length > 0 ? (
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredIdeas.map((idea, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all"
                    whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white text-base">
                            {idea.title || `Research Idea ${index + 1}`}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {idea.category && (
                              <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full">
                                {idea.category}
                              </span>
                            )}
                            {idea.score && (
                              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                Score: {idea.score}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {typeof idea === 'string' ? idea : idea.description || 'No description provided.'}
                        </p>
                        
                        {/* Score visualization if available */}
                        {(idea.novelty !== undefined || idea.feasibility !== undefined) && (
                          <div className="grid grid-cols-2 gap-3 mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            {idea.novelty !== undefined && (
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Novelty</span>
                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                                    style={{ width: `${idea.novelty * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">{Math.round(idea.novelty * 100)}%</span>
                              </div>
                            )}
                            {idea.feasibility !== undefined && (
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Feasibility</span>
                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                    style={{ width: `${idea.feasibility * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">{Math.round(idea.feasibility * 100)}%</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          <button className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                            Save
                          </button>
                          <button className="flex items-center px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <FlaskConical className="h-3.5 w-3.5 mr-1.5" />
                            Create Paper
                          </button>
                          <button className="flex items-center px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                            Explore
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center h-64 text-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-blue-400 dark:text-blue-300" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">No ideas generated yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  Describe your research interests in the form to generate AI-powered research ideas
                </p>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Quick Stats or Recent Activity */}
        {ideas.length > 0 && (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Research Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Ideas Generated</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{ideas.length}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Papers Created</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                      <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Code Implementations</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Research Potential</h2>
                <div className="h-[200px] flex items-end space-x-6 px-2">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const height = 30 + Math.random() * 70;
                    return (
                      <div key={i} className="relative h-full flex flex-col justify-end flex-1">
                        <div 
                          className={`rounded-t-md ${
                            i % 3 === 0 ? 'bg-blue-400 dark:bg-blue-500' :
                            i % 3 === 1 ? 'bg-indigo-400 dark:bg-indigo-500' :
                            'bg-purple-400 dark:bg-purple-500'
                          }`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Research output projections based on your current activity
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Research recommendations */}
        <motion.div 
          className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recommended Research Directions</h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center">
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Quantum Machine Learning",
                icon: <Beaker className="h-5 w-5" />,
                color: "from-purple-400 to-indigo-500"
              },
              {
                title: "Green AI Architectures",
                icon: <LineChart className="h-5 w-5" />,
                color: "from-green-400 to-emerald-500"
              },
              {
                title: "Neural Networks for Climate Modeling",
                icon: <BarChart className="h-5 w-5" />,
                color: "from-blue-400 to-cyan-500"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-3`}>
                  {item.icon}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Trending research area with high publication potential
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
} 