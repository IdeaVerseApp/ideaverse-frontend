export interface SimilarPaper {
  title: string
  abstract?: string
  authors: string[]
  year?: number
  source: string
  source_url: string
  journal?: string
  doi?: string
  semantic_similarity: number
  citations?: number
  venue?: string
  keywords: string[]
  pdf_url?: string
  link?: string
  icon?: string
}

export interface ReflectionRound {
  round_number: number
  idea: string
  content?: string
}

export interface IdeaItem {
  name: string
  title: string
  experiment: string
  description?: string
  implementation_steps?: string[]
  expected_outcomes?: string[]
  potential_challenges?: string[]
  mitigation_strategies?: string[]
  thought?: string
  // Reflection rounds showing idea evolution
  reflection_rounds?: ReflectionRound[]
  // Similar papers for this individual idea
  similar_papers?: SimilarPaper[]
  // Scores as objects with score and justification
  novelty?: {
    score: number
    justification?: string
  }
  feasibility?: {
    score: number
    justification?: string
  }
  impact?: {
    score: number
    justification?: string
  }
  acceptance_probability?: {
    score: number
    justification?: string
  }
  // Simple numeric scores
  interestingness?: number
  scientific_merit?: number
  innovation_level?: number
  _id?: string
  // Legacy fields for backward compatibility
  Name?: string
  Title?: string
  Experiment?: string
  Interestingness?: number
  Feasibility?: number
  Novelty?: number
}

export interface IdeaFeedback {
  overall: {
    score: number
    text: string
  }
  novelty: {
    score: number
    text: string
  }
  feasibility: {
    score: number
    text: string
  }
}

export interface FollowUpQuestion {
  id: string
  question: string
  context?: string
  answer?: string
}

export interface FollowUpAnswer {
  question_id: string
  answer: string
}

export interface IdeaResponse {
  task_id: string
  user_id: string
  status: string
  task_description: string
  thought?: string
  ideas?: IdeaItem[]
  reflection_rounds?: number
  error?: string
  tags?: string[]
  similar_papers?: SimilarPaper[]
  follow_up_questions?: FollowUpQuestion[]
  follow_up_answers?: FollowUpAnswer[]
  created_at?: string
  updated_at?: string
  feedback?: Record<string, IdeaFeedback>
}

export interface IdeaDetail extends IdeaResponse {
  _id: string
} 