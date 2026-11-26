"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { saveAdminStore } from "@/app/actions/admin"
import { saveStore } from "@/app/actions/store"
import { storeSchema, type StoreInput } from "@/lib/validators"
import type { Store } from "@/lib/types"

const fields: { name: keyof StoreInput; label: string; placeholder: string; type?: string }[] = [
  { name: "name", label: "Nama toko", placeholder: "Contoh: Warung Rasa Nusa" },
  { name: "tagline", label: "Tagline", placeholder: "Kalimat pendek tentang warungmu" },
  { name: "address", label: "Alamat lengkap", placeholder: "Jl. Contoh No. 1, Kecamatan, Kota" },
  { name: "whatsapp", label: "Nomor WhatsApp", placeholder: "6281234567890" },
  { name: "instagram", label: "Instagram", placeholder: "@namaakun" },
  { name: "opening_hours", label: "Jam operasional", placeholder: "Senin–Sabtu · 07.00–20.00" },
]

export function StoreForm({ store, adminMode = false }: { store: Store; adminMode?: boolean }) {
  const [pending, start] = useTransition()
  const { register, handleSubmit, formState: { errors } } = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store.name,
      tagline: store.tagline ?? "",
      address: store.address,
      latitude: store.latitude,
      longitude: store.longitude,
      whatsapp: store.whatsapp ?? "",
      instagram: store.instagram ?? "",
      opening_hours: store.opening_hours ?? "",
      is_open: store.is_open,
    },
  })

  function onSubmit(values: StoreInput) {
    start(async () => {
      const result = adminMode ? await saveAdminStore(store.id, values) : await saveStore(values)
      result.ok ? toast.success(result.message) : toast.error(result.message)
    })
  }

  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate><div className="grid gap-5 sm:grid-cols-2">{fields.map((field) => <div key={field.name} className={field.name === "address" ? "sm:col-span-2" : ""}><label htmlFor={field.name} className="mb-2 block text-sm font-semibold">{field.label}</label><input id={field.name} placeholder={field.placeholder} className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none transition focus:border-[var(--green)] focus:ring-4 focus:ring-[var(--green)]/10" {...register(field.name)} />{errors[field.name] && <p className="mt-1.5 text-xs text-red-600">{errors[field.name]?.message as string}</p>}</div>)}</div><label className="flex cursor-pointer items-center justify-between rounded-2xl bg-[var(--cream)] p-4"><span><span className="block text-sm font-bold">Toko sedang buka</span><span className="mt-1 block text-xs text-[var(--muted)]">Status ini tampil di halaman publik.</span></span><input type="checkbox" className="size-5 accent-[var(--green)]" {...register("is_open")} /></label><button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)] disabled:opacity-60">{pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Simpan perubahan</button></form>
}
