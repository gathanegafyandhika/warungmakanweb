import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--paper)] px-6 text-center">
      <p className="eyebrow text-[var(--orange)]">404</p>
      <h1 className="display text-4xl font-bold">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-sm text-[var(--muted)]">
        Sepertinya tautannya salah atau halaman sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)]"
      >
        Kembali ke halaman warung
      </Link>
    </main>
  )
}
