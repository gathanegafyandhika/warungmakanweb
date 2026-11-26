import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-card"
import { MenuForm } from "@/components/menu-form"
import { SetupStore } from "@/components/dashboard/setup-store"
import { getDashboardData } from "@/lib/data"

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { store, menu, categories } = await getDashboardData()
  if (!store) return <SetupStore />
  const item = menu.find((menuItem) => menuItem.id === id)
  if (!item) notFound()
  return <><Link href="/dashboard/menu" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--green)]"><ArrowLeft className="size-4" /> Kembali ke daftar menu</Link><DashboardHeader eyebrow="Ubah menu" title={item.name} description="Perbarui harga, deskripsi, foto, atau ketersediaan menu ini." /><div className="max-w-3xl rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-8"><MenuForm item={item} categories={categories} storeId={store.id} /></div></>
}
