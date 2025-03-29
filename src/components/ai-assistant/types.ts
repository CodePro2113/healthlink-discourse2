
import { ChatMessage } from '@/utils/aiService';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIModel {
  id: string;
  name: string;
}

export type { ChatMessage };
