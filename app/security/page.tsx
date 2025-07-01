"use client"

import PublicPageLayout from "@/components/layouts/PublicPageLayout"
import { Lock, Shield, Database, Server } from "lucide-react"

const securityFeatures = [
    {
        icon: Lock,
        title: "Data Encryption",
        description: "All data, both in transit and at rest, is encrypted using industry-standard AES-256 encryption. Your research and personal information are always protected."
    },
    {
        icon: Shield,
        title: "Compliance & Audits",
        description: "We are compliant with major data protection regulations like GDPR and CCPA. Our systems undergo regular third-party security audits and penetration testing."
    },
    {
        icon: Database,
        title: "Data Confidentiality",
        description: "Your research data is your intellectual property. We treat it as confidential and will never share it or use it for any purpose other than providing our service to you."
    },
    {
        icon: Server,
        title: "Infrastructure Security",
        description: "Our services are hosted on secure, world-class cloud infrastructure with robust physical and network security measures in place."
    }
]

export default function SecurityPage() {
  return (
    <PublicPageLayout
      pageTitle="Security"
      pageDescription="We take the security and confidentiality of your data very seriously."
    >
        <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map(feature => (
                <div key={feature.title} className="flex">
                    <feature.icon className="w-12 h-12 mr-6 text-blue-600 dark:text-blue-500" />
                    <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-12 text-center bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold">Report a Vulnerability</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
                If you believe you have found a security vulnerability in our platform, please let us know. We appreciate your help in keeping IdeaVerse secure.
            </p>
            <p className="mt-4">
                Please contact us at <a href="mailto:security@ideaverse.ai" className="text-blue-600 dark:text-blue-500 font-semibold">security@ideaverse.ai</a>.
            </p>
        </div>

    </PublicPageLayout>
  )
} 