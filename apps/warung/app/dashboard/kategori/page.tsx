import { DashboardHeader } from "@/components/dashboard-card"
import { CategoryManager } from "@/components/dashboard/category-manager"
import { SetupStore } from "@/components/dashboard/setup-store"
import { getDashboardData } from "@/lib/data"

export default async function CategoryPage() {
  const { store, categories } = await getDashboardData()
  if (!store) return <SetupStore />
  return <><DashboardHeader eyebrow="Kategori" title="Rapikan daftar menu." description="Kategori membantu pelanggan menemukan menu favorit lebih cepat." /><div className="max-w-2xl"><CategoryManager categories={categories} /></div></>
}
