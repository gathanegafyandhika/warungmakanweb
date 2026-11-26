"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, Loader2, Plus, Trash2, TriangleAlert, X } from "lucide-react"
import { deleteCategory, saveCategory } from "@/app/actions/category"
import type { Category } from "@/lib/types"

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [name, setName] = useState("")
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [deleting, setDeleting] = useState<Category | null>(null)

  function create() {
    if (name.trim().length < 2) {
      toast.error("Nama kategori minimal 2 karakter.")
      return
    }
    start(async () => {
      const result = await saveCategory({ name, sort_order: categories.length + 1 })
      if (result.ok) {
        toast.success(result.message)
        setName("")
        router.refresh()
      } else toast.error(result.message)
    })
  }

  function rename(category: Category) {
    start(async () => {
      const result = await saveCategory({ id: category.id, name: editName, sort_order: category.sort_order })
      if (result.ok) {
        toast.success(result.message)
        setEditing(null)
        router.refresh()
      } else toast.error(result.message)
    })
  }

  function remove() {
    if (!deleting) return
    start(async () => {
      const result = await deleteCategory(deleting.id)
      if (result.ok) {
        toast.success(result.message)
        setDeleting(null)
        router.refresh()
      } else toast.error(result.message)
    })
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 sm:flex-row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kategori baru" className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]" />
        <button onClick={create} disabled={pending} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)] disabled:opacity-60">{pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Tambah</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
        {categories.length === 0 ? <p className="p-10 text-center text-sm text-[var(--muted)]">Belum ada kategori. Tambahkan “Makanan”, “Minuman”, atau “Lauk”.</p> : <ul className="divide-y divide-[var(--line)]">{categories.map((category) => <li key={category.id} className="flex items-center gap-3 p-4">{editing === category.id ? <><input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-[var(--green)] px-3 py-2 text-sm outline-none" /><button onClick={() => rename(category)} disabled={pending} className="rounded-lg bg-[var(--green)] p-2 text-white" aria-label="Simpan nama"><Check className="size-4" /></button><button onClick={() => setEditing(null)} className="rounded-lg border border-[var(--line)] p-2" aria-label="Batal"><X className="size-4" /></button></> : <><div className="min-w-0 flex-1"><p className="font-bold">{category.name}</p><p className="text-xs text-[var(--muted)]">Urutan {category.sort_order}</p></div><button onClick={() => { setEditing(category.id); setEditName(category.name) }} className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold hover:bg-[var(--cream)]">Ubah</button><button onClick={() => setDeleting(category)} className="rounded-lg p-2 text-[var(--muted)] hover:bg-red-50 hover:text-red-600" aria-label={`Hapus ${category.name}`}><Trash2 className="size-4" /></button></>}</li>)}</ul>}
      </div>

      {deleting && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--green-deep)]/45 p-4"><div role="dialog" aria-modal="true" aria-labelledby="delete-category" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"><div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600"><TriangleAlert className="size-5" /></div><h2 id="delete-category" className="display mt-4 text-2xl font-bold">Hapus kategori?</h2><p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">Menu di kategori “{deleting.name}” tidak terhapus, hanya menjadi tanpa kategori.</p><div className="mt-6 flex gap-3"><button onClick={() => setDeleting(null)} className="flex-1 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-bold hover:bg-[var(--cream)]">Batal</button><button onClick={remove} disabled={pending} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Hapus</button></div></div></div>}
    </>
  )
}
