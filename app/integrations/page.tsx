"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const integrations = [
  {
    name: "Semantic Scholar",
    category: "Research",
    logo: "/placeholder-logo.svg",
    description: "Connect with Semantic Scholar to supercharge your literature reviews."
  },
  {
    name: "Google Scholar",
    category: "Research",
    logo: "/placeholder-logo.svg",
    description: "Leverage Google Scholar's vast index of academic papers."
  },
  {
    name: "GitHub",
    category: "Development",
    logo: "/placeholder-logo.svg",
    description: "Export generated code directly to your GitHub repositories."
  },
  {
    name: "GitLab",
    category: "Development",
    logo: "/placeholder-logo.svg",
    description: "Integrate with GitLab for a seamless code workflow."
  },
  {
    name: "Zotero",
    category: "Writing",
    logo: "/placeholder-logo.svg",
    description: "Export citations and manage your references with Zotero."
  },
  {
    name: "Mendeley",
    category: "Writing",
    logo: "/placeholder-logo.svg",
    description: "Keep your research organized with Mendeley."
  },
  {
    name: "Slack",
    category: "Collaboration",
    logo: "/placeholder-logo.svg",
    description: "Get notifications about your research progress in Slack."
  },
  {
    name: "Notion",
    category: "Collaboration",
    logo: "/placeholder-logo.svg",
    description: "Sync your generated ideas and notes with Notion."
  }
]

export default function IntegrationsPage() {
  return (
    <PublicPageLayout
      pageTitle="Integrations"
      pageDescription="Connect IdeaVerse with the tools you already use to streamline your research and development workflow."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {integrations.map((integration) => (
          <Card key={integration.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {integration.name}
              </CardTitle>
              <div className="w-10 h-10 relative">
                 <Image src={integration.logo} alt={`${integration.name} logo`} layout="fill" />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {integration.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PublicPageLayout>
  )
} 