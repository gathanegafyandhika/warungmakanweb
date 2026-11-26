import Link from "next/link"
import { ArrowRight, CircleCheck, CircleSlash, Tags, Utensils } from "lucide-react"
import { DashboardHeader, StatCard } from "@/components/dashboard-card"
import { SetupStore } from "@/components/dashboard/setup-store"
import { getDashboardData } from "@/lib/data"
import { formatRupiah } from "@/lib/format"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  if (!isSupabaseConfigured) return <SetupStore />

  const { store, categories, menu } = await getDashboardData()
  if (!store) return <SetupStore />

  const available = menu.filter((item) => item.is_available).length
  const cheapest = menu.length ? Math.min(...menu.map((item) => item.price)) : 0

  return (
    <>
      <DashboardHeader
        eyebrow="Ringkasan"
        title={`Selamat datang, ${store.name}.`}
        description="Semua yang pelanggan lihat di halaman publik diatur dari sini."
        action={{ href: "/dashboard/menu/baru", label: "Tambah menu" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total menu" value={menu.length} detail="Semua item di daftar menu" icon={Utensils} />
        <StatCard label="Tersedia" value={available} detail={`${menu.length - available} item ditandai habis`} icon={CircleCheck} />
        <StatCard label="Kategori" value={categories.length} detail="Pengelompokan menu" icon={Tags} />
        <StatCard label="Harga terendah" value={cheapest ? formatRupiah(cheapest) : "—"} detail="Dari menu yang ada" icon={CircleSlash} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-2xl border border-[var(--line)] bg-white">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <h2 className="font-bold">Menu terbaru</h2>
            <Link href="/dashboard/menu" className="text-xs font-bold text-[var(--green)] hover:underline">Lihat semua</Link>
          </div>
          {menu.length === 0 ? (
            <div className="p-10 text-center text-sm text-[var(--muted)]">
              Belum ada menu. <Link href="/dashboard/menu/baru" className="font-bold text-[var(--green)]">Tambahkan menu pertama</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--line)]">
              {menu.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-[var(--muted)]">{categories.find((c) => c.id === item.category_id)?.name ?? "Tanpa kategori"}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-bold text-[var(--orange)]">{formatRupiah(item.price)}</span>
                    <span className={`h-2 w-2 rounded-full ${item.is_available ? "bg-[var(--green)]" : "bg-[var(--orange)]"}`} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl bg-[var(--green)] p-6 text-white">
            <p className="eyebrow text-[var(--lime)]">Status toko</p>
            <p className="display mt-3 text-2xl font-bold">{store.is_open ? "Sedang buka" : "Sedang tutup"}</p>
            <p className="mt-2 text-sm text-white/60">{store.opening_hours}</p>
            <Link href="/dashboard/profil" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--lime)]">Ubah status <ArrowRight className="size-4" /></Link>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <p className="eyebrow text-[var(--orange)]">Lokasi</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{store.address}</p>
            <Link href="/dashboard/lokasi" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--green)]">Atur titik peta <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </div>
    </>
  )
}
