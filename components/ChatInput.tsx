'use client';

import { Send } from 'lucide-react';

type Props = {
  input: string;
  isLoading: boolean;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ChatInput({ input, isLoading, isExpanded, setIsExpanded, onChange, onSubmit }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="sticky bottom-0 pt-4">
      <form onSubmit={onSubmit} className="relative">
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 focus-within:border-blue-400 focus-within:shadow-xl transition-all">
          <textarea
            value={input}
            onChange={onChange}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
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
  );
}