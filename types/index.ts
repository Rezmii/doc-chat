export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  bio: string;
  rating: number;
  photoUrl: string;
  reviews: number;
  nextAvailable: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'doctor';
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
