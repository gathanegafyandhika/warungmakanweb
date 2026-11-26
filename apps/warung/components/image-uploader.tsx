"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

const MAX_BYTES = 2 * 1024 * 1024
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"]

async function compress(file: File): Promise<Blob> {
  if (file.size <= 900 * 1024) return file
  const bitmap = await createImageBitmap(file)
  const maxSide = 1600
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext("2d")
  if (!context) return file
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.85)
  })
}

export function ImageUploader({
  storeId,
  value,
  onChange,
}: {
  storeId: string
  value: string | null
  onChange: (url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Gunakan foto JPG, PNG, atau WebP.")
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error("Ukuran foto maksimal 2 MB.")
      return
    }

    setUploading(true)
    try {
      const blob = await compress(file)
      const path = `${storeId}/${crypto.randomUUID()}.jpg`
      const supabase = createClient()
      const { error } = await supabase.storage
        .from("menu-images")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false })

      if (error) {
        toast.error(`Gagal mengunggah: ${error.message}`)
        return
      }

      const { data } = supabase.storage.from("menu-images").getPublicUrl(path)
      onChange(data.publicUrl)
      toast.success("Foto terunggah.")
    } catch {
      toast.error("Foto gagal diproses. Coba file lain.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--cream)]">
          {value ? (
            <img src={value} alt="Pratinjau foto menu" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--green)]/30">
              <ImagePlus className="size-7" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="sr-only"
            onChange={(event) => {
              void handleFile(event.target.files?.[0])
              event.target.value = ""
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-bold transition hover:bg-[var(--cream)] disabled:opacity-60"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {value ? "Ganti foto" : "Unggah foto"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="ml-2 inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="size-4" /> Hapus
            </button>
          )}
          <p className="mt-2 text-xs text-[var(--muted)]">
            JPG/PNG/WebP, maksimal 2 MB. Foto besar dikompres otomatis.
          </p>
          <input
            type="text"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder="atau tempel URL foto"
            className="mt-3 w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-xs outline-none focus:border-[var(--green)]"
          />
        </div>
      </div>
    </div>
  )
}
