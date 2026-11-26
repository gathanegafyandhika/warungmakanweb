import Link from "next/link"
import { Database, ExternalLink, KeyRound } from "lucide-react"

export function DemoNotice() {
  return (
    <div className="bg-[var(--lime)] px-5 py-2.5 text-center text-xs font-bold text-[var(--green-deep)]">
      Mode contoh — Supabase belum dihubungkan. Data di bawah bukan data asli.
    </div>
  )
}

export function SetupRequired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-[var(--line)] bg-white p-8">
        <p className="eyebrow text-[var(--orange)]">Langkah awal</p>
        <h1 className="display mt-3 text-3xl font-bold tracking-tight">
          Hubungkan Supabase dulu
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          Supabase sudah terisi kredensial, tetapi tabel toko belum punya data.
          Ikuti langkah ini:
        </p>
        <ol className="mt-6 space-y-4 text-sm">
          <li className="flex gap-3">
            <Database className="mt-0.5 size-4 shrink-0 text-[var(--green)]" />
            <span>
              Jalankan <code className="rounded bg-[var(--cream)] px-1.5 py-0.5">supabase/schema.sql</code>{" "}
              di SQL Editor Supabase.
            </span>
          </li>
          <li className="flex gap-3">
            <KeyRound className="mt-0.5 size-4 shrink-0 text-[var(--green)]" />
            <span>
              Buat satu user penjual di <strong>Authentication → Users</strong>, lalu
              masuk lewat <Link href="/login" className="font-bold text-[var(--green)] underline">/login</Link>.
            </span>
          </li>
          <li className="flex gap-3">
            <ExternalLink className="mt-0.5 size-4 shrink-0 text-[var(--green)]" />
            <span>
              Dari dashboard, klik <strong>Buat profil toko</strong> atau jalankan{" "}
              <code className="rounded bg-[var(--cream)] px-1.5 py-0.5">supabase/seed.sql</code>.
            </span>
          </li>
        </ol>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)]"
        >
          Masuk sebagai penjual
        </Link>
      </div>
    </main>
  )
}
