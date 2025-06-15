import { DoctorFromAPI } from '../types';

const API_URL = 'http://192.168.1.9:3001';

export const getDoctors = async (): Promise<DoctorFromAPI[]> => {
  const response = await fetch(`${API_URL}/api/doctors`);
  if (!response.ok) {
    throw new Error('Błąd sieci podczas pobierania lekarzy.');
  }
  return response.json();
};

export const getDoctorById = async (id: string): Promise<DoctorFromAPI> => {
  const response = await fetch(`${API_URL}/api/doctors/${id}`);
  if (!response.ok) {
    throw new Error('Błąd sieci podczas pobierania profilu lekarza.');
  }
  return response.json();
};
