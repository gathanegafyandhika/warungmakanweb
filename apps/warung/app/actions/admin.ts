"use server"

import { revalidatePath } from "next/cache"
import { createServiceRoleClient, requireAdmin } from "@/lib/admin"
import { blankToNull, firstIssue, type ActionResult } from "@/lib/guard"
import { sellerSchema, storeSchema, type SellerInput, type StoreInput } from "@/lib/validators"

function adminError(result: { error?: string }) {
  return { ok: false, message: result.error ?? "Akses admin diperlukan." } satisfies ActionResult
}

export async function createSeller(input: SellerInput): Promise<ActionResult> {
  const parsed = sellerSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }

  const admin = await requireAdmin()
  if ("error" in admin) return adminError(admin)

  const service = createServiceRoleClient()
  if (!service) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server." }
  }

  const { data, error } = await service.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: blankToNull(parsed.data.full_name) },
  })

  if (error) return { ok: false, message: `Gagal membuat akun: ${error.message}` }

  if (data.user) {
    const { error: profileError } = await service
      .from("profiles")
      .upsert({
        id: data.user.id,
        email: parsed.data.email,
        full_name: blankToNull(parsed.data.full_name),
        role: "seller",
        is_active: true,
      })
    if (profileError) return { ok: false, message: `Akun dibuat, profil gagal disimpan: ${profileError.message}` }
  }

  revalidatePath("/admin")
  return { ok: true, message: "Akun penjual berhasil dibuat." }
}

export async function setSellerActive(userId: string, isActive: boolean): Promise<ActionResult> {
  const admin = await requireAdmin()
  if ("error" in admin) return adminError(admin)
  if (userId === admin.user.id) return { ok: false, message: "Akun admin sendiri tidak dapat dinonaktifkan." }

  const service = createServiceRoleClient()
  if (!service) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server." }

  const { error } = await service
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", userId)
    .eq("role", "seller")

  if (error) return { ok: false, message: `Gagal mengubah status: ${error.message}` }

  // Layout authorization checks is_active on every protected request, so an
  // already-open session loses access on its next navigation.
  revalidatePath("/admin")
  return { ok: true, message: isActive ? "Akun diaktifkan." : "Akun dinonaktifkan." }
}

export async function saveAdminStore(storeId: string, input: StoreInput): Promise<ActionResult> {
  const parsed = storeSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) }

  const admin = await requireAdmin()
  if ("error" in admin) return adminError(admin)

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

  const { error } = await admin.supabase.from("store").update(payload).eq("id", storeId)
  if (error) return { ok: false, message: `Gagal menyimpan warung: ${error.message}` }

  revalidatePath("/admin")
  revalidatePath("/")
  return { ok: true, message: "Data warung berhasil diperbarui." }
}

export async function deleteAdminStore(storeId: string): Promise<ActionResult> {
  const admin = await requireAdmin()
  if ("error" in admin) return adminError(admin)

  const { error } = await admin.supabase.from("store").delete().eq("id", storeId)
  if (error) return { ok: false, message: `Gagal menghapus warung: ${error.message}` }

  revalidatePath("/admin")
  revalidatePath("/")
  return { ok: true, message: "Warung berhasil dihapus." }
}
