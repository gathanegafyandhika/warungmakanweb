import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getCurrentProfile } from "@/lib/admin"

export const metadata: Metadata = { title: "Masuk" }
export const dynamic = "force-dynamic"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const { redirect: redirectTo, error } = await searchParams

  if (isSupabaseConfigured) {
    const { user, profile } = await getCurrentProfile()
    if (user && profile?.is_active) {
      const fallback = profile.role === "admin" ? "/admin" : "/dashboard"
      const target = redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : fallback
      redirect(target)
    }
  }

  return (
    <main className="grid min-h-screen bg-[var(--paper)] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-[var(--green-deep)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full border-[4rem] border-[var(--lime)]/10" />
        <Link href="/" className="relative display text-2xl font-bold">
          Rasa Nusa<span className="text-[var(--lime)]">.</span>
        </Link>
        <div className="relative max-w-md">
          <p className="eyebrow text-[var(--lime)]">Ruang penjual & admin</p>
          <h1 className="display mt-4 text-5xl font-bold leading-[1.02] tracking-tight">
            Satu tempat untuk mengurus warungmu.
          </h1>
          <p className="mt-6 leading-relaxed text-white/60">
            Ubah menu, atur jam buka, dan perbarui lokasi. Admin juga bisa
            mengelola akun penjual dari sini.
          </p>
        </div>
        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Warung Rasa Nusa
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--green)]"
          >
            <ArrowLeft className="size-4" /> Kembali ke halaman warung
          </Link>
          <h1 className="display text-4xl font-bold tracking-tight">Masuk</h1>
          <p className="mt-2 mb-8 text-sm text-[var(--muted)]">
            Gunakan akun penjual atau admin yang diberikan pengelola.
          </p>

          {error === "inactive" && (
            <div role="alert" className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              Akun ini sedang dinonaktifkan. Hubungi admin.
            </div>
          )}

          {error === "setup" && (
            <div role="alert" className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              Profil akun belum tersedia. Jalankan <code>supabase/admin.sql</code> di Supabase
              lalu coba lagi.
            </div>
          )}

          {isSupabaseConfigured ? (
            <LoginForm redirectTo={redirectTo} />
          ) : (
            <div className="rounded-2xl border border-[var(--line)] bg-white p-5 text-sm leading-relaxed text-[var(--muted)]">
              <p className="font-bold text-[var(--ink)]">Supabase belum terhubung</p>
              <p className="mt-2">
                Isi <code className="rounded bg-[var(--cream)] px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                dan{" "}
                <code className="rounded bg-[var(--cream)] px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                di file <code>.env.local</code>, lalu restart server.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
