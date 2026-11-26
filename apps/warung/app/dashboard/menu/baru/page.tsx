import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-card"
import { MenuForm } from "@/components/menu-form"
import { SetupStore } from "@/components/dashboard/setup-store"
import { getDashboardData } from "@/lib/data"

export default async function NewMenuPage() {
  const { store, categories } = await getDashboardData()
  if (!store) return <SetupStore />
  return <><Link href="/dashboard/menu" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--green)]"><ArrowLeft className="size-4" /> Kembali ke daftar menu</Link><DashboardHeader eyebrow="Menu baru" title="Tambahkan sajian." description="Berikan detail yang cukup agar pelanggan tahu apa yang akan mereka dapatkan." /><div className="max-w-3xl rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-8"><MenuForm categories={categories} storeId={store.id} /></div></>
}
