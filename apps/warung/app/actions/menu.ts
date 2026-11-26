"use server"

import { revalidatePath } from "next/cache"
import { blankToNull, firstIssue, requireOwner, type ActionResult } from "@/lib/guard"
import { menuSchema, type MenuInput } from "@/lib/validators"

export async function saveMenu(input: MenuInput): Promise<ActionResult> {
  const parsed = menuSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }

  const owner = await requireOwner()
  if ("error" in owner) return { ok: false, message: owner.error ?? "Profil toko belum dibuat." }

  const payload = {
    name: parsed.data.name,
    description: blankToNull(parsed.data.description),
    price: parsed.data.price,
    category_id: blankToNull(parsed.data.category_id ?? ""),
    image_url: blankToNull(parsed.data.image_url ?? ""),
    is_available: parsed.data.is_available,
    sort_order: parsed.data.sort_order,
  }

  const { error } = parsed.data.id
    ? await owner.supabase
        .from("menu_items")
        .update(payload)
        .eq("id", parsed.data.id)
        .eq("store_id", owner.storeId)
    : await owner.supabase
        .from("menu_items")
        .insert({ ...payload, store_id: owner.storeId })

  if (error) return { ok: false, message: `Gagal menyimpan menu: ${error.message}` }

  refresh()
  return { ok: true, message: "Menu tersimpan." }
}

export async function deleteMenu(id: string): Promise<ActionResult> {
  const owner = await requireOwner()
  if ("error" in owner) return { ok: false, message: owner.error ?? "Profil toko belum dibuat." }

  const { error } = await owner.supabase
    .from("menu_items")
    .delete()
    .eq("id", id)
    .eq("store_id", owner.storeId)

  if (error) return { ok: false, message: `Gagal menghapus menu: ${error.message}` }

  refresh()
  return { ok: true, message: "Menu dihapus." }
}

function refresh() {
  revalidatePath("/")
  revalidatePath("/dashboard", "layout")
}
