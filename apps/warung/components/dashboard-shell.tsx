"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, MapPin, Menu, Settings2, Store, Tags, X } from "lucide-react"
import { useState } from "react"
import { signOut } from "@/app/actions/auth"
import type { Store as StoreType } from "@/lib/types"
import { cn } from "@/lib/cn"

const navigation = [
  { href: "/dashboard", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/dashboard/profil", label: "Profil toko", icon: Store },
  { href: "/dashboard/lokasi", label: "Lokasi", icon: MapPin },
  { href: "/dashboard/menu", label: "Menu", icon: Menu },
  { href: "/dashboard/kategori", label: "Kategori", icon: Tags },
]

export function DashboardShell({ children, store, email }: { children: React.ReactNode; store: StoreType | null; email: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <aside className={cn("fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-white/10 bg-[var(--green-deep)] px-5 py-6 text-white transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-2"><Link href="/" className="display text-2xl font-bold">Rasa Nusa<span className="text-[var(--lime)]">.</span></Link><button onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/60 hover:bg-white/10 lg:hidden" aria-label="Tutup menu"><X className="size-5" /></button></div>
        <div className="mt-12 rounded-2xl bg-white/10 p-4"><p className="eyebrow text-[var(--lime)]">Toko aktif</p><p className="mt-2 truncate font-bold">{store?.name ?? "Profil belum ada"}</p><p className="mt-1 text-xs text-white/50">{email}</p></div>
        <nav className="mt-8 flex-1 space-y-1">{navigation.map(({ href, label, icon: Icon }) => { const active = pathname === href; return <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition", active ? "bg-[var(--lime)] text-[var(--green-deep)]" : "text-white/60 hover:bg-white/10 hover:text-white")}><Icon className="size-[1.1rem]" /> {label}</Link> })}</nav>
        <div className="space-y-3"><Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl border border-white/15 px-3 py-3 text-sm font-semibold text-white/75 transition hover:border-[var(--lime)] hover:text-[var(--lime)]"><Store className="size-[1.1rem]" /> Lihat halaman publik</Link><form action={signOut}><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"><LogOut className="size-[1.1rem]" /> Keluar</button></form></div>
      </aside>
      {open && <button className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup sidebar" />}
      <div className="lg:pl-72"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--line)]/70 bg-[var(--paper)]/90 px-5 backdrop-blur lg:px-10"><button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-[var(--cream)] lg:hidden" aria-label="Buka menu"><Menu className="size-5" /></button><div className="hidden text-sm font-semibold text-[var(--muted)] lg:block">Kelola warung dengan lebih mudah.</div><Link href="/dashboard/profil" className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--cream)] hover:text-[var(--green)]" aria-label="Pengaturan profil"><Settings2 className="size-5" /></Link></header><main className="mx-auto max-w-6xl px-5 py-8 lg:px-10 lg:py-12">{children}</main></div>
    </div>
  )
}
