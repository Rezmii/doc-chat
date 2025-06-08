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

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'dr n. med. Anna Kowalska',
    specialty: 'Neurolog',
    rating: 4.9,
    reviews: 128,
    photoUrl:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop',
    nextAvailable: 'Dostępna dzisiaj od 18:00',
    bio: 'Absolwentka Warszawskiego Uniwersytetu Medycznego z 15-letnim doświadczeniem w leczeniu migren i zaburzeń snu. Specjalizuje się w nowoczesnych terapiach bólów głowy.',
  },
  {
    id: '2',
    name: 'lek. Jan Nowak',
    specialty: 'Neurolog',
    rating: 4.8,
    reviews: 97,
    photoUrl:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop',
    nextAvailable: 'Najbliższy termin: jutro',
    bio: 'Doświadczony neurolog z pasją do diagnostyki i leczenia chorób neurodegeneracyjnych, takich jak choroba Parkinsona i stwardnienie rozsiane. Członek Polskiego Towarzystwa Neurologicznego.',
  },
  {
    id: '3',
    name: 'dr Zofia Wiśniewska',
    specialty: 'Neurolog',
    rating: 4.9,
    reviews: 215,
    photoUrl:
      'https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    nextAvailable: 'Dostępna od poniedziałku',
    bio: 'Specjalistka w dziedzinie neurologii dziecięcej. Zajmuje się diagnozowaniem i leczeniem padaczki, ADHD oraz innych zaburzeń rozwojowych u dzieci i młodzieży.',
  },
];
