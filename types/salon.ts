// types/salon.ts — domain types

export type IconName =
  | 'search' | 'pin' | 'heart' | 'star' | 'clock' | 'calendar' | 'filter'
  | 'arrow' | 'back' | 'close' | 'check' | 'bell' | 'user' | 'home'
  | 'bookmark' | 'scissors' | 'sparkle' | 'flame' | 'diamond' | 'more'
  | 'chevron' | 'chevronD' | 'chevronU' | 'plus' | 'minus' | 'share'
  | 'card' | 'pix' | 'hair' | 'nail' | 'face' | 'brow' | 'lash' | 'spa'
  | 'combo' | 'event';

export type Salon = {
  id: string;
  name: string;
  tagline: string;
  neighborhood: string;
  distance: string;
  rating: number;
  reviews: number;
  price: '$' | '$$' | '$$$';
  waitTime: string;
  nextSlot: string;
  badges: string[];
  photoSeed: number;
  favorite?: boolean;
  bookings?: number;
  about?: string;
  address?: string;
  hours?: string;
};

export type Category = {
  id: string;
  label: string;
  icon: IconName;
};

export type Professional = {
  id: string;
  salonId: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  photoSeed: number;
  fav?: boolean;
};

export type Service = {
  id: string;
  salonId: string;
  cat: string;
  name: string;
  dur: number;     // minutes
  price: number;   // BRL
  desc?: string;
};

export type Booking = {
  id: string;
  salonId?: string;
  salon: string;
  service: string;
  pro?: string;
  date: string;
  time: string;
  status: 'confirmed' | 'past';
  price: number;
  photoSeed: number;
  daysAway?: number;
  isReveillon?: boolean;
  rated?: boolean;
  rating?: number;
};

export type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
  verified?: boolean;
};
