import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { getSession } from "@/lib/data"
import { getCurrentProfile } from "@/lib/admin"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured) redirect("/login")
  const { user, store } = await getSession()
  if (!user) redirect("/login?redirect=/dashboard")

  const { profile } = await getCurrentProfile()
  if (profile?.role === "admin") redirect("/admin")
  if (profile && !profile.is_active) redirect("/login?error=inactive")

  return <DashboardShell store={store} email={user.email ?? ""}>{children}</DashboardShell>
}
