"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ApiPage() {
  return (
    <PublicPageLayout
      pageTitle="IdeaVerse API"
      pageDescription="Integrate the power of AI-driven idea generation and research into your own applications."
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          
          <section>
            <h2>Getting Started</h2>
            <p>
              Our API is designed to be simple and intuitive. To get started, you'll need an API key, which you can generate from your account dashboard.
            </p>
            <ol>
              <li><Link href="/signup">Sign up</Link> for an IdeaVerse account.</li>
              <li>Navigate to your API settings in the dashboard.</li>
              <li>Generate your unique API key.</li>
              <li>Start making requests!</li>
            </ol>
            <Button asChild>
                <Link href="/documentation">View Full Documentation</Link>
            </Button>
          </section>

          <section className="mt-12">
            <h2>Authentication</h2>
            <p>
              All API requests must be authenticated with your API key. Include your key in the <code>Authorization</code> header of your requests as a Bearer token.
            </p>
            <pre><code>{`Authorization: Bearer YOUR_API_KEY`}</code></pre>
          </section>

          <section className="mt-12">
            <h2>Core Endpoints</h2>
            <p>Here are some of the core functionalities you can access via our API:</p>
            <ul>
              <li><strong>Generate Ideas:</strong> Programmatically generate novel ideas based on your input criteria.</li>
              <li><strong>Novelty Assessment:</strong> Get a novelty score for any given idea or text.</li>
              - <li><strong>Automated Paper Drafting:</strong> Create initial drafts of research papers.</li>
              <li><strong>Code Implementation:</strong> Generate boilerplate code for your ideas.</li>
            </ul>
          </section>

          <section className="mt-12 text-center">
            <h2 className="text-3xl font-bold">Ready to Build?</h2>
            <p className="mt-4 text-lg">
                Explore our API plans and find the perfect fit for your project's scale.
            </p>
            <Button asChild size="lg" className="mt-6">
                <Link href="/pricing">View API Pricing</Link>
            </Button>
          </section>

        </div>
      </div>
    </PublicPageLayout>
  )
} 