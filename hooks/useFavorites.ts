import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useFavorites(userId?: string) {
  return useQuery<string[]>({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('salon_id')
        .eq('user_id', userId!);

      if (error) throw error;
      return (data ?? []).map(row => row.salon_id);
    },
    enabled: isSupabaseConfigured() && !!userId,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      salonId,
      favorite,
    }: {
      userId: string;
      salonId: string;
      favorite: boolean;
    }) => {
      if (favorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('salon_id', salonId);
        if (error) throw error;
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, salon_id: salonId });
      if (error) throw error;
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', input.userId] });
    },
  });
}
