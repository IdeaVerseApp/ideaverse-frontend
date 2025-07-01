import "./globals.css"

import { AuthProvider } from "../context/AuthContext"
import { ThemeProvider } from "../components/theme-provider"
import { IdeaProvider } from "../context/IdeaContext"
import { Inter, Caveat } from "next/font/google"
import type { Metadata } from "next"
import type React from "react"
import { SessionProvider } from "../components/session-provider"
import { cn } from "../lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

export const metadata: Metadata = {
  title: "IdeaVerse",
  description: "Your AI-powered idea generation platform",
  icons: {
    icon: '/ideaverse_logo.png',
    apple: '/ideaverse_logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        caveat.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <IdeaProvider>
              <AuthProvider>{children}</AuthProvider>
            </IdeaProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

