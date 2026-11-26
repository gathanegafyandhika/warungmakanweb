import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import type { Category, MenuItem, Store } from "@/lib/types"

export type PublicData = {
  store: Store | null
  categories: Category[]
  menu: MenuItem[]
}

const empty: PublicData = { store: null, categories: [], menu: [] }

export const getPublicData = cache(async (): Promise<PublicData> => {
  if (!isSupabaseConfigured) return empty

  const supabase = await createClient()

  const { data: store } = await supabase
    .from("store")
    .select("*")
    .order("updated_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!store) return empty

  const [{ data: categories }, { data: menu }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, sort_order")
      .eq("store_id", store.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select(
        "id, category_id, name, description, price, image_url, is_available, sort_order",
      )
      .eq("store_id", store.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ])

  return {
    store: store as Store,
    categories: (categories ?? []) as Category[],
    menu: (menu ?? []) as MenuItem[],
  }
})

export async function getSession() {
  if (!isSupabaseConfigured) return { user: null, store: null }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { user: null, store: null }

  const { data: store } = await supabase
    .from("store")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle()

  return { user, store: store as Store | null }
}

export async function getDashboardData() {
  const { user, store } = await getSession()
  if (!user || !store) return { user, store, categories: [], menu: [] }

  const supabase = await createClient()

  const [{ data: categories }, { data: menu }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, sort_order")
      .eq("store_id", store.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select(
        "id, category_id, name, description, price, image_url, is_available, sort_order",
      )
      .eq("store_id", store.id)
      .order("sort_order", { ascending: true }),
  ])

  return {
    user,
    store,
    categories: (categories ?? []) as Category[],
    menu: (menu ?? []) as MenuItem[],
  }
}
