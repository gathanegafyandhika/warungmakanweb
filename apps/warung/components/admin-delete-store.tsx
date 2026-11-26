"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteAdminStore } from "@/app/actions/admin"

export function AdminDeleteStore({ storeId, name }: { storeId: string; name: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function remove() {
    if (!window.confirm(`Hapus warung "${name}"? Semua kategori dan menu ikut terhapus.`)) return
    startTransition(async () => {
      const result = await deleteAdminStore(storeId)
      if (result.ok) {
        toast.success(result.message)
        router.push("/admin/warung")
        router.refresh()
      } else toast.error(result.message)
    })
  }

  return <button type="button" onClick={remove} disabled={pending} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50">{pending ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />} Hapus</button>
}
