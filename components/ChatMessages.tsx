import { Sparkles } from 'lucide-react';
import { Message } from '@/app/page';

type Props = {
  messages: Message[];
};

export default function ChatMessages({ messages }: Props) {
  const sendToFigma = (json: string) => {
    try {
      const msg = JSON.parse(json);
      parent.postMessage({ pluginMessage: msg }, '*');
    } catch (err) {
      alert('Invalid JSON command.');
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {messages.map((message, index) => {
        const isAssistant = message.role === 'assistant';
        const jsonMatch = message.content.match(/```json\n([\s\S]*?)```/);

        return (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
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
                {message.content}
              </div>
              {isAssistant && jsonMatch && (
                <button
                  className="mt-2 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
                  onClick={() => sendToFigma(jsonMatch[1])}
                >
                  ▶️ Run in Figma
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}