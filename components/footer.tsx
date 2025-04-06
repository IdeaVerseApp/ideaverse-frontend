import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-4 px-6 bg-white">
      <div className="flex items-center justify-center space-x-6 text-sm">
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Pro
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Enterprise
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          API
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Blog
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Careers
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Store
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Finance
        </Link>
        <div className="flex items-center">
          <span className="text-gray-600">English</span>
          <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
        </div>
      </div>
    </footer>
  )
}

