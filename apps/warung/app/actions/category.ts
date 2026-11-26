"use server"

import { revalidatePath } from "next/cache"
import { blankToNull, firstIssue, requireOwner, type ActionResult } from "@/lib/guard"
import { categorySchema, type CategoryInput } from "@/lib/validators"

export async function saveCategory(input: CategoryInput): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }

  const owner = await requireOwner()
  if ("error" in owner) return { ok: false, message: owner.error ?? "Profil toko belum dibuat." }

  const payload = { name: parsed.data.name, sort_order: parsed.data.sort_order }

  const { error } = parsed.data.id
    ? await owner.supabase
        .from("categories")
        .update(payload)
        .eq("id", parsed.data.id)
        .eq("store_id", owner.storeId)
    : await owner.supabase
        .from("categories")
        .insert({ ...payload, store_id: owner.storeId })

  if (error) return { ok: false, message: `Gagal menyimpan kategori: ${error.message}` }

  refresh()
  return { ok: true, message: "Kategori tersimpan." }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const owner = await requireOwner()
  if ("error" in owner) return { ok: false, message: owner.error ?? "Profil toko belum dibuat." }

  const { error } = await owner.supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("store_id", owner.storeId)

  if (error) return { ok: false, message: `Gagal menghapus: ${error.message}` }

  refresh()
  return { ok: true, message: "Kategori dihapus. Menunya menjadi tanpa kategori." }
}

function refresh() {
  revalidatePath("/")
  revalidatePath("/dashboard", "layout")
}
