import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-4 px-6 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-center space-x-6 text-sm">
        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          Pro
        </Link>
        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          Enterprise
        </Link>
        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          API
        </Link>
        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          Blog
        </Link>
        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          Careers
        </Link>
        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          Store
        </Link>
        <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          Finance
        </Link>
        <div className="flex items-center">
          <span className="text-gray-600 dark:text-gray-400">English</span>
          <ChevronDown className="h-4 w-4 ml-1 text-gray-500 dark:text-gray-500" />
        </div>
      </div>
    </footer>
  )
}

