import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { IdeaProvider } from "@/context/IdeaContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IdeaVerse - Research Idea Platform",
  description: "A platform for scientists and researchers to brainstorm new research ideas using AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <IdeaProvider>{children}</IdeaProvider>
      </body>
    </html>
  )
}

