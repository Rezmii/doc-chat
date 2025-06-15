export interface DoctorFromAPI {
  id: string;
  specialty: string;
  bio: string;
  rating: number;
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
