export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  filePath?: string;
  codeGenerated?: boolean;
}

export const createMessage = (
  role: 'user' | 'assistant',
  content: string,
  id?: string
): Message => ({
  id: id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
  role,
  content: content || '',
  timestamp: Date.now(),
});