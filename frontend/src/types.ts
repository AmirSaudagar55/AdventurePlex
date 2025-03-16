export interface Activity {
  id: string;
  name: string;
  category: 'prime' | 'studio' | 'union' | 'junior' | 'pixel' | 'social';
  price: number;
  duration: number;
  minAge: number;
  maxParticipants: number;
  image: string;
  description: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: 'prime' | 'studio' | 'union' | 'junior' | 'pixel' | 'social';
  description: string;
  image: string;
  color: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  activityId: string;
  date: string;
  timeSlot: string;
  participants: number;
  totalPrice: number;
}