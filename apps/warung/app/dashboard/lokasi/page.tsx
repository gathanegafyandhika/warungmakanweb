import { DashboardHeader } from "@/components/dashboard-card"
import { LocationPicker } from "@/components/location-picker"
import { SetupStore } from "@/components/dashboard/setup-store"
import { getDashboardData } from "@/lib/data"

export default async function LocationPage() {
  const { store } = await getDashboardData()
  if (!store) return <SetupStore />
  return <><DashboardHeader eyebrow="Lokasi toko" title="Biar pelanggan mudah menemukanmu." description="Atur titik lokasi dengan presisi. Koordinat ini dipakai untuk peta dan tombol Google Maps." /><div className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-8"><LocationPicker store={store} /></div></>
}
