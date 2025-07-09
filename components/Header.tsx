import { Figma, Sparkles } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-medium text-gray-900">
                KOGA AI
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                Beta
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Figma className="w-4 h-4" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header
