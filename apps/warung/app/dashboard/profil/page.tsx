import { DashboardHeader } from "@/components/dashboard-card"
import { StoreForm } from "@/components/store-form"
import { SetupStore } from "@/components/dashboard/setup-store"
import { getDashboardData } from "@/lib/data"

export default async function ProfilePage() {
  const { store } = await getDashboardData()
  if (!store) return <SetupStore />
  return <><DashboardHeader eyebrow="Profil toko" title="Cerita tentang tokomu." description="Informasi ini muncul di halaman publik agar pelanggan tahu harus mencari apa dan datang ke mana." /><div className="max-w-3xl rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-8"><StoreForm store={store} /></div></>
}
