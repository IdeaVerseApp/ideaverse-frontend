export interface ResearchPaper {
  title: string
  link: string
  brief: string
}

export interface SimilarPaper {
  title: string;
  abstract?: string;
  authors: string[];
  year?: number;
  source: string;
  source_url: string;
  journal?: string;
  doi?: string;
  semantic_similarity: number;
  citations?: number;
  venue?: string;
  keywords: string[];
  pdf_url?: string;
  icon?: string;
}

export interface IdeaExplorationResult {
  id: number
  title: string
  tags: string[]
  description: string
  scores: {
    novelty: number
    feasibility: number
    paperAcceptance: number
  }
  workflow: {
    dataCollection: string[]
    modelTraining: string[]
  }
  relatedResearch: ResearchPaper[]
  similarPapers?: SimilarPaper[]
}

