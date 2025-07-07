'use client';

import { useState, useEffect, useMemo } from 'react';
import { generateIdeas, getUserIdeas } from '@/services/idea-service';
import { Sparkle, Loader2, ExternalLink, Bookmark, Lightbulb, AlertCircle, Brain, ChevronRight, Zap, LineChart, BarChart, Beaker, FlaskConical, FileText, Code, ChevronDown, TrendingUp, Database, Target, Globe, BookOpen } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
// Import recharts components via our wrapper to avoid SSR issues
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis } from 'recharts'

const formatDistanceToNow = (date: Date): string => {
  if (!date) return '';
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';

  let interval = seconds / 31536000;
  if (interval > 1) {
    const years = Math.floor(interval);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const months = Math.floor(interval);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hours = Math.floor(interval);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
};

// Mock data removed to ensure real API data is used

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
    transition: { type: "spring" as const, stiffness: 100 }
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [numIdeas, setNumIdeas] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  // Always set to false to ensure real data is used
  const [useMockData, setUseMockData] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentGenerations, setRecentGenerations] = useState(0);
  const [fetchedInitialIdeas, setFetchedInitialIdeas] = useState(false);
  const router = useRouter();

  // Helper function to get formatted full name in Title Case
  const getFormattedFullName = () => {
    const name = user?.full_name || user?.username;
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .replace(/\d+$/, ''); // Remove any trailing numbers (like timestamps)
    }
    return 'Researcher';
  };

  useEffect(() => {
    // Update counter when ideas are generated
    if (ideas.length > 0) {
      setRecentGenerations(prev => prev + 1);
    }
  }, [ideas]);

  useEffect(() => {
    const fetchExistingIdeas = async () => {
      try {
        const tasks = await getUserIdeas({ limit: 50, sort_by: 'created_at', sort_order: -1 });

        if (Array.isArray(tasks)) {
          const collectedIdeas = tasks
            .filter(task => task && task.task_description && task.status === 'completed')
            .map((task: any) => {
              const firstIdea = Array.isArray(task.ideas) && task.ideas.length > 0 ? task.ideas[0] : null;
              
              const category = (Array.isArray(task.tags) && task.tags.length > 0 ? task.tags[0] : undefined) || 
                               (firstIdea?.category) || 
                               'general';
              
              const score = firstIdea?.score || (typeof firstIdea?.novelty === 'object' ? firstIdea.novelty?.score : firstIdea?.novelty);

                              return {
                  title: task.task_description,
                  description: firstIdea?.description || firstIdea?.experiment || `Contains ${task.ideas?.length || 0} generated ideas.`,
                  score: score,
                  category: category,
                  taskId: task._id || task.id || task.task_id,
                  createdAt: task.created_at ? new Date(task.created_at) : new Date(),
                  numIdeasInTask: Array.isArray(task.ideas) ? task.ideas.length : 0,
                };
            });

          if (collectedIdeas.length > 0) {
            setIdeas(collectedIdeas);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user ideas:', err);
      } finally {
        setFetchedInitialIdeas(true);
      }
    };

    fetchExistingIdeas();
  }, []);

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await generateIdeas({
        task_description: prompt,
        code: "",
        num_ideas: numIdeas,
        num_reflections: 2
      });
      
      console.log("API Response:", response);
      
      if (response && response.ideas && Array.isArray(response.ideas)) {
        const firstIdea = response.ideas.length > 0 ? response.ideas[0] : {};
        const category = (Array.isArray(response.tags) && response.tags.length > 0 ? response.tags[0] : undefined) || 
                         firstIdea.category || 
                         'generated';
        const score = firstIdea.score || (typeof firstIdea.novelty === 'object' ? firstIdea.novelty?.score : firstIdea.novelty);

        const newTask = {
          title: response.task_description,
          description: firstIdea.description || firstIdea.experiment || `Contains ${response.ideas.length} generated ideas.`,
          score: score,
          category: category,
          taskId: response.task_id,
          createdAt: new Date(),
          numIdeasInTask: response.ideas.length,
        };

        setIdeas(prev => [newTask, ...prev]);
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

  const handleRowClick = (idea:any) => {
    if(idea.taskId){
      router.push(`/ideas/${idea.taskId}`);
    }
  }

  // Prepare data for research potential chart (ideas generated per month over last 6 months)
  const researchChartData = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];
    const counts: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(d.toLocaleString('default', { month: 'short' }));
      counts.push(0);
    }
    ideas.forEach((idea) => {
      if (!idea.createdAt) return;
      const diffMonths = (now.getFullYear() - idea.createdAt.getFullYear()) * 12 + (now.getMonth() - idea.createdAt.getMonth());
      if (diffMonths >= 0 && diffMonths < 6) {
        counts[5 - diffMonths] += 1;
      }
    });
    const max = Math.max(...counts, 1);
    const heights = counts.map((c) => (c / max) * 90 + 10); // min 10%
    return { labels, heights, counts };
  }, [ideas]);

  const chartBarGradients = [
    "bg-gradient-to-t from-green-400 to-teal-400 dark:from-green-500 dark:to-teal-500",
    "bg-gradient-to-t from-teal-400 to-cyan-400 dark:from-teal-500 dark:to-cyan-500",
    "bg-gradient-to-t from-cyan-400 to-sky-400 dark:from-cyan-500 dark:to-sky-500",
    "bg-gradient-to-t from-sky-400 to-blue-400 dark:from-sky-500 dark:to-blue-500",
    "bg-gradient-to-t from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500",
    "bg-gradient-to-t from-indigo-400 to-purple-400 dark:from-indigo-500 dark:to-purple-500",
  ];

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
                <div className="mb-4">
                  <motion.h1 
                    className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100" 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Howdy, {getFormattedFullName()}!
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-blue-100 font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    What idea would you like to explore today?
                  </motion.p>
                </div>
                
                <div className="mt-6 flex items-center text-sm">
                  <div className="flex items-center mr-6 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
                    <Zap className="h-4 w-4 mr-2 text-yellow-300" />
                    <span>{recentGenerations} Recent Generations</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
                    <Brain className="h-4 w-4 mr-2 text-blue-300" />
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
        
        {/* Research Analytics Section - Collapsible */}
        {ideas.length > 0 && (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="analytics" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Research Analytics Dashboard</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Insights from your research data and paper analysis</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {(() => {
                    // Calculate analytics data from ideas and similar papers
                    const allSimilarPapers = ideas.flatMap(idea => 
                      idea.similar_papers || []
                    );
                    
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
                      <div className="space-y-8">
                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/20">
                             <div className="flex items-center mb-2">
                               <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Top Similar Papers</span>
                             </div>
                             <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalPapersScanned.toLocaleString()}</div>
                             <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Across all research ideas</div>
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
                              <LineChart className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                              Publication Year Distribution
                            </h3>
                            {yearChartData.length > 0 ? (
                              <ResponsiveContainer width="100%" height={200}>
                                <RechartsBarChart data={yearChartData}>
                                  <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                  <YAxis tick={{ fontSize: 12 }} />
                                  <ChartTooltip 
                                    content={({ active, payload, label }) => {
                                      if (active && payload && payload.length) {
                                        return (
                                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                            <p className="font-medium">{`Year: ${label}`}</p>
                                            <p className="text-blue-600 dark:text-blue-400">{`Papers: ${payload[0].value}`}</p>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </RechartsBarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                                <div className="text-center">
                                  <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>No publication year data available</p>
                                </div>
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
                                    <ChartTooltip 
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          const data = payload[0].payload;
                                          return (
                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                              <p className="font-medium">{data.source}</p>
                                              <p className="text-blue-600 dark:text-blue-400">{`${data.count} papers`}</p>
                                              <p className="text-sm text-gray-500">{`${((data.count / totalPapersScanned) * 100).toFixed(1)}%`}</p>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
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
                                <div className="text-center">
                                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>No source data available</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Summary Stats */}
                        {totalPapersScanned > 0 && (
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
                        )}
                      </div>
                    );
                  })()}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        )}
        
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
              {/* Demo data checkbox removed to ensure real data is always used */}
              
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
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Recent Ideas</h2>
              
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
              <div className="space-y-3">
                {filteredIdeas.map((idea, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-md bg-gray-900/40 dark:bg-gray-700/60 px-4 py-3 border border-gray-700 hover:border-blue-500 hover:bg-gray-900/60 dark:hover:bg-gray-700 transition-all cursor-pointer"
                    onClick={() => handleRowClick(idea)}
                  >
                    <div className="flex-1 mr-4">
                      <h3 className="text-sm font-semibold text-gray-100 truncate">
                        {idea.title || `Idea ${index + 1}`}
                      </h3>
                      {idea.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          {idea.description}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-gray-500 mt-2 space-x-2">
                        <span>{idea.numIdeasInTask} {idea.numIdeasInTask === 1 ? 'idea' : 'ideas'}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(idea.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-400 whitespace-nowrap">
                      {idea.category && (
                        <span className="mb-1 px-2 py-0.5 bg-gray-800 rounded-full text-gray-300">
                          {idea.category}
                        </span>
                      )}
                      {idea.score && <span>Score: {idea.score}</span>}
                    </div>
                  </div>
                ))}
              </div>
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
                <TooltipProvider>
                  <div className="h-[200px] flex items-end space-x-6 px-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg py-4">
                    {researchChartData.labels.map((lbl, i) => (
                      <Tooltip key={lbl}>
                        <TooltipTrigger asChild>
                          <div className="relative h-full flex flex-col justify-end flex-1 cursor-pointer group">
                            <div
                              className={`${chartBarGradients[i]} rounded-t-lg transition-all duration-300 ease-in-out group-hover:opacity-90 transform group-hover:-translate-y-1`}
                              style={{ height: `${researchChartData.heights[i]}%` }}
                            ></div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                              {lbl}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{researchChartData.counts[i]} {researchChartData.counts[i] === 1 ? 'idea' : 'ideas'}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
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
            <button 
              className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center"
              onClick={() => router.push('/ideas')}
            >
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
              <div 
                key={i} 
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  // Navigate to ideas page with the selected idea prefilled
                  router.push(`/ideas?idea=${encodeURIComponent(item.title)}`);
                }}
              >
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