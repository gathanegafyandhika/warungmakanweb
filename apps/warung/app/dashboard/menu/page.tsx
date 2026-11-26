import { DashboardHeader } from "@/components/dashboard-card"
import { MenuList } from "@/components/dashboard/menu-list"
import { SetupStore } from "@/components/dashboard/setup-store"
import { getDashboardData } from "@/lib/data"

export default async function MenuPage() {
  const { store, menu, categories } = await getDashboardData()
  if (!store) return <SetupStore />
  return <><DashboardHeader eyebrow="Kelola menu" title="Bikin pelanggan ngiler." description="Tambah menu, atur harga, dan tandai item yang sedang habis." action={{ href: "/dashboard/menu/baru", label: "Tambah menu" }} /><MenuList menu={menu} categories={categories} /></>
}
