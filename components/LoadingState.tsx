'use client';

import { Sparkles, Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
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
          <span className="text-sm text-gray-600">Creating your design...</span>
        </div>
      </div>
    </div>
  );
}
