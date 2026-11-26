import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin-shell"
import { getCurrentProfile } from "@/lib/admin"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured) redirect("/login")

  const { user, profile } = await getCurrentProfile()
  if (!user) redirect("/login?redirect=/admin")
  if (!profile) redirect("/login?error=setup")
  if (!profile.is_active) redirect("/login?error=inactive")
  if (profile.role !== "admin") redirect("/dashboard")

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>
}
