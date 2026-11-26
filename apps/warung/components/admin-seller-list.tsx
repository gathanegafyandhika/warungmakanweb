"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Loader2, Power } from "lucide-react"
import { toast } from "sonner"
import { setSellerActive } from "@/app/actions/admin"
import type { AdminSeller } from "@/lib/admin-data"

export function AdminSellerList({ sellers }: { sellers: AdminSeller[] }) {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [optimistic, setOptimistic] = useState<Record<string, boolean>>({})
  const [, startTransition] = useTransition()

  function toggle(seller: AdminSeller) {
    const nextState = !(optimistic[seller.id] ?? seller.is_active)
    setOptimistic((current) => ({ ...current, [seller.id]: nextState }))
    setPendingId(seller.id)

    startTransition(async () => {
      const result = await setSellerActive(seller.id, nextState)
      if (result.ok) {
        toast.success(result.message)
        router.refresh()
      } else {
        setOptimistic((current) => {
          const next = { ...current }
          delete next[seller.id]
          return next
        })
        toast.error(result.message)
      }
      setPendingId(null)
    })
  }

  if (sellers.length === 0) return <div className="p-8 text-center text-sm text-[var(--muted)]">Belum ada akun penjual.</div>

  return (
    <>
      <div className="divide-y divide-[var(--line)] sm:hidden">
        {sellers.map((seller) => {
          const isActive = optimistic[seller.id] ?? seller.is_active
          const isPending = pendingId === seller.id
          return <div key={seller.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="truncate font-bold">{seller.full_name || "Tanpa nama"}</p><p className="truncate text-xs text-[var(--muted)]">{seller.email}</p></div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${isActive ? "bg-[var(--lime)]/40 text-[var(--green-deep)]" : "bg-red-100 text-red-700"}`}>{isActive ? "Aktif" : "Nonaktif"}</span>
            </div>
            <p className="text-xs text-[var(--muted)]">{seller.store ? seller.store.name : "Belum punya warung"}</p>
            <button type="button" disabled={isPending} onClick={() => toggle(seller)} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--muted)] transition hover:border-[var(--green)] hover:text-[var(--green)] disabled:opacity-50">{isPending ? <Loader2 className="size-3 animate-spin" /> : <Power className="size-3" />}{isActive ? "Nonaktifkan" : "Aktifkan"}</button>
          </div>
        })}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wider text-[var(--muted)]"><tr><th className="px-5 py-3 font-bold">Penjual</th><th className="px-5 py-3 font-bold">Warung</th><th className="px-5 py-3 font-bold">Status</th><th className="px-5 py-3 text-right font-bold">Aksi</th></tr></thead>
          <tbody className="divide-y divide-[var(--line)]">
            {sellers.map((seller) => {
              const isActive = optimistic[seller.id] ?? seller.is_active
              const isPending = pendingId === seller.id
              return <tr key={seller.id}>
                <td className="px-5 py-4"><p className="font-bold">{seller.full_name || "Tanpa nama"}</p><p className="mt-1 text-xs text-[var(--muted)]">{seller.email}</p></td>
                <td className="px-5 py-4">{seller.store ? <><p className="font-semibold">{seller.store.name}</p><p className="mt-1 max-w-xs truncate text-xs text-[var(--muted)]">{seller.store.address}</p></> : <span className="text-xs text-[var(--muted)]">Belum dibuat</span>}</td>
                <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${isActive ? "bg-[var(--lime)]/40 text-[var(--green-deep)]" : "bg-red-100 text-red-700"}`}>{isActive ? "Aktif" : "Nonaktif"}</span></td>
                <td className="px-5 py-4 text-right"><button type="button" disabled={isPending} onClick={() => toggle(seller)} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--muted)] transition hover:border-[var(--green)] hover:text-[var(--green)] disabled:opacity-50">{isPending ? <Loader2 className="size-3 animate-spin" /> : <Power className="size-3" />}{isActive ? "Nonaktifkan" : "Aktifkan"}</button></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
