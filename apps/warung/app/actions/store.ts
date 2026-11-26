"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { blankToNull, firstIssue, type ActionResult } from "@/lib/guard"
import { storeSchema, type StoreInput } from "@/lib/validators"

function revalidatePublic() {
  revalidatePath("/")
  revalidatePath("/dashboard")
}

export async function createStore(): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, message: "Sesi berakhir. Silakan login ulang." }

  const { data: existing } = await supabase
    .from("store")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle()

  if (existing) return { ok: true, message: "Profil toko sudah ada." }

  const { error } = await supabase.from("store").insert({
    owner_id: user.id,
    name: "Warung Baru",
    tagline: "Masakan rumahan yang hangat.",
    address: "Lengkapi alamat toko kamu",
    latitude: -7.9839,
    longitude: 112.6214,
    whatsapp: null,
    instagram: null,
    opening_hours: "Setiap hari · 07.00–20.00",
    is_open: true,
  })

  if (error) return { ok: false, message: `Gagal membuat profil: ${error.message}` }

  revalidatePublic()
  return { ok: true, message: "Profil toko dibuat. Lengkapi datanya ya." }
}

export async function saveStore(input: StoreInput): Promise<ActionResult> {
  const parsed = storeSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, message: "Sesi berakhir. Silakan login ulang." }

  const payload = {
    name: parsed.data.name,
    tagline: blankToNull(parsed.data.tagline),
    address: parsed.data.address,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    whatsapp: blankToNull(parsed.data.whatsapp),
    instagram: blankToNull(parsed.data.instagram),
    opening_hours: blankToNull(parsed.data.opening_hours),
    is_open: parsed.data.is_open,
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await supabase
    .from("store")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle()

  const { error } = existing
    ? await supabase.from("store").update(payload).eq("id", existing.id)
    : await supabase.from("store").insert({ ...payload, owner_id: user.id })

  if (error) return { ok: false, message: `Gagal menyimpan: ${error.message}` }

  revalidatePublic()
  revalidatePath("/dashboard/profil")
  return { ok: true, message: "Profil toko tersimpan." }
}
