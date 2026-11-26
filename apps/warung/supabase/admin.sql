-- Admin panel: profile, role, dan kebijakan RLS untuk admin.
-- Jalankan setelah schema.sql di Supabase SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text,
  role text not null default 'seller' check (role in ('admin', 'seller')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_role_active_idx on public.profiles(role, is_active);
create index if not exists profiles_role_created_idx on public.profiles(role, created_at desc);

alter table public.profiles enable row level security;

-- Semua user baru otomatis mendapat profil seller.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), 'seller')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill user yang sudah ada sebelum admin.sql dijalankan.
insert into public.profiles (id, email, role)
select id, coalesce(email, ''), 'seller'
from auth.users
on conflict (id) do nothing;

-- Helper untuk kebijakan RLS. SECURITY DEFINER agar tidak rekursif ke RLS profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- User hanya bisa membaca profilnya sendiri. Tidak ada policy update untuk user,
-- supaya role dan status aktif tidak bisa diubah dari sisi client.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "admin manage profiles" on public.profiles;
create policy "admin manage profiles" on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admin boleh menulis semua data warung.
drop policy if exists "admin write store" on public.store;
create policy "admin write store" on public.store for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin write menu" on public.menu_items;
create policy "admin write menu" on public.menu_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin manage menu images" on storage.objects;
create policy "admin manage menu images" on storage.objects for all
  to authenticated
  using (bucket_id = 'menu-images' and public.is_admin())
  with check (bucket_id = 'menu-images' and public.is_admin());

-- Bootstrap admin pertama. Ganti email dengan akun yang sudah ada di
-- Authentication > Users.
--
-- update public.profiles
-- set role = 'admin'
-- where email = 'admin@warung.id';
