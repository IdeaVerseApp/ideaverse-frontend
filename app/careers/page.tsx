"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const jobOpenings = [
  {
    title: "Senior AI Research Scientist",
    department: "Artificial Intelligence",
    location: "Remote (Global)",
    link: "/careers/ai-research-scientist"
  },
  {
    title: "Full-Stack Software Engineer",
    department: "Engineering",
    location: "New York, NY",
    link: "/careers/full-stack-engineer"
  },
  {
    title: "Product Manager, AI Platforms",
    department: "Product",
    location: "San Francisco, CA",
    link: "/careers/product-manager-ai"
  },
  {
    title: "UX/UI Designer",
    department: "Design",
    location: "Remote (US)",
    link: "/careers/ux-ui-designer"
  },
]

export default function CareersPage() {
  return (
    <PublicPageLayout
      pageTitle="Join Our Team"
      pageDescription="We're looking for passionate people to join us on our mission to revolutionize research. Help us build the future."
    >
      <div className="space-y-8">
        {jobOpenings.map((job) => (
            <Card key={job.title}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.department} · {job.location}</CardDescription>
              </CardHeader>
              <CardFooter>
                 <Button asChild>
                    <a href={job.link}>
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                 </Button>
              </CardFooter>
            </Card>
        ))}
      </div>
    </PublicPageLayout>
  )
} 