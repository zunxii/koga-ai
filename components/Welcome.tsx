'use client';

import { Zap } from 'lucide-react';

export default function Welcome() {
  return (
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
    </div>
  );
}
