export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Row<T> = T;
type Insert<T> = Partial<T>;
type Update<T> = Partial<T>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Row<{
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['profiles']['Row']>;
        Update: Update<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [];
      };
      salons: {
        Row: Row<{
          id: string;
          name: string;
          tagline: string | null;
          about: string | null;
          address: string;
          neighborhood: string | null;
          location: unknown | null;
          hours: Json | null;
          price_tier: number | null;
          badges: string[] | null;
          rating: number | null;
          reviews_count: number | null;
          cover_photo: string | null;
          photos: string[] | null;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['salons']['Row']>;
        Update: Update<Database['public']['Tables']['salons']['Row']>;
        Relationships: [];
      };
      professionals: {
        Row: Row<{
          id: string;
          salon_id: string | null;
          name: string;
          role: string | null;
          avatar_url: string | null;
          rating: number | null;
          reviews_count: number | null;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['professionals']['Row']>;
        Update: Update<Database['public']['Tables']['professionals']['Row']>;
        Relationships: [];
      };
      services: {
        Row: Row<{
          id: string;
          salon_id: string | null;
          category: string;
          name: string;
          description: string | null;
          duration_min: number;
          price_cents: number;
          active: boolean | null;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['services']['Row']>;
        Update: Update<Database['public']['Tables']['services']['Row']>;
        Relationships: [];
      };
      bookings: {
        Row: Row<{
          id: string;
          user_id: string | null;
          salon_id: string | null;
          professional_id: string | null;
          starts_at: string;
          ends_at: string;
          status: Database['public']['Enums']['booking_status'] | null;
          total_cents: number;
          payment_method: Database['public']['Enums']['payment_method'] | null;
          payment_status: Database['public']['Enums']['payment_status'] | null;
          notes: string | null;
          created_at: string | null;
          cancelled_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['bookings']['Row']>;
        Update: Update<Database['public']['Tables']['bookings']['Row']>;
        Relationships: [];
      };
      booking_items: {
        Row: Row<{
          booking_id: string;
          service_id: string;
          price_cents: number;
          duration_min: number;
        }>;
        Insert: Insert<Database['public']['Tables']['booking_items']['Row']>;
        Update: Update<Database['public']['Tables']['booking_items']['Row']>;
        Relationships: [];
      };
      reviews: {
        Row: Row<{
          id: string;
          booking_id: string | null;
          user_id: string | null;
          salon_id: string | null;
          professional_id: string | null;
          rating: number | null;
          tags: string[] | null;
          comment: string | null;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['reviews']['Row']>;
        Update: Update<Database['public']['Tables']['reviews']['Row']>;
        Relationships: [];
      };
      favorites: {
        Row: Row<{
          user_id: string;
          salon_id: string;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['favorites']['Row']>;
        Update: Update<Database['public']['Tables']['favorites']['Row']>;
        Relationships: [];
      };
      availability_slots: {
        Row: Row<{
          id: string;
          professional_id: string | null;
          starts_at: string;
          ends_at: string;
          is_booked: boolean | null;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['availability_slots']['Row']>;
        Update: Update<Database['public']['Tables']['availability_slots']['Row']>;
        Relationships: [];
      };
      notifications: {
        Row: Row<{
          id: string;
          user_id: string | null;
          kind: Database['public']['Enums']['notif_kind'];
          title: string;
          body: string | null;
          payload: Json | null;
          scheduled_for: string | null;
          sent_at: string | null;
          read_at: string | null;
          created_at: string | null;
        }>;
        Insert: Insert<Database['public']['Tables']['notifications']['Row']>;
        Update: Update<Database['public']['Tables']['notifications']['Row']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      nearby_salons: {
        Args: { lat: number; lng: number; km?: number };
        Returns: { id: string; name: string; distance_m: number }[];
      };
    };
    Enums: {
      booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
      payment_method: 'pix' | 'card' | 'at_salon';
      payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
      notif_kind: 'reminder_24h' | 'reminder_1h' | 'year_end' | 'promo' | 'review_request';
    };
    CompositeTypes: Record<string, never>;
  };
};
