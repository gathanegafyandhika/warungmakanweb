# Warung Dashboard — Panduan Instalasi

Aplikasi halaman publik, dashboard penjual, dan panel admin untuk warung makan.
Dibangun dengan Next.js 16 App Router, Supabase, Tailwind CSS v4, dan Leaflet.

## Daftar isi

1. [Persyaratan](#1-persyaratan)
2. [Instalasi lokal](#2-instalasi-lokal)
3. [Setup Supabase](#3-setup-supabase)
4. [Menjalankan aplikasi](#4-menjalankan-aplikasi)
5. [Membuat akun admin](#5-membuat-akun-admin)
6. [Membuat akun penjual](#6-membuat-akun-penjual)
7. [Environment variables](#7-environment-variables)
8. [Deploy ke Vercel](#8-deploy-ke-vercel)
9. [Verifikasi](#9-verifikasi)
10. [Troubleshooting](#10-troubleshooting)
11. [Struktur proyek](#11-struktur-proyek)

## 1. Persyaratan

| Kebutuhan | Versi |
|---|---|
| Node.js | 20.19 atau lebih baru |
| pnpm | 9 atau lebih baru (repo memakai pnpm 10) |
| Akun Supabase | gratis atau berbayar |
| Akun Vercel | opsional, untuk deploy |

Repo ini adalah monorepo pnpm + Turborepo. Aplikasi warung berada di `apps/warung`.

Cek versi:

```bash
node --version
corepack pnpm --version
```

Jika `pnpm` belum tersedia:

```bash
corepack enable
corepack prepare pnpm@10.33.2 --activate
```

## 2. Instalasi lokal

Dari root repository:

```bash
corepack pnpm install
```

Jika ingin menjalankan hanya aplikasi warung:

```bash
cd apps/warung
cp .env.example .env.local
```

Di Windows PowerShell:

```powershell
Copy-Item apps/warung/.env.example apps/warung/.env.local
```

Isi `.env.local` pada langkah [Environment variables](#7-environment-variables).

## 3. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**.
3. Jalankan file `apps/warung/supabase/schema.sql`.
   - Membuat tabel `store`, `categories`, `menu_items`.
   - Mengaktifkan RLS.
   - Membuat bucket Storage `menu-images`.
4. Jalankan file `apps/warung/supabase/admin.sql`.
   - Membuat tabel `profiles`.
   - Membuat role `admin` dan `seller`.
   - Membuat trigger profil otomatis untuk user baru.
   - Menambahkan policy admin.
5. Buka **Authentication → Users**, lalu buat user pertama.
6. Promosikan user tersebut menjadi admin:

```sql
update public.profiles
set role = 'admin'
where email = 'email-admin@example.com';
```

7. Opsional: jalankan `apps/warung/supabase/seed.sql` untuk mengisi contoh toko, kategori, dan menu. Seed memakai user pertama di `auth.users`.

8. Buka **Authentication → Providers → Email**, matikan **Enable signup** jika aplikasi hanya boleh diakses lewat akun yang dibuat admin.

9. Buka **Project Settings → API**, salin:
   - Project URL
   - `anon public` key
   - `service_role` key

> Penting: `service_role` key hanya dipakai di server. Jangan pernah memakai prefix `NEXT_PUBLIC_` atau mengirimnya ke browser.

## 4. Menjalankan aplikasi

Dari root repository:

```bash
corepack pnpm --filter warung dev
```

Atau dari folder aplikasi:

```bash
cd apps/warung
corepack pnpm dev
```

Buka:

```text
http://localhost:3001
```

Halaman penting:

| Halaman | URL |
|---|---|
| Halaman publik | `http://localhost:3001` |
| Login | `http://localhost:3001/login` |
| Dashboard penjual | `http://localhost:3001/dashboard` |
| Panel admin | `http://localhost:3001/admin` |

## 5. Membuat akun admin

Cara paling aman:

1. Buat user di **Supabase Authentication → Users**.
2. Jalankan SQL:

```sql
update public.profiles
set role = 'admin',
    is_active = true
where email = 'email-admin@example.com';
```

3. Login melalui `/login`.
4. Admin otomatis diarahkan ke `/admin`.

Admin dapat membuat akun penjual dari menu **Akun penjual**. Fitur ini membutuhkan `SUPABASE_SERVICE_ROLE_KEY` di server.

## 6. Membuat akun penjual

Lewat panel admin:

1. Login sebagai admin.
2. Buka `/admin/penjual`.
3. Klik **Tambah penjual**.
4. Isi nama, email, dan password.
5. Penjual langsung bisa login.

Atau lewat Supabase:

1. **Authentication → Users → Add user**.
2. Isi email dan password.
3. Profil `seller` dibuat otomatis oleh trigger.
4. Penjual login dan melengkapi profil toko dari `/dashboard/profil`.

## 7. Environment variables

Buat `apps/warung/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

| Variabel | Wajib | Dipakai di | Keterangan |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | Browser + server | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Browser + server | Key publik untuk Auth dan RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya untuk admin | Server saja | Membuat akun penjual dan operasi admin |
| `NEXT_PUBLIC_SITE_URL` | Tidak | Metadata | URL publik aplikasi |

Tanpa `SUPABASE_SERVICE_ROLE_KEY`, panel admin tetap bisa dibuka, tetapi pembuatan akun penjual akan gagal dengan pesan konfigurasi.

Tanpa dua variabel `NEXT_PUBLIC_SUPABASE_*`, halaman publik menampilkan data contoh dan halaman login menampilkan petunjuk setup.

## 8. Deploy ke Vercel

1. Push repository ke GitHub.
2. Di Vercel: **Add New Project** → import repository.
3. **Root Directory**: `apps/warung`.
4. Framework terdeteksi **Next.js**.
5. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://<project>.vercel.app`
6. Klik **Deploy**.
7. Di Supabase **Authentication → URL Configuration**, tambahkan URL Vercel ke:
   - **Site URL**
   - **Redirect URLs**

Jika Vercel tidak mendeteksi workspace pnpm, atur manual:

| Setting | Nilai |
|---|---|
| Install Command | `cd ../.. && corepack pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && corepack pnpm --filter warung build` |
| Output Directory | `.next` |

## 9. Verifikasi

Jalankan dari root repository:

```bash
corepack pnpm --filter warung typecheck
corepack pnpm --filter warung build
```

Cek manual:

- Halaman publik terbuka tanpa login.
- `/dashboard` tanpa login diarahkan ke `/login`.
- Seller dapat mengubah profil, lokasi, menu, dan kategori.
- Admin dapat membuka `/admin`.
- Admin dapat membuat akun penjual.
- Akun penjual nonaktif tidak bisa membuka dashboard.
- `/admin` tidak bisa dibuka oleh seller.

## 10. Troubleshooting

### Halaman menampilkan “Supabase belum terhubung”

`NEXT_PUBLIC_SUPABASE_URL` atau `NEXT_PUBLIC_SUPABASE_ANON_KEY` belum terbaca.
Pastikan file berada di `apps/warung/.env.local`, lalu restart `pnpm dev`.

### Login berhasil tetapi kembali ke halaman login

Jalankan `supabase/admin.sql`. Tanpa tabel `profiles`, pengecekan role gagal.

### “Akses admin diperlukan”

Akun belum berrole admin. Jalankan:

```sql
update public.profiles
set role = 'admin'
where email = 'email-admin@example.com';
```

### Pembuatan penjual gagal

- Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada di environment server.
- Pastikan key yang dipakai adalah `service_role`, bukan `anon`.
- Restart server setelah mengubah `.env.local`.
- Cek log server untuk pesan Supabase.

### Data tidak muncul setelah aksi

- Pastikan RLS sudah aktif dan policy dari `schema.sql` serta `admin.sql` sudah dijalankan.
- Untuk admin, pastikan role profil benar.
- Coba refresh halaman.

### Foto menu gagal diunggah

- Pastikan bucket `menu-images` sudah dibuat oleh `schema.sql`.
- Ukuran maksimal 2 MB.
- Format: JPEG, PNG, atau WebP.

### Port 3001 sudah dipakai

Hentikan proses lain yang memakai port tersebut, atau ubah script `dev` di `apps/warung/package.json`.

## 11. Struktur proyek

```text
apps/warung/
├── app/
│   ├── actions/            # Server Actions: auth, store, menu, kategori, admin
│   ├── admin/              # Panel admin
│   │   ├── penjual/        # Manajemen akun penjual
│   │   └── warung/         # Manajemen data warung
│   ├── dashboard/          # Dashboard penjual
│   ├── login/
│   ├── layout.tsx
│   └── page.tsx            # Halaman publik
├── components/
│   ├── dashboard/
│   ├── admin-*.tsx
│   ├── map-view.tsx
│   └── public-home.tsx
├── lib/
│   ├── supabase/           # client, server, config
│   ├── admin.ts            # Cek role admin dan service-role client
│   ├── admin-data.ts       # Query data admin
│   ├── data.ts
│   ├── validators.ts
│   └── format.ts
├── proxy.ts                # Proteksi /dashboard dan /admin
├── supabase/
│   ├── schema.sql          # Tabel, RLS, storage
│   ├── admin.sql           # Profiles, role, policy admin, index
│   └── seed.sql            # Data contoh
└── .env.example
```

## Catatan keamanan

- Jangan commit `.env.local`.
- Jangan memakai `SUPABASE_SERVICE_ROLE_KEY` di Client Component.
- Jika service-role key pernah dibagikan atau bocor, segera lakukan **Rotate** di Supabase Dashboard.
- Harga disimpan sebagai integer rupiah dan ditampilkan dengan `Intl.NumberFormat("id-ID")`.
- Aplikasi belum memiliki keranjang, pembayaran, atau pemesanan online.
