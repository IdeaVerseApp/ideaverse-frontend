import type { IdeaExplorationResult, SimilarPaper } from "@/types/idea-exploration"
import type { IdeaResponse, FollowUpQuestion, FollowUpAnswer, IdeaFeedback } from "@/types/idea"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
    relatedResearch: [],
    similarPapers: [
      {
        title: "LEAF: A Learning-based Compiler for Fast GPU Code Generation",
        source_url: "https://example.com/papers/1",
        citations: 34,
        authors: [],
        source: "ExampleSource",
        semantic_similarity: 0.89,
        keywords: [],
      },
      {
        title: "Deep Reinforcement Learning for Compiler Optimization",
        source_url: "https://example.com/papers/2",
        citations: 67,
        authors: [],
        source: "ExampleSource",
        semantic_similarity: 0.76,
        keywords: [],
      },
      {
        title: "AutoTune: Adaptive Compiler Optimizations for Deep Learning",
        source_url: "https://example.com/papers/3",
        citations: 112,
        authors: [],
        source: "ExampleSource",
        semantic_similarity: 0.72,
        keywords: [],
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
      num_ideas: task.num_ideas || 2,     // Default to 2 ideas
      num_reflections: task.num_reflections || (task.reflection_rounds || 2),
      prev_ideas: task.prev_ideas || [],
      seed_ideas: task.seed_ideas || [],
      system_prompt: task.system_prompt || "",
      status: "started"
    };

    const response = await axios.post(`${API_URL}/ideatask/generate`, completeTask, {
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

// Function to generate follow-up questions for an idea
export async function generateFollowUpQuestions(task: IdeaGenerationTask): Promise<IdeaResponse> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Validate the required field
    if (!task.task_description) {
      throw new Error('Task description is required');
    }

    // Ensure all required fields are set with defaults if not provided
    const completeTask = {
      task_description: task.task_description,
      task_id: task.task_id || undefined,
      user_id: task.user_id || undefined,
      code: task.code || "",
      num_ideas: task.num_ideas || 2,
      num_reflections: task.num_reflections || 2,
      status: "started"
    };

    const response = await axios.post(`${API_URL}/ideatask/generate-followup-questions`, completeTask, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    throw error;
  }
}

// Function to submit follow-up question answers and generate ideas
export async function submitFollowUpAnswers(taskId: string, answers: FollowUpAnswer[]): Promise<IdeaResponse> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_URL}/ideatask/submit-followup-answers/${taskId}`, answers, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting follow-up answers:', error);
    throw error;
  }
}

// Function to get a specific idea task by ID
export async function getIdeaTask(taskId: string): Promise<IdeaResponse> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_URL}/ideatask/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching idea task:', error);
    throw error;
  }
}

// Function to get individual ideas for a specific task (new endpoint)
export async function getIdeasForTask(taskId: string): Promise<any[]> {
  try {
    const response = await axios.get(`${API_URL}/idea/task/${taskId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ideas for task ${taskId}:`, error);
    return [];
  }
}

// Function to get a specific idea by ID (updated to handle new backend structure)
export async function getIdea(ideaId: string): Promise<IdeaResponse> {
  try {
    // Try to get the idea directly from the idea endpoint
    const response = await axios.get(`${API_URL}/idea/${ideaId}`, {
      headers: getAuthHeaders()
    });
    
    // Check if this is an individual idea or an idea task
    const data = response.data;
    
    // If it's an idea task with hydrated ideas, format it for the frontend
    if (data.task_id && Array.isArray(data.ideas)) {
      // This is an idea task with ideas array
      const formattedIdeas = data.ideas.map((idea: any, index: number) => {
        // If the idea is already a full object, return it
        if (typeof idea === 'object' && idea !== null && !idea.error) {
          return idea;
        }
        // Otherwise, return a placeholder
        return {
          id: typeof idea === 'string' ? idea : `idea-${index}`,
          name: `Idea ${index + 1}`,
          description: idea.error || "Idea details not available",
          error: true
        };
      });
      
      return {
        ...data,
        ideas: formattedIdeas
      };
    }
    
    // If it's a single idea, wrap it in an ideas array for consistency
    if (!data.ideas && data.name) {
      return {
        ...data,
        ideas: [data]
      };
    }
    
    return data;
  } catch (error) {
    // Fallback: try to get it as an idea task
    try {
      const taskResponse = await axios.get(`${API_URL}/ideatask/${ideaId}`, {
        headers: getAuthHeaders()
      });
      return taskResponse.data;
    } catch (taskError) {
      console.error("Error fetching idea:", error);
      throw error;
    }
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
        const response = await axios.get(`${API_URL}/ideatask/user-tasks`, {
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

// Function to submit feedback for an idea
export async function submitIdeaFeedback(
  ideaId: string,
  feedback: IdeaFeedback
): Promise<any> {
  try {
    const response = await axios.post(
      `${API_URL}/idea/${ideaId}/feedback`,
      feedback,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    'Authorization': `Bearer ${token}`
  };
}

