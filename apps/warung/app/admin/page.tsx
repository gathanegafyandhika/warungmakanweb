import Link from "next/link"
import { ArrowRight, CircleCheck, Store, Users, Utensils } from "lucide-react"
import { DashboardHeader, StatCard } from "@/components/dashboard-card"
import { getAdminData } from "@/lib/admin-data"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const data = await getAdminData()
  if (!data) {
    return <div className="rounded-2xl border border-[var(--line)] bg-white p-8 text-sm text-[var(--muted)]">Data admin belum bisa dimuat. Pastikan <code>supabase/admin.sql</code> sudah dijalankan dan akun ini berperan admin.</div>
  }

  const { stats, sellers, stores } = data
  const recentSellers = sellers.slice(0, 5)
  const openStores = stores.filter((store) => store.is_open)

  return (
    <>
      <DashboardHeader eyebrow="Panel admin" title="Semua warung, satu layar." description="Pantau akun penjual, status warung, dan data menu dari panel ini." action={{ href: "/admin/penjual", label: "Kelola penjual" }} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Akun penjual" value={stats.sellers} detail={`${stats.activeSellers} akun aktif`} icon={Users} />
        <StatCard label="Warung" value={stats.stores} detail={`${stats.openStores} sedang buka`} icon={Store} />
        <StatCard label="Menu" value={stats.menus} detail="Total item di semua warung" icon={Utensils} />
        <StatCard label="Warung buka" value={stats.openStores} detail={`dari ${stats.stores} warung terdaftar`} icon={CircleCheck} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-2xl border border-[var(--line)] bg-white">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
            <h2 className="font-bold">Penjual terbaru</h2>
            <Link href="/admin/penjual" className="text-xs font-bold text-[var(--green)] hover:underline">Lihat semua</Link>
          </div>
          {recentSellers.length === 0 ? (
            <div className="p-10 text-center text-sm text-[var(--muted)]">
              Belum ada akun penjual. <Link href="/admin/penjual" className="font-bold text-[var(--green)]">Buat akun pertama</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--line)]">
              {recentSellers.map((seller) => (
                <li key={seller.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{seller.full_name || seller.email}</p>
                    <p className="truncate text-xs text-[var(--muted)]">{seller.store?.name ?? "Belum punya warung"}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${seller.is_active ? "bg-[var(--lime)]/40 text-[var(--green-deep)]" : "bg-red-100 text-red-700"}`}>{seller.is_active ? "Aktif" : "Nonaktif"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl bg-[var(--green)] p-6 text-white">
            <p className="eyebrow text-[var(--lime)]">Warung aktif</p>
            <p className="display mt-3 text-2xl font-bold">{openStores.length} sedang buka</p>
            <p className="mt-2 text-sm text-white/60">{stores.length} warung terdaftar di sistem.</p>
            <Link href="/admin/warung" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--lime)]">Lihat data warung <ArrowRight className="size-4" /></Link>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
            <p className="eyebrow text-[var(--orange)]">Butuh tindakan</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{stats.sellers - stats.activeSellers} akun penjual nonaktif dan {stats.stores - openStores.length} warung sedang tutup.</p>
            <Link href="/admin/penjual" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--green)]">Tinjau akun <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-[var(--line)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-bold">Warung terdaftar</h2>
          <Link href="/admin/warung" className="text-xs font-bold text-[var(--green)] hover:underline">Kelola semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wider text-[var(--muted)]">
              <tr><th className="px-5 py-3 font-bold">Warung</th><th className="px-5 py-3 font-bold">Alamat</th><th className="px-5 py-3 font-bold">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {stores.slice(0, 5).map((store) => (
                <tr key={store.id}>
                  <td className="px-5 py-4 font-semibold">{store.name}</td>
                  <td className="max-w-xs truncate px-5 py-4 text-[var(--muted)]">{store.address}</td>
                  <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${store.is_open ? "bg-[var(--lime)]/40 text-[var(--green-deep)]" : "bg-[var(--cream)] text-[var(--muted)]"}`}>{store.is_open ? "Buka" : "Tutup"}</span></td>
                </tr>
              ))}
              {stores.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-sm text-[var(--muted)]">Belum ada warung.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
