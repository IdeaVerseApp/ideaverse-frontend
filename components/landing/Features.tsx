"use client"

import {
  ArrowRight,
  Brain,
  Code,
  FileText,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import FeatureCard from "./FeatureCard"

const Features = () => {
  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,#0c2144,transparent)]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-semibold leading-8 text-orange-400">
            A New Reality
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The next generation of research is here
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            IdeaVerse provides powerful AI-driven tools to generate novel
            research ideas, draft papers, and implement code solutions.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <FeatureCard
            icon={Lightbulb}
            title="Idea Generation"
            description="Generate novel research ideas across multiple domains with our specialized AI models trained on research papers."
          />

          <FeatureCard
            icon={FileText}
            title="Paper Drafting"
            description="Transform ideas into comprehensive research papers with proper structure, citations, and methodology sections."
          />

          <FeatureCard
            icon={Code}
            title="Code Implementation"
            description="Generate functioning code implementations of research ideas in multiple programming languages."
          />

          <FeatureCard
            icon={Brain}
            title="Research Assistant"
            description="Get insightful answers to research questions and assistance with literature reviews and analysis."
          />

          <FeatureCard
            icon={Sparkles}
            title="Novelty Assessment"
            description="Evaluate how novel your research ideas are compared to existing literature with our uniqueness scoring."
          />

          <FeatureCard
            icon={ArrowRight}
            title="Collaborative Workflow"
            description="Share and collaborate on research ideas, papers, and code implementations with team members."
          />
        </div>
      </div>
    </section>
  )
}

export default Features
