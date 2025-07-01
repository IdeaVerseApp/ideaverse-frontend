"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const docSections = [
  {
    title: "Getting Started",
    description: "An overview of IdeaVerse and how to get your first idea generated.",
    link: "/documentation/getting-started",
  },
  {
    title: "API Reference",
    description: "Detailed documentation for our REST API.",
    link: "/api",
  },
  {
    title: "Idea Generation",
    description: "Learn about the different methods and models for generating ideas.",
    link: "/documentation/idea-generation",
  },
  {
    title: "Novelty Assessment",
    description: "Understand how we score and rank the novelty of ideas.",
    link: "/documentation/novelty-assessment",
  },
  {
    title: "Paper Drafting",
    description: "Guides on how to use our AI to draft research papers.",
    link: "/documentation/paper-drafting",
  },
  {
    title: "Account & Billing",
    description: "Manage your account, subscription, and billing information.",
    link: "/documentation/account",
  },
]

export default function DocumentationPage() {
  return (
    <PublicPageLayout
      pageTitle="Documentation"
      pageDescription="Explore our comprehensive documentation to get the most out of IdeaVerse."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {docSections.map((section) => (
          <Link href={section.link} key={section.title} className="block hover:scale-105 transition-transform duration-200">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </CardContent>
              <div className="p-4 pt-0 flex justify-end">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </PublicPageLayout>
  )
} 