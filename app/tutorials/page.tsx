"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle } from "lucide-react"

const tutorials = [
  {
    title: "Video: Setting Up Your First Project",
    description: "Watch this quick 5-minute video to learn how to create a project and start generating ideas.",
    link: "https://www.youtube.com/watch?v=example",
    duration: "5:23"
  },
  {
    title: "Video: A Deep Dive into Reflection Method",
    description: "Learn the theory and practice behind our most powerful idea generation technique.",
    link: "https://www.youtube.com/watch?v=example",
    duration: "15:45"
  },
  {
    title: "Video: From Code Generation to GitHub",
    description: "See how you can generate code for your ideas and push it directly to a GitHub repository.",
    link: "https://www.youtube.com/watch?v=example",
    duration: "8:12"
  },
]

export default function TutorialsPage() {
  return (
    <PublicPageLayout
      pageTitle="Tutorials"
      pageDescription="Watch our video tutorials to quickly get up to speed with IdeaVerse's features."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutorials.map((tutorial) => (
          <a href={tutorial.link} target="_blank" rel="noopener noreferrer" key={tutorial.title} className="block group">
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {tutorial.duration}
                </div>
              </div>
              <CardHeader>
                <CardTitle>{tutorial.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tutorial.description}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </PublicPageLayout>
  )
} 