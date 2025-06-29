export interface DoctorFromAPI {
  id: string;
  specialty: string;
  bio: string;
  rating: number;
  photoUrl: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  photoUrl: string;
  nextAvailable: string;
  bio: string;
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
