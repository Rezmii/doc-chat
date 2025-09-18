import { ApiChatMessage, AIResponse } from '../types';

const API_URL = 'http://192.168.1.9:3001';

export const postChatMessage = async (history: ApiChatMessage[]): Promise<AIResponse> => {
  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ history }),
  });

  if (!response.ok) {
    throw new Error('Błąd serwera AI');
  }

  return response.json();
};
