import { createClient } from "@/lib/supabase/server"

export type ActionResult = { ok: boolean; message: string }

export async function requireOwner() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Sesi berakhir. Silakan login ulang." as const }

  const { data: store } = await supabase
    .from("store")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle()

  if (!store) return { error: "Profil toko belum dibuat." as const }

  return { supabase, user, storeId: store.id as string }
}

export function firstIssue(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Data tidak valid."
}

export const blankToNull = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}
