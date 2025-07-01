"use client"

import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"

interface PublicPageLayoutProps {
  children: React.ReactNode
  pageTitle: string
  pageDescription?: string
}

export default function PublicPageLayout({
  children,
  pageTitle,
  pageDescription,
}: PublicPageLayoutProps) {
  const currentYear = new Date().getFullYear().toString()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-x-hidden">
      <div className="animated-grid-background"></div>
      <Header />
      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              {pageTitle}
            </h1>
            {pageDescription && (
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                {pageDescription}
              </p>
            )}
          </div>
          <div className="mt-12">{children}</div>
        </div>
      </main>
      <Footer currentYear={currentYear} />
    </div>
  )
} 