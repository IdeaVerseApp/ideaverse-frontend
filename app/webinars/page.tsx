"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Video } from "lucide-react"

const upcomingWebinars = [
  {
    title: "Live Demo: Advanced Research Workflows",
    date: "July 15, 2024 - 11:00 AM PST",
    description: "Join our founder for a live demonstration of advanced features and a Q&A session."
  }
]

const pastWebinars = [
  {
    title: "Intro to AI-Powered Research",
    date: "June 20, 2024",
    description: "A look at the fundamentals of IdeaVerse and how it can 10x your research output.",
    link: "https://www.youtube.com/watch?v=example"
  },
  {
    title: "Panel: The Future of Academic Publishing",
    date: "May 5, 2024",
    description: "Industry experts discuss the role of AI in the future of academic research and publishing.",
    link: "https://www.youtube.com/watch?v=example"
  }
]

export default function WebinarsPage() {
  return (
    <PublicPageLayout
      pageTitle="Webinars"
      pageDescription="Join our live webinars to learn from experts and watch recordings of past events."
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Upcoming Webinars</h2>
          <div className="space-y-6">
            {upcomingWebinars.map(webinar => (
              <Card key={webinar.title}>
                <CardHeader>
                  <CardTitle>{webinar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {webinar.date}
                  </div>
                  <p className="mb-4">{webinar.description}</p>
                  <Button>Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Past Webinars</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {pastWebinars.map(webinar => (
              <Card key={webinar.title}>
                <CardHeader>
                  <CardTitle>{webinar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {webinar.date}
                  </div>
                  <p className="mb-4">{webinar.description}</p>
                   <Button variant="outline" asChild>
                    <a href={webinar.link} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 mr-2" />
                      Watch Recording
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PublicPageLayout>
  )
} 