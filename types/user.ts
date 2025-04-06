export interface ResearchIdea {
  id: string | number
  name: string
  title: string
  experiment: string
  interestingness: number
  feasibility: number
  novelty: number
  novel: boolean
  code: string[]
  paper: string
  category?: string
  date?: string
}

export interface PersonalInformation {
  id: string | number
  name: string
  email?: string
  role?: string
  institution?: string
  joinDate?: string
}

export interface UserData {
  personalInformation: PersonalInformation[]
  researchIdeas: ResearchIdea[]
}

