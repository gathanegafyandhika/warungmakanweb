"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"
import { createStore } from "@/app/actions/store"

export function SetupStore() {
  const router = useRouter()
  const [pending, start] = useTransition()

  function onCreate() {
    start(async () => {
      const result = await createStore()
      if (result.ok) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[var(--line)] bg-white p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[var(--lime)]/30 text-[var(--green)]">
        <Sparkles className="size-7" />
      </div>
      <h1 className="display mt-6 text-3xl font-bold tracking-tight">
        Profil toko belum dibuat
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
        Buat profil dasar dulu. Setelah itu kamu bisa mengubah nama, alamat,
        lokasi, jam buka, dan menu.
      </p>
      <button
        onClick={onCreate}
        disabled={pending}
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)] disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Buat profil toko
      </button>
    </div>
  )
}
