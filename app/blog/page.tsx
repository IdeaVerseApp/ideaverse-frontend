"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const blogPosts = [
  {
    title: "The Genesis of IdeaVerse: Our Mission to Revolutionize Research",
    author: "Jane Doe, CEO",
    date: "July 1, 2024",
    image: "/hero-image-1.png",
    excerpt: "Learn about the story behind IdeaVerse and our vision for the future of AI-assisted research and development.",
    link: "/blog/genesis-of-ideaverse"
  },
  {
    title: "How We Use AI to Measure Idea Novelty",
    author: "Dr. John Smith, Head of AI",
    date: "June 15, 2024",
    image: "/hero-image-2.png",
    excerpt: "A technical deep-dive into the models and algorithms that power our novelty assessment engine.",
    link: "/blog/ai-novelty-measurement"
  },
  {
    title: "Customer Spotlight: A University's Success with IdeaVerse",
    author: "Emily White, Customer Success",
    date: "May 28, 2024",
    image: "/hero-image-3.png",
    excerpt: "Discover how a leading research university accelerated their innovation pipeline using our platform.",
    link: "/blog/customer-spotlight-university"
  }
]

export default function BlogPage() {
  return (
    <PublicPageLayout
      pageTitle="The IdeaVerse Blog"
      pageDescription="Insights, stories, and updates from the team building the future of research."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={post.link} key={post.title} className="block group">
            <Card className="h-full flex flex-col overflow-hidden">
              <div className="relative h-56 w-full">
                  <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" />
              </div>
              <CardHeader>
                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                    {post.title}
                </CardTitle>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span>{post.author}</span> · <span>{post.date}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center text-blue-600 dark:text-blue-500 font-semibold">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </PublicPageLayout>
  )
} 