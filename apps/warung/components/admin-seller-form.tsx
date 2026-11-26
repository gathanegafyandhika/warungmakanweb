"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { createSeller } from "@/app/actions/admin"

export function AdminSellerForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  function submit(formData: FormData) {
    const input = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      full_name: String(formData.get("full_name") ?? ""),
    }
    startTransition(async () => {
      const result = await createSeller(input)
      if (result.ok) {
        toast.success(result.message)
        setOpen(false)
        router.refresh()
      } else toast.error(result.message)
    })
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)]">
        <UserPlus className="size-4" /> Tambah penjual
      </button>
    )
  }

  return (
    <form action={submit} className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="font-bold">Buat akun penjual</p><p className="mt-1 text-xs text-[var(--muted)]">Penjual bisa langsung masuk setelah akun dibuat.</p></div>
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">Batal</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold">Nama lengkap<input name="full_name" placeholder="Nama penjual" className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 font-normal outline-none focus:border-[var(--green)]" /></label>
        <label className="text-sm font-semibold">Email<input name="email" required type="email" placeholder="penjual@warung.id" className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 font-normal outline-none focus:border-[var(--green)]" /></label>
        <label className="text-sm font-semibold">Password<input name="password" required minLength={6} type="password" placeholder="Minimal 6 karakter" className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 font-normal outline-none focus:border-[var(--green)]" /></label>
      </div>
      <button disabled={pending} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--orange)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{pending && <Loader2 className="size-4 animate-spin" />} Simpan akun</button>
    </form>
  )
}
