// hooks/useSalons.ts — example data layer using TanStack Query + Supabase
import { useQuery } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mapProfessional, mapReview, mapSalon, mapService } from '@/lib/salon-mappers';
import type { Professional, Review, Salon, Service } from '@/types/salon';

type SalonDetails = Salon & {
  services: Service[];
  professionals: Professional[];
  reviews: Review[];
};

export function useSalons() {
  return useQuery<Salon[]>({
    queryKey: ['salons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('*, services(*)')
        .order('rating', { ascending: false });
      if (error) throw error;
      return ((data ?? []) as any[]).map(row => mapSalon(row));
    },
    enabled: isSupabaseConfigured(),
  });
}

export function useSalon(id: string) {
  return useQuery<SalonDetails>({
    queryKey: ['salon', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('*, services(*), professionals(*), reviews(*, profile:profiles(name,avatar_url))')
        .eq('id', id)
        .single();
      if (error) throw error;
      const row = data as any;
      return {
        ...mapSalon(row),
        services: (row.services ?? []).map(mapService),
        professionals: (row.professionals ?? []).map(mapProfessional),
        reviews: (row.reviews ?? []).map(mapReview),
      };
    },
    enabled: isSupabaseConfigured() && !!id,
  });
}

export function useNearbySalons(lat: number, lng: number, km = 5) {
  return useQuery({
    queryKey: ['salons', 'nearby', lat, lng, km],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('nearby_salons', { lat, lng, km });
      if (error) throw error;
      return data;
    },
    enabled: isSupabaseConfigured() && !!lat && !!lng,
  });
}
