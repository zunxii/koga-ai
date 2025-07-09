'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Welcome from '@/components/Welcome';
import Features from '@/components/Features';
import Examples from '@/components/Examples';
import ChatMessages from '@/components/ChatMessages';
import LoadingState from '@/components/LoadingState';
import ChatInput from '@/components/ChatInput';
import FigmaCanvas from '@/components/FigmaCanvas';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [showCanvas, setShowCanvas] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const extractCodeFromResponse = (response: string): string => {
    // Extract TypeScript code from the response
    const codeMatch = response.match(/```(?:typescript|ts|javascript|js)?\n([\s\S]*?)```/);
    if (codeMatch) {
      return codeMatch[1].trim();
    }
    
    // Try to extract from JSON block
    const jsonMatch = response.match(/```json\n([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed.code || '';
      } catch (e) {
        return '';
      }
    }
    
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const generateFigmaCode = async (userMessage: string): Promise<string> => {
    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request was cancelled');
      }
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const assistantResponse = await generateFigmaCode(userMessage);
      
      // Add assistant message
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      // Extract and set the generated code
      const code = extractCodeFromResponse(assistantResponse);
      if (code) {
        setGeneratedCode(code);
        setShowCanvas(true);
      }
    } catch (error: any) {
      // Add error message
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setIsExpanded(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Chat Panel */}
        <div className={`${showCanvas ? 'w-1/2' : 'w-full'} flex flex-col transition-all duration-300`}>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {/* Intro and Features Section */}
            {messages.length === 0 && (
              <>
                <Welcome />
                <Features />
                <Examples onExampleClick={handleExampleClick} />
              </>
            )}

            {/* Chat Messages */}
            <ChatMessages messages={messages} />

            {/* Loading Spinner */}
            {isLoading && <LoadingState />}
          </div>

          {/* Chat Input */}
          <div className="p-4 sm:p-6 lg:p-8 pt-0">
            <ChatInput
              input={input}
              isLoading={isLoading}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Figma Canvas Panel */}
        {showCanvas && (
          <div className="w-1/2 border-l border-gray-200 bg-white">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Design Canvas</h2>
                <button
                  onClick={() => setShowCanvas(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <FigmaCanvas 
                  generatedCode={generatedCode}
                  onCodeExecute={(code) => setGeneratedCode(code)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}