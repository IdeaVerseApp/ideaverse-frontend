import type { IdeaExplorationResult, SimilarPaper } from "@/types/idea-exploration"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface IdeaGenerationTask {
  task_id?: string        // Optional, backend will generate if missing
  user_id?: string        // Optional, backend will default to "unknown"
  task_description: string // Required
  code?: string           // Optional, can be empty string
  num_ideas: number       // Required
  num_reflections?: number
  reflection_rounds?: number
  prev_ideas?: any[]
  seed_ideas?: any[]
  system_prompt?: string
}

interface IdeaResponse {
  _id?: string         // MongoDB ObjectId
  task_id: string      // UUID
  user_id: string
  task_description: string
  status: string
  thought: string
  ideas: any[]
  reflection_rounds: number
  error?: string
  similar_papers?: SimilarPaper[]
}

export async function generateIdeaExploration(researchIdea: string): Promise<IdeaExplorationResult> {
  // In a real application, this would be an API call
  // Remove artificial delay for better performance
  
  // Mock data based on the research idea
  return {
    id: 1,
    title: "Adaptive Compiler Optimization",
    tags: ["Finance", "AI", "Personalization"],
    description:
      "An AI-based compiler optimization tool that leverages reinforcement learning to dynamically adjust code optimizations based on hardware performance metrics. The system continuously learns from real-time performance data to identify the most effective optimization strategies, improving execution time and resource efficiency.",
    scores: {
      novelty: 78,
      feasibility: 20,
      paperAcceptance: 60,
    },
    workflow: {
      dataCollection: [
        "Collect diverse code samples like mathematical computations, data-intensive algorithms, and system utilities.",
        "Record performance metrics such as CPU cycles, cache miss rate, memory bandwidth, and power consumption.",
        "Prepare a dataset of compiler flags (e.g., '-O1', '-O2', '-O3', '-funroll-loops').",
        "Collect data across multiple environments (Intel, AMD, ARM) to ensure generalization.",
        "Tools: 'perf', 'Valgrind', 'LLVM/Clang', or 'GCC'.",
      ],
      modelTraining: [
        "Encode code structure as a graph (AST - Abstract Syntax Tree).",
        "Define possible compiler flags and code transformations as the action space.",
        "Design a reward function that rewards faster execution, lower memory usage, and improved cache efficiency.",
        "Train the RL model using algorithms like PPO, DQN, or Bayesian Optimization.",
        "Start training with simple code and gradually introduce complex algorithms.",
      ],
    },
    relatedResearch: [
      {
        title: "Learning to Optimize: A Reinforcement Learning Approach to Compiler Optimization",
        link: "arxiv:1806.07896",
        brief:
          "This paper presents a reinforcement learning framework that dynamically selects compiler optimizations to improve code performance. The model adapts to different hardware architectures and workloads.",
      },
      {
        title: "Learning to Optimize: A Reinforcement Learning Approach to Compiler Optimization",
        link: "arxiv:1806.07896",
        brief:
          "This paper presents a reinforcement learning framework that dynamically selects compiler optimizations to improve code performance. The model adapts to different hardware architectures and workloads.",
      },
      {
        title: "Learning to Optimize: A Reinforcement Learning Approach to Compiler Optimization",
        link: "arxiv:1806.07896",
        brief:
          "This paper presents a reinforcement learning framework that dynamically selects compiler optimizations to improve code performance. The model adapts to different hardware architectures and workloads.",
      },
      {
        title: "Learning to Optimize: A Reinforcement Learning Approach to Compiler Optimization",
        link: "arxiv:1806.07896",
        brief:
          "This paper presents a reinforcement learning framework that dynamically selects compiler optimizations to improve code performance. The model adapts to different hardware architectures and workloads.",
      },
    ],
  }
}

// New function to generate ideas using the backend API
export async function generateIdeas(task: IdeaGenerationTask): Promise<IdeaResponse> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Ensure all required fields are set with defaults if not provided
    const completeTask = {
      ...task,
      user_id: task.user_id || "unknown", // Default user_id if not provided
      code: task.code || "",              // Empty string default
      num_ideas: task.num_ideas || 5,     // Default to 5 ideas
      num_reflections: task.num_reflections || (task.reflection_rounds || 2),
      prev_ideas: task.prev_ideas || [],
      seed_ideas: task.seed_ideas || [],
      system_prompt: task.system_prompt || ""
    };

    const response = await axios.post(`${API_URL}/ideas/generate`, completeTask, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error generating ideas:', error);
    throw error;
  }
}

// New function to fetch user's generated ideas
export async function getUserIdeas(params?: { 
  skip?: number; 
  limit?: number; 
  status?: string;
  sort_by?: string;
  sort_order?: number;
}): Promise<any[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('User not authenticated when fetching ideas');
      return [];
    }

    // Implement retry logic for transient errors
    let retries = 2;
    let lastError: any = null;

    while (retries >= 0) {
      try {
        const response = await axios.get(`${API_URL}/ideas/user-tasks`, {
          params,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          // Add timeout to prevent hanging requests
          timeout: 10000
        });
        
        return response.data;
      } catch (error: any) {
        lastError = error;
        
        // Only retry on network errors or 5xx server errors
        if (error.code === 'ECONNABORTED' || 
            (error.response && error.response.status >= 500 && error.response.status < 600)) {
          retries--;
          if (retries >= 0) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
            continue;
          }
        } else {
          // Don't retry on other errors (auth errors, etc.)
          break;
        }
      }
    }

    // If we got here, all retries failed or we encountered a non-retryable error
    const errorMessage = lastError?.response?.data?.detail || 
                         lastError?.message || 
                         'Unknown error fetching ideas';
                           
    const statusCode = lastError?.response?.status || 500;
    
    console.error(`Error fetching user ideas (${statusCode}):`, errorMessage);
    
    // For server errors, return empty array instead of throwing to prevent UI breakage
    if (statusCode >= 500) {
      console.warn('Returning empty ideas array due to server error');
      return [];
    }
    
    throw {
      message: errorMessage,
      status: statusCode,
      originalError: lastError
    };
  } catch (error) {
    console.error('Error fetching user ideas:', error);
    // Return empty array as fallback to prevent UI from breaking
    return [];
  }
}

