export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' 
  isRecommendation?: boolean;
  specializations?: string[];
}

export interface ApiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  reply: string;
  specializations: string[];
}
