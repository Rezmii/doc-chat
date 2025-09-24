import { ApiChatMessage, AIResponse } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const postChatMessage = async (history: ApiChatMessage[]): Promise<AIResponse> => {
  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ history }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      const errorText = await response.text();
      throw new Error(errorText || 'Przekroczono limit zapytań.');
    }
    throw new Error('Błąd serwera AI');
  }

  return response.json();
};
