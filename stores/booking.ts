// stores/booking.ts — Zustand store for the in-flight booking flow
import { create } from 'zustand';

type BookingDraft = {
  salonId?: string;
  serviceIds: string[];
  professionalId?: string | null;
  startsAt?: string;  // ISO
  paymentMethod?: 'pix' | 'card' | 'at_salon';
  remind: boolean;
};

type BookingStore = BookingDraft & {
  setSalon: (id: string) => void;
  toggleService: (id: string) => void;
  setProfessional: (id: string | null) => void;
  setStartsAt: (iso: string) => void;
  setPayment: (m: BookingDraft['paymentMethod']) => void;
  setRemind: (v: boolean) => void;
  reset: () => void;
};

const initial: BookingDraft = {
  salonId: undefined, serviceIds: [], professionalId: undefined,
  startsAt: undefined, paymentMethod: 'pix', remind: true,
};

export const useBooking = create<BookingStore>((set) => ({
  ...initial,
  setSalon:        (id) => set({ salonId: id, serviceIds: [], professionalId: undefined }),
  toggleService:   (id) => set((s) => ({
    serviceIds: s.serviceIds.includes(id)
      ? s.serviceIds.filter((x) => x !== id)
      : [...s.serviceIds, id],
  })),
  setProfessional: (id) => set({ professionalId: id }),
  setStartsAt:     (iso) => set({ startsAt: iso }),
  setPayment:      (m) => set({ paymentMethod: m }),
  setRemind:       (v) => set({ remind: v }),
  reset:           () => set(initial),
}));
