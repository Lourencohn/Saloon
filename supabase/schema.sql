-- Saloon — Supabase schema
-- Run in Supabase SQL editor

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists postgis;

-- ─────────────────────────────────────────────────────────────
-- Profiles (extends auth.users)
-- ─────────────────────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz default now()
);
alter table profiles enable row level security;
create policy "users see own profile"   on profiles for select using (auth.uid() = id);
create policy "users insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "users update own profile" on profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $profile_fn$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Cliente'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    avatar_url = excluded.avatar_url;
  return new;
end;
$profile_fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Salons
-- ─────────────────────────────────────────────────────────────
create table salons (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  tagline       text,
  about         text,
  address       text not null,
  neighborhood  text,
  location      geography(point, 4326),
  hours         jsonb,           -- { mon: "09:00-21:00", ... }
  price_tier    int check (price_tier between 1 and 4),
  badges        text[] default '{}',
  rating        numeric(2,1) default 0,
  reviews_count int default 0,
  cover_photo   text,
  photos        text[] default '{}',
  created_at    timestamptz default now()
);
create index salons_location_idx on salons using gist (location);
alter table salons enable row level security;
create policy "salons readable by all" on salons for select using (true);

-- ─────────────────────────────────────────────────────────────
-- Professionals (per salon)
-- ─────────────────────────────────────────────────────────────
create table professionals (
  id          uuid primary key default uuid_generate_v4(),
  salon_id    uuid references salons(id) on delete cascade,
  name        text not null,
  role        text,
  avatar_url  text,
  rating      numeric(2,1) default 0,
  reviews_count int default 0,
  created_at  timestamptz default now()
);
alter table professionals enable row level security;
create policy "pros readable by all" on professionals for select using (true);

-- ─────────────────────────────────────────────────────────────
-- Services (per salon)
-- ─────────────────────────────────────────────────────────────
create table services (
  id          uuid primary key default uuid_generate_v4(),
  salon_id    uuid references salons(id) on delete cascade,
  category    text not null,    -- Cabelo, Unhas, Estética, Combo…
  name        text not null,
  description text,
  duration_min int not null,
  price_cents  int not null,
  active      boolean default true,
  created_at  timestamptz default now()
);
alter table services enable row level security;
create policy "services readable by all" on services for select using (active);

-- Many-to-many: which pros perform which services
create table professional_services (
  professional_id uuid references professionals(id) on delete cascade,
  service_id      uuid references services(id) on delete cascade,
  primary key (professional_id, service_id)
);
alter table professional_services enable row level security;
create policy "prof_services readable by all" on professional_services for select using (true);

-- ─────────────────────────────────────────────────────────────
-- Availability slots (pre-generated; could also be computed)
-- ─────────────────────────────────────────────────────────────
create table availability_slots (
  id              uuid primary key default uuid_generate_v4(),
  professional_id uuid references professionals(id) on delete cascade,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  is_booked       boolean default false,
  created_at      timestamptz default now()
);
create index slots_pro_starts_idx on availability_slots(professional_id, starts_at);
create index slots_starts_idx     on availability_slots(starts_at) where is_booked = false;
alter table availability_slots enable row level security;
create policy "slots readable by all" on availability_slots for select using (true);

-- ─────────────────────────────────────────────────────────────
-- Bookings
-- ─────────────────────────────────────────────────────────────
create type booking_status as enum ('pending','confirmed','completed','cancelled','no_show');
create type payment_method as enum ('pix','card','at_salon');
create type payment_status as enum ('pending','paid','refunded','failed');

create table bookings (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references profiles(id) on delete cascade,
  salon_id        uuid references salons(id),
  professional_id uuid references professionals(id),
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  status          booking_status default 'pending',
  total_cents     int not null,
  payment_method  payment_method,
  payment_status  payment_status default 'pending',
  notes           text,
  created_at      timestamptz default now(),
  cancelled_at    timestamptz
);
create index bookings_user_idx  on bookings(user_id, starts_at desc);
create index bookings_salon_idx on bookings(salon_id, starts_at);
alter table bookings enable row level security;
create policy "users see own bookings"   on bookings for select using (auth.uid() = user_id);
create policy "users create own bookings" on bookings for insert with check (auth.uid() = user_id);
create policy "users update own bookings" on bookings for update using (auth.uid() = user_id);

-- Booking line items (services in this booking)
create table booking_items (
  booking_id uuid references bookings(id) on delete cascade,
  service_id uuid references services(id),
  price_cents int not null,
  duration_min int not null,
  primary key (booking_id, service_id)
);
alter table booking_items enable row level security;
create policy "users see own booking items" on booking_items for select using (
  exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid())
);
create policy "users insert own booking items" on booking_items for insert with check (
  exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid())
);

-- ─────────────────────────────────────────────────────────────
-- Reviews
-- ─────────────────────────────────────────────────────────────
create table reviews (
  id              uuid primary key default uuid_generate_v4(),
  booking_id      uuid references bookings(id) on delete cascade unique,
  user_id         uuid references profiles(id) on delete cascade,
  salon_id        uuid references salons(id),
  professional_id uuid references professionals(id),
  rating          int check (rating between 1 and 5),
  tags            text[] default '{}',
  comment         text,
  created_at      timestamptz default now()
);
alter table reviews enable row level security;
create policy "reviews readable by all"  on reviews for select using (true);
create policy "users insert own reviews" on reviews for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Favorites
-- ─────────────────────────────────────────────────────────────
create table favorites (
  user_id     uuid references profiles(id) on delete cascade,
  salon_id    uuid references salons(id) on delete cascade,
  created_at  timestamptz default now(),
  primary key (user_id, salon_id)
);
alter table favorites enable row level security;
create policy "users see own favs"   on favorites for select using (auth.uid() = user_id);
create policy "users insert own favs" on favorites for insert with check (auth.uid() = user_id);
create policy "users delete own favs" on favorites for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Notifications (year-end reminders, booking reminders)
-- ─────────────────────────────────────────────────────────────
create type notif_kind as enum ('reminder_24h','reminder_1h','year_end','promo','review_request');

create table notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade,
  kind        notif_kind not null,
  title       text not null,
  body        text,
  payload     jsonb,
  scheduled_for timestamptz,
  sent_at     timestamptz,
  read_at     timestamptz,
  created_at  timestamptz default now()
);
create index notif_user_idx on notifications(user_id, created_at desc);
alter table notifications enable row level security;
create policy "users see own notifs" on notifications for select using (auth.uid() = user_id);
create policy "users create own scheduled notifs" on notifications for insert with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────

-- Find salons within N km of (lat, lng), ordered by distance
create or replace function nearby_salons(lat float, lng float, km float default 5)
returns table (id uuid, name text, distance_m float)
language sql stable as $nearby_fn$
  select s.id, s.name, st_distance(s.location, st_makepoint(lng, lat)::geography) as distance_m
  from salons s
  where st_dwithin(s.location, st_makepoint(lng, lat)::geography, km * 1000)
  order by distance_m asc;
$nearby_fn$;

-- Auto-update salon rating when review inserted
create or replace function update_salon_rating()
returns trigger
language plpgsql
as $rating_fn$
begin
  update salons set
    rating        = (select avg(rating)::numeric(2,1) from reviews where salon_id = new.salon_id),
    reviews_count = (select count(*) from reviews where salon_id = new.salon_id)
  where id = new.salon_id;
  return new;
end;
$rating_fn$;
drop trigger if exists trg_review_rating on reviews;
create trigger trg_review_rating after insert on reviews
  for each row execute function update_salon_rating();

-- ─────────────────────────────────────────────────────────────
-- MVP seed data
-- ─────────────────────────────────────────────────────────────
insert into salons (
  id, name, tagline, about, address, neighborhood, location, hours,
  price_tier, badges, rating, reviews_count, cover_photo, photos
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Casa Lavanda',
    'Studio de cabelo & coloração autoral',
    'Studio assinado por Helena Caldeira, referência em loiros naturais e cortes editoriais. Atende com hora marcada em ambiente reservado.',
    'R. Aspicuelta, 478 — Vila Madalena',
    'Vila Madalena',
    st_makepoint(-46.6904, -23.5574)::geography,
    '{"label":"Seg-Sáb · 09h às 21h"}',
    3,
    array['Premium', 'Curadoria Saloon'],
    4.9,
    482,
    null,
    array[]::text[]
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Atelier Âmbar',
    'Beleza integrada — cabelo, unhas, estética',
    'Espaço completo com salas privativas e combos de cabelo + unhas no mesmo horário.',
    'R. Joaquim Floriano, 920 — Itaim',
    'Itaim Bibi',
    st_makepoint(-46.6781, -23.5846)::geography,
    '{"label":"Ter-Dom · 10h às 22h"}',
    2,
    array['Combo', 'Aceita Pix'],
    4.8,
    1207,
    null,
    array[]::text[]
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Mira Beauty',
    'Unhas artísticas e nail care',
    'Especializado em alongamento, nail art autoral e spa para mãos.',
    'R. dos Pinheiros, 312',
    'Pinheiros',
    st_makepoint(-46.6819, -23.5661)::geography,
    '{"label":"Seg-Sex · 10h às 20h"}',
    2,
    array['Nail art'],
    5.0,
    644,
    null,
    array[]::text[]
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Pétala Estética',
    'Skincare clínico & limpeza profunda',
    'Clínica de estética facial com protocolos personalizados e avaliação inicial.',
    'Al. Lorena, 1245 — Jardins',
    'Jardins',
    st_makepoint(-46.6662, -23.5652)::geography,
    '{"label":"Seg-Sáb · 09h às 19h"}',
    3,
    array['Estética'],
    4.8,
    298,
    null,
    array[]::text[]
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Studio Mel',
    'Sobrancelhas & cílios',
    'Design de sobrancelhas, henna, brow lamination e extensão de cílios com atendimento ágil.',
    'R. Cardoso de Almeida, 88',
    'Perdizes',
    st_makepoint(-46.6747, -23.5374)::geography,
    '{"label":"Todos os dias · 10h às 21h"}',
    1,
    array['Rápido'],
    4.7,
    1842,
    null,
    array[]::text[]
  )
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  about = excluded.about,
  address = excluded.address,
  neighborhood = excluded.neighborhood,
  location = excluded.location,
  hours = excluded.hours,
  price_tier = excluded.price_tier,
  badges = excluded.badges,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count;

insert into professionals (id, salon_id, name, role, rating, reviews_count) values
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Helena Caldeira', 'Cabeleireira sênior', 5.0, 312),
  ('aaaaaaaa-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bruna Saito', 'Coloração', 4.9, 188),
  ('aaaaaaaa-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Carolina Reis', 'Cortes & finalização', 4.8, 144),
  ('bbbbbbbb-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Tatiana Bueno', 'Hair stylist', 4.9, 421),
  ('bbbbbbbb-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Yasmin Couto', 'Manicure', 5.0, 612),
  ('cccccccc-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Mirella Tanaka', 'Nail designer', 5.0, 308),
  ('dddddddd-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Patrícia Vidal', 'Esteticista', 4.9, 188),
  ('eeeeeeee-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Mel Andrade', 'Brow artist', 4.8, 921)
on conflict (id) do update set
  salon_id = excluded.salon_id,
  name = excluded.name,
  role = excluded.role,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count;

insert into services (id, salon_id, category, name, description, duration_min, price_cents) values
  ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Cabelo', 'Corte feminino editorial', 'Corte com consultoria de visagismo', 60, 22000),
  ('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Cabelo', 'Coloração loira', 'Mechas, matização e finalização', 180, 58000),
  ('10000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Cabelo', 'Escova progressiva', 'Selante orgânico, sem formol', 120, 42000),
  ('10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Cabelo', 'Hidratação premium', null, 45, 18000),
  ('20000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Combo', 'Cabelo + Unhas (combo)', 'Atendimento simultâneo', 150, 32000),
  ('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Cabelo', 'Escova modeladora', null, 50, 11000),
  ('20000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Unhas', 'Manicure + pedicure', null, 90, 14000),
  ('30000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Unhas', 'Nail art autoral', null, 90, 18000),
  ('30000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Unhas', 'Alongamento em fibra', null, 120, 24000),
  ('40000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'Estética', 'Limpeza de pele profunda', null, 90, 28000),
  ('40000000-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Estética', 'Peeling químico', null, 60, 36000),
  ('50000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Sobrancelha', 'Design + henna', null, 40, 6500),
  ('50000000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'Cílios', 'Lash lifting', null, 60, 18000)
on conflict (id) do update set
  salon_id = excluded.salon_id,
  category = excluded.category,
  name = excluded.name,
  description = excluded.description,
  duration_min = excluded.duration_min,
  price_cents = excluded.price_cents,
  active = true;
