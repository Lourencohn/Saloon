import type { Booking, Professional, Review, Salon, Service } from '@/types/salon';
import type { Database } from '@/types/database';

type SalonRow = Database['public']['Tables']['salons']['Row'];
type ServiceRow = Database['public']['Tables']['services']['Row'];
type ProfessionalRow = Database['public']['Tables']['professionals']['Row'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];

export function photoSeed(id: string | null | undefined): number {
  if (!id) return 0;
  return Array.from(id).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 24;
}

export function mapSalon(row: SalonRow & { services?: ServiceRow[] | null }): Salon {
  const tier = Math.max(1, Math.min(3, row.price_tier ?? 2));
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline ?? 'Beleza com hora marcada',
    neighborhood: row.neighborhood ?? 'São Paulo',
    distance: 'perto de você',
    rating: Number(row.rating ?? 0),
    reviews: row.reviews_count ?? 0,
    price: '$'.repeat(tier) as Salon['price'],
    waitTime: 'hoje',
    nextSlot: 'Hoje, 15:30',
    badges: row.badges ?? [],
    photoSeed: photoSeed(row.id),
    about: row.about ?? undefined,
    address: row.address,
    hours: hoursLabel(row.hours),
    bookings: row.services?.length,
  };
}

export function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    salonId: row.salon_id ?? '',
    cat: row.category,
    name: row.name,
    dur: row.duration_min,
    price: centsToReais(row.price_cents),
    desc: row.description ?? undefined,
  };
}

export function mapProfessional(row: ProfessionalRow): Professional {
  return {
    id: row.id,
    salonId: row.salon_id ?? '',
    name: row.name,
    role: row.role ?? 'Profissional',
    rating: Number(row.rating ?? 0),
    reviews: row.reviews_count ?? 0,
    photoSeed: photoSeed(row.id),
  };
}

export function mapReview(row: ReviewRow & { profile?: { name: string | null } | null }): Review {
  return {
    name: row.profile?.name ?? 'Cliente Saloon',
    date: relativeDate(row.created_at),
    rating: row.rating ?? 5,
    text: row.comment ?? 'Atendimento avaliado pela cliente.',
    verified: true,
  };
}

export function mapBooking(row: BookingRow & {
  salons?: Pick<SalonRow, 'name' | 'id'> | null;
  professionals?: Pick<ProfessionalRow, 'name'> | null;
  booking_items?: Array<{
    service_id: string;
    services?: Pick<ServiceRow, 'name'> | null;
  }> | null;
  reviews?: Array<Pick<ReviewRow, 'rating'>> | null;
}): Booking {
  const startsAt = row.starts_at;
  const isPast = new Date(startsAt).getTime() < Date.now() || row.status === 'completed';
  const serviceNames = row.booking_items
    ?.map(item => item.services?.name)
    .filter(Boolean)
    .join(' + ');

  return {
    id: row.id,
    salonId: row.salon_id ?? undefined,
    salon: row.salons?.name ?? 'Salão',
    service: serviceNames || 'Serviço',
    pro: row.professionals?.name ?? undefined,
    date: formatShortDate(startsAt),
    time: extractTime(startsAt),
    status: isPast ? 'past' : 'confirmed',
    price: centsToReais(row.total_cents),
    photoSeed: photoSeed(row.salon_id),
    daysAway: daysFromNow(startsAt),
    rated: !!row.reviews?.length,
    rating: row.reviews?.[0]?.rating ?? undefined,
  };
}

export function centsToReais(cents: number): number {
  return Math.round(cents / 100);
}

export function reaisToCents(reais: number): number {
  return Math.round(reais * 100);
}

function hoursLabel(hours: unknown): string | undefined {
  if (hours && typeof hours === 'object' && 'label' in hours) {
    return String((hours as { label?: unknown }).label ?? '');
  }
  return undefined;
}

function relativeDate(iso: string | null): string {
  if (!iso) return 'recentemente';
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return 'hoje';
  if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;
  if (days < 31) return `há ${Math.round(days / 7)} sem`;
  return `há ${Math.round(days / 30)} mês`;
}

const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Hoje';
  const wd = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()];
  return `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function extractTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '15:00';
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function daysFromNow(iso: string): number {
  const target = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000));
}
