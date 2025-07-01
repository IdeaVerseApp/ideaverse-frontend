"use client"

import { ArrowRight } from "lucide-react"

// Feature card component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) => {
  return (
    <div className="relative rounded-2xl p-px group bg-gradient-to-b from-white/10 to-transparent">
      <div className="relative rounded-[15px] h-full bg-gray-900/95 backdrop-blur-sm p-6 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 via-purple-500 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-2xl z-0"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/5">
              <Icon className="h-5 w-5 text-white/80" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>

          {/* Description */}
          <p className="mt-4 text-gray-400 line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FeatureCard 