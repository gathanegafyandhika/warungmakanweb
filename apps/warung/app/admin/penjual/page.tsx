import { DashboardHeader } from "@/components/dashboard-card"
import { AdminSellerForm } from "@/components/admin-seller-form"
import { AdminSellerList } from "@/components/admin-seller-list"
import { getAdminData } from "@/lib/admin-data"

export const dynamic = "force-dynamic"

export default async function AdminSellersPage() {
  const data = await getAdminData()
  if (!data) return <p className="text-sm text-[var(--muted)]">Data admin belum tersedia.</p>

  return <>
    <DashboardHeader eyebrow="Manajemen akun" title="Akun penjual." description="Buat akun, pantau status, dan nonaktifkan akses penjual bila diperlukan." action={{ href: "/admin", label: "Kembali ke ringkasan" }} />
    <div className="mb-6"><AdminSellerForm /></div>
    <section className="rounded-2xl border border-[var(--line)] bg-white">
      <div className="border-b border-[var(--line)] px-5 py-4"><h2 className="font-bold">Daftar penjual</h2><p className="mt-1 text-xs text-[var(--muted)]">{data.sellers.length} akun terdaftar.</p></div>
      <AdminSellerList sellers={data.sellers} />
    </section>
  </>
}
