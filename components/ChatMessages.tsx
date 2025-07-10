'use client';

import { Sparkles, Play, Code, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type Props = {
  messages: Message[];
};

export default function ChatMessages({ messages }: Props) {
  const [runningCode, setRunningCode] = useState<string | null>(null);

  const sendToFigma = async (code: string) => {
    setRunningCode(code);
    try {
      if (typeof parent !== 'undefined' && parent.postMessage) {
        parent.postMessage({ 
          pluginMessage: { 
            type: 'run-code', 
            code: code 
          } 
        }, '*');
      } else {
        console.log('Code to run in Figma:', code);
        alert('Code would be sent to Figma plugin');
      }
    } catch (err) {
      console.error('Error sending to Figma:', err);
      alert('Error sending code to Figma');
    } finally {
      setRunningCode(null);
    }
  };

  const extractCode = (content: string | undefined | null) => {
    if (!content || typeof content !== 'string') {
      return null;
    }
    
    try {
      // Look for TypeScript code blocks
      const tsMatch = content.match(/```typescript\n([\s\S]*?)```/);
      if (tsMatch && tsMatch[1]) return tsMatch[1].trim();
      
      // Look for JavaScript code blocks
      const jsMatch = content.match(/```javascript\n([\s\S]*?)```/);
      if (jsMatch && jsMatch[1]) return jsMatch[1].trim();
      
      // Look for generic code blocks
      const codeMatch = content.match(/```\n([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) return codeMatch[1].trim();
      
      return null;
    } catch (error) {
      console.error('Error extracting code:', error);
      return null;
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {messages.map((message) => {
        // Add safety checks for message object
        if (!message || !message.id || !message.role || message.content === undefined) {
          console.warn('Invalid message object:', message);
          return null;
        }

        const isAssistant = message.role === 'assistant';
        const extractedCode = isAssistant ? extractCode(message.content) : null;

        return (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-2xl ${
                isAssistant
                  ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {isAssistant && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">KOGA AI</span>
                </div>
              )}
              
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content || 'No content available'}
              </div>
              
              {isAssistant && extractedCode && (
                <div className="mt-3 flex gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition-colors disabled:opacity-50"
                    onClick={() => sendToFigma(extractedCode)}
                    disabled={runningCode === extractedCode}
                  >
                    {runningCode === extractedCode ? (
                      <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    Run in Figma
                  </button>
                  
                  <button
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(extractedCode);
                      alert('Code copied to clipboard!');
                    }}
                  >
                    <Code className="w-3 h-3" />
                    Copy Code
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }).filter(Boolean)}
    </div>
  );
}
