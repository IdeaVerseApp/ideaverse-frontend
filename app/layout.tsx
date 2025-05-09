import "./globals.css"

import { AuthProvider } from "../context/AuthContext"
import { ThemeProvider } from "../components/theme-provider"
import { IdeaProvider } from "../context/IdeaContext"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IdeaVerse",
  description: "Your AI-powered idea generation platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <IdeaProvider>
            <AuthProvider>{children}</AuthProvider>
          </IdeaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

