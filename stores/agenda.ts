// stores/agenda.ts — confirmed bookings persisted to AsyncStorage
// Seeds with the mock BOOKINGS so the empty state isn't blank during dev.
// When Supabase is wired, replace seed/persist with a TanStack Query cache
// over the bookings table.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { BOOKINGS } from '@/constants/mock';
import type { Booking } from '@/types/salon';

type AgendaState = {
  bookings: Booking[];
  hydrated: boolean;
  add: (b: Booking) => void;
  cancel: (id: string) => void;
  markRated: (id: string, rating: number) => void;
  clear: () => void;
  setHydrated: (v: boolean) => void;
};

export const useAgenda = create<AgendaState>()(
  persist(
    (set) => ({
      bookings: BOOKINGS,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      add: (b) =>
        set((s) => ({ bookings: [b, ...s.bookings] })),

      cancel: (id) =>
        set((s) => ({ bookings: s.bookings.filter(b => b.id !== id) })),

      markRated: (id, rating) =>
        set((s) => ({
          bookings: s.bookings.map(b =>
            b.id === id ? { ...b, rated: true, rating } : b,
          ),
        })),

      clear: () => set({ bookings: BOOKINGS }),
    }),
    {
      name: 'saloon-agenda',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ bookings: s.bookings }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
