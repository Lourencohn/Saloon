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
create policy "users update own profile" on profiles for update using (auth.uid() = id);

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
create policy "users manage own favs" on favorites for all using (auth.uid() = user_id);

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

-- ─────────────────────────────────────────────────────────────
-- Helpers
-- ─────────────────────────────────────────────────────────────

-- Find salons within N km of (lat, lng), ordered by distance
create or replace function nearby_salons(lat float, lng float, km float default 5)
returns table (id uuid, name text, distance_m float)
language sql stable as $$
  select s.id, s.name, st_distance(s.location, st_makepoint(lng, lat)::geography) as distance_m
  from salons s
  where st_dwithin(s.location, st_makepoint(lng, lat)::geography, km * 1000)
  order by distance_m asc;
$$;

-- Auto-update salon rating when review inserted
create or replace function update_salon_rating()
returns trigger language plpgsql as $$
begin
  update salons set
    rating        = (select avg(rating)::numeric(2,1) from reviews where salon_id = new.salon_id),
    reviews_count = (select count(*) from reviews where salon_id = new.salon_id)
  where id = new.salon_id;
  return new;
end $$;
create trigger trg_review_rating after insert on reviews
  for each row execute function update_salon_rating();
