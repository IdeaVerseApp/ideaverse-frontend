"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import Link from "next/link"

const guides = [
  {
    title: "From Idea to First Draft",
    description: "A step-by-step guide to generating a research idea and creating a paper draft in under an hour.",
    link: "/guides/idea-to-draft",
    duration: "45 min read"
  },
  {
    title: "Finding Truly Novel Ideas",
    description: "Leverage our novelty assessment tools to find gaps in existing research and explore unique concepts.",
    link: "/guides/finding-novel-ideas",
    duration: "30 min read"
  },
  {
    title: "Collaborating with your Team",
    description: "Learn how to use IdeaVerse for team-based research projects and share your findings.",
    link: "/guides/collaboration",
    duration: "20 min read"
  },
  {
    title: "Integrating with Your Workflow",
    description: "Connect IdeaVerse with tools like Zotero, GitHub, and Notion for a seamless experience.",
    link: "/guides/integrations",
    duration: "15 min read"
  },
]

export default function GuidesPage() {
  return (
    <PublicPageLayout
      pageTitle="Guides"
      pageDescription="Practical guides to help you master the art of AI-powered research with IdeaVerse."
    >
      <div className="space-y-8">
        {guides.map((guide) => (
          <Link href={guide.link} key={guide.title} className="block">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>{guide.title}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                            {guide.description}
                        </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-gray-400 ml-6" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    {guide.duration}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PublicPageLayout>
  )
} 