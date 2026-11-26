"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { saveMenu } from "@/app/actions/menu"
import { ImageUploader } from "@/components/image-uploader"
import type { Category, MenuItem } from "@/lib/types"
import { menuSchema, type MenuInput } from "@/lib/validators"

export function MenuForm({
  item,
  categories,
  storeId,
}: {
  item?: MenuItem
  categories: Category[]
  storeId: string
}) {
  const [pending, start] = useTransition()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MenuInput>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      id: item?.id,
      name: item?.name ?? "",
      description: item?.description ?? "",
      price: item?.price ?? 0,
      category_id: item?.category_id ?? null,
      image_url: item?.image_url ?? null,
      is_available: item?.is_available ?? true,
      sort_order: item?.sort_order ?? 0,
    },
  })

  function onSubmit(values: MenuInput) {
    start(async () => {
      const result = await saveMenu(values)
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-2 block text-sm font-semibold">
            Nama menu
          </label>
          <input
            id="name"
            placeholder="Contoh: Nasi Campur Nusa"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]"
            {...register("name")}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-2 block text-sm font-semibold">
            Deskripsi
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Bahan atau cerita singkat menu"
            className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]"
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="mb-2 block text-sm font-semibold">
            Harga (Rupiah)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="1000"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p className="mt-1.5 text-xs text-red-600">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="category_id" className="mb-2 block text-sm font-semibold">
            Kategori
          </label>
          <select
            id="category_id"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]"
            {...register("category_id")}
          >
            <option value="">Tanpa kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 block text-sm font-semibold">Foto menu</p>
          <ImageUploader
            storeId={storeId}
            value={watch("image_url")}
            onChange={(url) => setValue("image_url", url, { shouldDirty: true })}
          />
        </div>

        <div>
          <label htmlFor="sort_order" className="mb-2 block text-sm font-semibold">
            Urutan tampil
          </label>
          <input
            id="sort_order"
            type="number"
            min="0"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]"
            {...register("sort_order", { valueAsNumber: true })}
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between self-end rounded-2xl bg-[var(--cream)] p-4">
          <span>
            <span className="block text-sm font-bold">Menu tersedia</span>
            <span className="mt-1 block text-xs text-[var(--muted)]">Matikan saat menu sedang habis.</span>
          </span>
          <input type="checkbox" className="size-5 accent-[var(--green)]" {...register("is_available")} />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)] disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Simpan menu
      </button>
    </form>
  )
}
