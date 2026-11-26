import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function DashboardHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: { href: string; label: string } }) {
  return <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow text-[var(--orange)]">{eyebrow}</p><h1 className="display mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{description}</p></div>{action && <Link href={action.href} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--green-deep)]">{action.label}<ArrowUpRight className="size-4" /></Link>}</div>
}

export function StatCard({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail: string; icon: LucideIcon }) {
  return <div className="rounded-2xl border border-[var(--line)] bg-white p-5"><div className="flex items-start justify-between"><p className="text-sm font-semibold text-[var(--muted)]">{label}</p><Icon className="size-5 text-[var(--orange)]" /></div><p className="display mt-5 text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-[var(--muted)]">{detail}</p></div>
}
