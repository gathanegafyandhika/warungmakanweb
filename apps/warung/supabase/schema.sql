-- Warung Makan Dashboard
-- Run this file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.store (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  tagline text,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  whatsapp text,
  instagram text,
  opening_hours text,
  is_open boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint store_lat_range check (latitude between -90 and 90),
  constraint store_lng_range check (longitude between -180 and 180),
  constraint store_owner_unique unique (owner_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.store(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  constraint categories_name_not_empty check (length(trim(name)) > 0)
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.store(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price integer not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint menu_name_not_empty check (length(trim(name)) > 0)
);

create index if not exists categories_store_sort_idx on public.categories(store_id, sort_order);
create index if not exists menu_items_store_sort_idx on public.menu_items(store_id, sort_order, created_at);

alter table public.store enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

-- Public visitors can read the public shop data.
drop policy if exists "public read store" on public.store;
create policy "public read store" on public.store for select using (true);

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read menu" on public.menu_items;
create policy "public read menu" on public.menu_items for select using (true);

-- Only the shop owner can insert, update, or delete their records.
drop policy if exists "owner write store" on public.store;
create policy "owner write store" on public.store for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "owner write categories" on public.categories;
create policy "owner write categories" on public.categories for all
  using (exists (
    select 1 from public.store s
    where s.id = store_id and s.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.store s
    where s.id = store_id and s.owner_id = auth.uid()
  ));

drop policy if exists "owner write menu" on public.menu_items;
create policy "owner write menu" on public.menu_items for all
  using (exists (
    select 1 from public.store s
    where s.id = store_id and s.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.store s
    where s.id = store_id and s.owner_id = auth.uid()
  ));

-- Storage bucket for menu photos. Create it once; files are publicly readable.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read menu images" on storage.objects;
create policy "public read menu images" on storage.objects for select
  using (bucket_id = 'menu-images');

drop policy if exists "authenticated upload menu images" on storage.objects;
create policy "authenticated upload menu images" on storage.objects for insert
  to authenticated with check (bucket_id = 'menu-images');

drop policy if exists "authenticated update menu images" on storage.objects;
create policy "authenticated update menu images" on storage.objects for update
  to authenticated using (bucket_id = 'menu-images');

drop policy if exists "authenticated delete menu images" on storage.objects;
create policy "authenticated delete menu images" on storage.objects for delete
  to authenticated using (bucket_id = 'menu-images');

-- Example seed (replace the email with the real Supabase Auth user UUID).
-- insert into public.store (owner_id, name, tagline, address, latitude, longitude, whatsapp, opening_hours)
-- values ('USER_UUID_HERE', 'Warung Rasa Nusa', 'Masakan rumahan, rasa yang selalu dirindukan.', 'Jl. Ijen No. 18, Klojen, Kota Malang', -7.9771, 112.6341, '6281234567890', 'Senin–Sabtu · 07.00–20.00');
