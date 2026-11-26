-- Contoh data awal: 1 toko, 3 kategori, 8 menu.
-- Jalankan setelah membuat satu user penjual di Supabase Authentication.
-- Script memakai user pertama yang ada di auth.users sebagai pemilik toko.

do $$
declare
  owner uuid;
  sid uuid;
  cat_makanan uuid;
  cat_lauk uuid;
  cat_minum uuid;
begin
  select id into owner from auth.users order by created_at asc limit 1;

  if owner is null then
    raise notice 'Belum ada user di auth.users. Buat user penjual dulu, lalu jalankan ulang seed ini.';
    return;
  end if;

  insert into public.store (
    owner_id, name, tagline, address, latitude, longitude,
    whatsapp, instagram, opening_hours, is_open
  )
  values (
    owner,
    'Warung Rasa Nusa',
    'Masakan rumahan, rasa yang selalu dirindukan.',
    'Jl. Ijen No. 18, Klojen, Kota Malang',
    -7.9771,
    112.6341,
    '6281234567890',
    'warungrasanusa',
    'Senin–Sabtu · 07.00–20.00',
    true
  )
  on conflict (owner_id) do nothing;

  select id into sid from public.store where owner_id = owner;

  if exists (select 1 from public.categories where store_id = sid) then
    raise notice 'Data menu sudah ada. Seed dilewati.';
    return;
  end if;

  insert into public.categories (store_id, name, sort_order)
  values (sid, 'Makanan', 1) returning id into cat_makanan;

  insert into public.categories (store_id, name, sort_order)
  values (sid, 'Lauk', 2) returning id into cat_lauk;

  insert into public.categories (store_id, name, sort_order)
  values (sid, 'Minuman', 3) returning id into cat_minum;

  insert into public.menu_items
    (store_id, category_id, name, description, price, image_url, is_available, sort_order)
  values
    (sid, cat_makanan, 'Nasi Campur Nusa', 'Nasi hangat, ayam suwir, telur bumbu bali, dan sambal.', 18000, null, true, 1),
    (sid, cat_makanan, 'Nasi Goreng Kampung', 'Nasi goreng dengan ikan asin, kangkung, dan telur mata sapi.', 17000, null, true, 2),
    (sid, cat_makanan, 'Mie Goreng Jawa', 'Mie kuning dengan bumbu bawang, kol, dan ayam.', 15000, null, true, 3),
    (sid, cat_lauk, 'Ayam Goreng Kremes', 'Ayam ungkep gurih dengan kremesan renyah dan lalapan.', 22000, null, true, 4),
    (sid, cat_lauk, 'Tempe Mendoan', 'Tempe tipis berbalut adonan, digoreng setengah matang.', 8000, null, true, 5),
    (sid, cat_lauk, 'Perkedel Kentang', 'Dua potong perkedel kentang goreng.', 6000, null, true, 6),
    (sid, cat_minum, 'Es Teh Jawa', 'Teh melati dingin dengan gula batu.', 5000, null, true, 7),
    (sid, cat_minum, 'Jeruk Peras', 'Jeruk peras segar, bisa panas atau dingin.', 7000, null, false, 8);

  raise notice 'Seed selesai: 3 kategori dan 8 menu ditambahkan.';
end $$;
