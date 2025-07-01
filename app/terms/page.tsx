"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"

export default function TermsPage() {
  return (
    <PublicPageLayout
      pageTitle="Terms of Service"
      pageDescription="Last updated: July 8, 2024"
    >
      <div className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <p>
          Please read these Terms of Service carefully before using the Service operated by IdeaVerse.
        </p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </p>

        <h2>2. Accounts</h2>
        <p>
          When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of IdeaVerse and its licensors. You retain ownership of any intellectual property rights that you hold in the content you submit to the Service.
        </p>

        <h2>4. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>5. Limitation Of Liability</h2>
        <p>
          In no event shall IdeaVerse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h2>6. Changes</h2>
        <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at: <a href="mailto:legal@ideaverse.ai">legal@ideaverse.ai</a>
        </p>
      </div>
    </PublicPageLayout>
  )
} 