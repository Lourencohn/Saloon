import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mapBooking, reaisToCents } from '@/lib/salon-mappers';
import type { Booking, Service } from '@/types/salon';

type CreateBookingInput = {
  userId: string;
  salonId: string;
  professionalId?: string | null;
  startsAt: string;
  services: Service[];
  paymentMethod: 'pix' | 'card' | 'at_salon';
  remind: boolean;
};

type CreateReviewInput = {
  bookingId: string;
  userId: string;
  salonId?: string;
  professionalId?: string | null;
  rating: number;
  tags: string[];
  comment?: string;
};

export function useBookings(userId?: string) {
  return useQuery<Booking[]>({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          salons(id,name),
          professionals(name),
          booking_items(service_id, services(name)),
          reviews(rating)
        `)
        .eq('user_id', userId!)
        .order('starts_at', { ascending: false });

      if (error) throw error;
      return ((data ?? []) as any[]).map(mapBooking);
    },
    enabled: isSupabaseConfigured() && !!userId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!input.services.length) throw new Error('Selecione ao menos um serviço.');

      const totalMinutes = input.services.reduce((sum, service) => sum + service.dur, 0);
      const totalCents = input.services.reduce((sum, service) => sum + reaisToCents(service.price), 0);
      const endsAt = addMinutes(input.startsAt, totalMinutes);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: input.userId,
          salon_id: input.salonId,
          professional_id: input.professionalId ?? null,
          starts_at: input.startsAt,
          ends_at: endsAt,
          status: 'confirmed',
          total_cents: totalCents,
          payment_method: input.paymentMethod,
          payment_status: input.paymentMethod === 'at_salon' ? 'pending' : 'paid',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      const { error: itemsError } = await supabase
        .from('booking_items')
        .insert(input.services.map(service => ({
          booking_id: booking.id,
          service_id: service.id,
          price_cents: reaisToCents(service.price),
          duration_min: service.dur,
        })));

      if (itemsError) throw itemsError;

      if (input.remind) {
        await supabase.from('notifications').insert([
          {
            user_id: input.userId,
            kind: 'reminder_24h',
            title: 'Seu horário é amanhã',
            body: 'A gente te lembra para chegar com calma.',
            payload: { booking_id: booking.id },
            scheduled_for: addMinutes(input.startsAt, -24 * 60),
          },
          {
            user_id: input.userId,
            kind: 'reminder_1h',
            title: 'Seu horário está chegando',
            body: 'Falta 1 hora para o seu atendimento.',
            payload: { booking_id: booking.id },
            scheduled_for: addMinutes(input.startsAt, -60),
          },
        ]);
      }

      return booking.id;
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', input.userId] });
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const { error } = await supabase
        .from('reviews')
        .insert({
          booking_id: input.bookingId,
          user_id: input.userId,
          salon_id: input.salonId,
          professional_id: input.professionalId ?? null,
          rating: input.rating,
          tags: input.tags,
          comment: input.comment?.trim() || null,
        });

      if (error) throw error;
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', input.userId] });
      if (input.salonId) queryClient.invalidateQueries({ queryKey: ['salon', input.salonId] });
    },
  });
}

function addMinutes(iso: string, minutes: number): string {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}
