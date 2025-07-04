import { Doctor, ApiChatMessage, AIResponse } from '../types';

const API_URL = 'http://192.168.1.9:3001';

const transformToDoctor = (apiDoctor: any): Doctor => ({
  id: apiDoctor.id,
  name: apiDoctor.user.name,
  email: apiDoctor.user.email,
  specialty: apiDoctor.specialty,
  bio: apiDoctor.bio,
  rating: apiDoctor.rating,
  photoUrl:
    apiDoctor.photoUrl || `https://avatar.iran.liara.run/public/boy?username=${apiDoctor.id}`,
  reviews: 100,
  nextAvailable: 'Dostępny',
});

export const getDoctors = async (specialties?: string[]): Promise<Doctor[]> => {
  let url = `${API_URL}/api/doctors`;
  if (specialties && specialties.length > 0) {
    url += `?specialties=${specialties.join(',')}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Błąd sieci podczas pobierania lekarzy.');
  }
  const apiData = await response.json();

  return apiData.map(transformToDoctor);
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  const response = await fetch(`${API_URL}/api/doctors/${id}`);
  if (!response.ok) {
    throw new Error('Błąd sieci podczas pobierania profilu lekarza.');
  }
  const apiData = await response.json();

  return transformToDoctor(apiData);
};

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
