import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cache } from "react"
import { createClient } from "@/lib/supabase/server"
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config"
import type { UserProfile } from "@/lib/types"

// Deduplicates the auth + profile lookup when a layout and its page both need it.
export const getCurrentProfile = cache(async () => {
  if (!supabaseUrl || !supabaseAnonKey) return { user: null, profile: null }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, created_at")
    .eq("id", user.id)
    .maybeSingle()

  return { user, profile: profile as UserProfile | null }
})

export async function requireAdmin() {
  const session = await getCurrentProfile()

  if (!session.user) return { error: "Sesi berakhir. Silakan login ulang." as const }
  if (!session.profile || session.profile.role !== "admin") {
    return { error: "Akses admin diperlukan." as const }
  }
  if (!session.profile.is_active) {
    return { error: "Akun admin sedang dinonaktifkan." as const }
  }

  const supabase = await createClient()
  return { supabase, user: session.user, profile: session.profile }
}

export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) return null

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
