import type { Metadata } from "next"
import { PublicHome } from "@/components/public-home"
import { DemoNotice, SetupRequired } from "@/components/setup-required"
import { getPublicData } from "@/lib/data"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { demoCategories, demoMenu, demoStore } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  if (!isSupabaseConfigured) return {}
  const { store } = await getPublicData()
  if (!store) return {}
  return {
    title: `${store.name} · ${store.address.split(",")[0]}`,
    description: store.tagline ?? `Menu dan lokasi ${store.name}.`,
    openGraph: {
      title: store.name,
      description: store.tagline ?? `Menu dan lokasi ${store.name}.`,
      type: "website",
      locale: "id_ID",
    },
  }
}

export default async function HomePage() {
  if (!isSupabaseConfigured) {
    return (
      <>
        <DemoNotice />
        <PublicHome store={demoStore} categories={demoCategories} menu={demoMenu} />
      </>
    )
  }

  const { store, categories, menu } = await getPublicData()
  if (!store) return <SetupRequired />

  return <PublicHome store={store} categories={categories} menu={menu} />
}
