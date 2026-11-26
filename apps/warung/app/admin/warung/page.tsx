import Link from "next/link"
import { ArrowRight, MapPin, Pencil } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-card"
import { AdminDeleteStore } from "@/components/admin-delete-store"
import { getAdminData } from "@/lib/admin-data"

export const dynamic = "force-dynamic"

export default async function AdminStoresPage() {
  const data = await getAdminData()
  if (!data) return <p className="text-sm text-[var(--muted)]">Data admin belum tersedia.</p>

  const { stores, sellers } = data
  const sellerByOwner = new Map(sellers.map((seller) => [seller.id, seller]))

  return <>
    <DashboardHeader eyebrow="Data warung" title="Semua warung." description="Tinjau alamat, status buka, dan pemilik setiap warung. Admin dapat memperbaiki data langsung." action={{ href: "/admin", label: "Kembali ke ringkasan" }} />

    {stores.length === 0 ? (
      <div className="rounded-2xl border border-[var(--line)] bg-white p-10 text-center text-sm text-[var(--muted)]">Belum ada warung. Minta penjual membuat profil toko dari dashboard mereka.</div>
    ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {stores.map((store) => {
          const seller = sellerByOwner.get(store.owner_id)
          return <article key={store.id} className="rounded-2xl border border-[var(--line)] bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0"><h2 className="truncate font-bold">{store.name}</h2><p className="mt-1 truncate text-xs text-[var(--muted)]">{seller?.full_name || seller?.email || "Pemilik tidak dikenal"}</p></div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${store.is_open ? "bg-[var(--lime)]/40 text-[var(--green-deep)]" : "bg-[var(--cream)] text-[var(--muted)]"}`}>{store.is_open ? "Buka" : "Tutup"}</span>
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm text-[var(--muted)]"><MapPin className="mt-0.5 size-4 shrink-0 text-[var(--orange)]" /> {store.address}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href={`/admin/warung/${store.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--green)] px-3 py-2 text-xs font-bold text-white transition hover:bg-[var(--green-deep)]"><Pencil className="size-3" /> Edit data</Link>
              <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-[var(--green)]">Halaman publik <ArrowRight className="size-3" /></Link>
              <span className="ml-auto"><AdminDeleteStore storeId={store.id} name={store.name} /></span>
            </div>
          </article>
        })}
      </div>
    )}
  </>
}
