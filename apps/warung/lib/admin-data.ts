import { requireAdmin } from "@/lib/admin"
import type { Store, UserProfile } from "@/lib/types"

export type AdminSeller = UserProfile & {
  store: Pick<Store, "id" | "name" | "is_open" | "address"> | null
}

export type AdminStore = Pick<Store, "id" | "owner_id" | "name" | "address" | "is_open">

export type AdminStats = {
  sellers: number
  activeSellers: number
  stores: number
  openStores: number
  menus: number
}

export async function getAdminStore(storeId: string) {
  const admin = await requireAdmin()
  if ("error" in admin) return null

  const { data } = await admin.supabase.from("store").select("*").eq("id", storeId).maybeSingle()
  return (data as Store | null) ?? null
}

export async function getAdminData() {
  const admin = await requireAdmin()
  if ("error" in admin) return null

  const supabase = admin.supabase
  const [{ data: profiles }, { data: stores }, { count: menuCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active, created_at")
      .eq("role", "seller")
      .order("created_at", { ascending: false }),
    supabase
      .from("store")
      .select("id, owner_id, name, address, is_open")
      .order("updated_at", { ascending: false }),
    supabase.from("menu_items").select("id", { count: "exact", head: true }),
  ])

  const storesByOwner = new Map((stores ?? []).map((store) => [store.owner_id, store]))
  const sellers = (profiles ?? []).map((profile) => ({
    ...(profile as UserProfile),
    store: storesByOwner.get(profile.id) ?? null,
  })) as AdminSeller[]

  return {
    sellers,
    stores: (stores ?? []) as AdminStore[],
    stats: {
      sellers: sellers.length,
      activeSellers: sellers.filter((seller) => seller.is_active).length,
      stores: (stores ?? []).length,
      openStores: (stores ?? []).filter((store) => store.is_open).length,
      menus: menuCount ?? 0,
    } satisfies AdminStats,
  }
}
