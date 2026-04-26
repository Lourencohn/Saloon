// hooks/useSalons.ts — example data layer using TanStack Query + Supabase
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSalons() {
  return useQuery({
    queryKey: ['salons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('*, services(*), professionals(*)')
        .order('rating', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSalon(id: string) {
  return useQuery({
    queryKey: ['salon', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('*, services(*), professionals(*), reviews(*, profile:profiles(name,avatar_url))')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
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
    enabled: !!lat && !!lng,
  });
}
