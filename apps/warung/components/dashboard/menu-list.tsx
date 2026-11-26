"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Pencil, Plus, Trash2, TriangleAlert } from "lucide-react"
import { deleteMenu, saveMenu } from "@/app/actions/menu"
import { formatRupiah } from "@/lib/format"
import type { Category, MenuItem } from "@/lib/types"

export function MenuList({ menu, categories }: { menu: MenuItem[]; categories: Category[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [deleting, setDeleting] = useState<MenuItem | null>(null)

  function toggle(item: MenuItem) {
    start(async () => {
      const result = await saveMenu({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        price: item.price,
        category_id: item.category_id,
        image_url: item.image_url,
        is_available: !item.is_available,
        sort_order: item.sort_order,
      })
      if (result.ok) {
        toast.success(item.is_available ? `${item.name} ditandai habis.` : `${item.name} tersedia lagi.`)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  function confirmDelete() {
    if (!deleting) return
    start(async () => {
      const result = await deleteMenu(deleting.id)
      if (result.ok) {
        toast.success(result.message)
        setDeleting(null)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  if (menu.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white p-12 text-center">
        <p className="display text-2xl font-bold">Belum ada menu</p>
        <p className="mt-2 text-sm text-[var(--muted)]">Mulai dengan menambahkan satu menu andalan.</p>
        <Link href="/dashboard/menu/baru" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-3 text-sm font-bold text-white"><Plus className="size-4" /> Tambah menu</Link>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
        <ul className="divide-y divide-[var(--line)]">
          {menu.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-[var(--cream)]">
                {item.image_url ? <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{item.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${item.is_available ? "bg-[var(--lime)]/35 text-[var(--green-deep)]" : "bg-[var(--orange)]/15 text-[var(--orange)]"}`}>{item.is_available ? "Tersedia" : "Habis"}</span>
                </div>
                <p className="mt-1 truncate text-xs text-[var(--muted)]">{categories.find((c) => c.id === item.category_id)?.name ?? "Tanpa kategori"} · urutan {item.sort_order}</p>
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <span className="mr-auto text-sm font-bold text-[var(--orange)] sm:mr-2">{formatRupiah(item.price)}</span>
                <button onClick={() => toggle(item)} disabled={pending} className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold transition hover:bg-[var(--cream)] disabled:opacity-50">{item.is_available ? "Tandai habis" : "Tandai tersedia"}</button>
                <Link href={`/dashboard/menu/${item.id}`} className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-[var(--cream)] hover:text-[var(--green)]" aria-label={`Ubah ${item.name}`}><Pencil className="size-4" /></Link>
                <button onClick={() => setDeleting(item)} className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-red-50 hover:text-red-600" aria-label={`Hapus ${item.name}`}><Trash2 className="size-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--green-deep)]/45 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><TriangleAlert className="size-5" /></div>
            <h2 id="delete-title" className="display mt-4 text-2xl font-bold">Hapus menu ini?</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">“{deleting.name}” akan hilang dari halaman publik. Tindakan ini tidak bisa dibatalkan.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-bold transition hover:bg-[var(--cream)]">Batal</button>
              <button onClick={confirmDelete} disabled={pending} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60">{pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Hapus</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
