'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Zap, 
  Palette, 
  Code, 
  Figma,
  MessageSquare,
  Loader2
} from 'lucide-react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-medium text-gray-900 mb-4">
              Design with AI, Code with Confidence
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Create beautiful UI designs using natural language. KOGA AI understands your vision and brings it to life in Figma, then generates production-ready code.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Natural Language Design
                </h3>
                <p className="text-sm text-gray-600">
                  Describe your UI in plain English and watch it come to life
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Live Figma Integration
                </h3>
                <p className="text-sm text-gray-600">
                  See your designs appear in real-time in Figma workspace
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Production Code Export
                </h3>
                <p className="text-sm text-gray-600">
                  Get clean HTML, CSS, and React code ready for deployment
                </p>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="text-left max-w-md mx-auto space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Try these examples:
              </p>
              {[
                "Create a modern login form with email and password fields",
                "Design a pricing card with three tiers",
                "Make a hero section with a call-to-action button"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleInputChange({ target: { value: example } } as any);
                    setIsExpanded(true);
                  }}
                  className="w-full text-left p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-sm text-gray-700 hover:text-blue-600"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-6 mb-8">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 shadow-md border border-gray-200'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">KOGA AI</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600">KOGA AI</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">
                  Creating your design...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="sticky bottom-0 pt-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 focus-within:border-blue-400 focus-within:shadow-xl transition-all">
              <textarea
                value={input}
                onChange={handleInputChange}
                onFocus={() => setIsExpanded(true)}
                placeholder="Describe the UI you want to create..."
                className="w-full px-6 py-4 text-sm text-gray-900 placeholder-gray-500 bg-transparent border-none rounded-2xl resize-none focus:outline-none"
                rows={isExpanded ? 3 : 1}
                style={{ minHeight: isExpanded ? '96px' : '56px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>⌘</span>
                  <span>⏎</span>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors shadow-md"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}