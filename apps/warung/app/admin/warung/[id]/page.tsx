import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-card"
import { StoreForm } from "@/components/store-form"
import { getAdminStore } from "@/lib/admin-data"

export const dynamic = "force-dynamic"

export default async function AdminStoreEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const store = await getAdminStore(id)
  if (!store) notFound()

  return <>
    <Link href="/admin/warung" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--green)]"><ArrowLeft className="size-4" /> Kembali ke data warung</Link>
    <DashboardHeader eyebrow="Edit warung" title={store.name} description="Perubahan di sini langsung tampil di halaman publik." />
    <div className="max-w-3xl rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-8"><StoreForm store={store} adminMode /></div>
  </>
}
