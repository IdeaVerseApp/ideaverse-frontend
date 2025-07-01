"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"

export default function PrivacyPage() {
  return (
    <PublicPageLayout
      pageTitle="Privacy Policy"
      pageDescription="Last updated: July 8, 2024"
    >
      <div className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <p>
          Welcome to IdeaVerse. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Service includes:
        </p>
        <ul>
          <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Service.</li>
          <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.</li>
           <li><strong>Research Data:</strong> We collect and store the research ideas, notes, drafts, and other content you create or upload to our platform. This data is treated as confidential and is not shared.</li>
        </ul>

        <h2>2. Use of Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
        </p>
        <ul>
            <li>Create and manage your account.</li>
            <li>Provide and improve our AI-powered services.</li>
            <li>Email you regarding your account or order.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
            <li>Notify you of updates to the Service.</li>
        </ul>
        
        <h2>3. Disclosure of Your Information</h2>
        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
        <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
        </ul>

        <h2>4. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@ideaverse.ai">privacy@ideaverse.ai</a>
        </p>
      </div>
    </PublicPageLayout>
  )
} 