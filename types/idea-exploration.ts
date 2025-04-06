export interface ResearchPaper {
  title: string
  link: string
  brief: string
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
}

