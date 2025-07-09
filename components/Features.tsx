'use client';

import { MessageSquare, Palette, Code } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: 'Natural Language Design',
      desc: 'Describe your UI in plain English and watch it come to life',
      bg: 'bg-blue-50'
    },
    {
      icon: <Palette className="w-6 h-6 text-green-600" />,
      title: 'Live Figma Integration',
      desc: 'See your designs appear in real-time in Figma workspace',
      bg: 'bg-green-50'
    },
    {
      icon: <Code className="w-6 h-6 text-red-600" />,
      title: 'Production Code Export',
      desc: 'Get clean HTML, CSS, and React code ready for deployment',
      bg: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {features.map(({ icon, title, desc, bg }, idx) => (
        <div key={idx} className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
            {icon}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
      ))}
    </div>
  );
}
