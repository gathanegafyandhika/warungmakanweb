import { z } from "zod"

const uuid = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "ID tidak valid.",
  )

export const storeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama toko minimal 2 karakter.")
    .max(80, "Nama toko maksimal 80 karakter."),
  tagline: z.string().trim().max(120, "Tagline maksimal 120 karakter."),
  address: z
    .string()
    .trim()
    .min(5, "Alamat terlalu pendek.")
    .max(300, "Alamat maksimal 300 karakter."),
  latitude: z
    .number()
    .min(-90, "Latitude minimal -90.")
    .max(90, "Latitude maksimal 90."),
  longitude: z
    .number()
    .min(-180, "Longitude minimal -180.")
    .max(180, "Longitude maksimal 180."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^$|^[0-9+()\s-]{8,20}$/, "Nomor WhatsApp tidak valid."),
  instagram: z.string().trim().max(60, "Instagram maksimal 60 karakter."),
  opening_hours: z
    .string()
    .trim()
    .max(120, "Jam operasional maksimal 120 karakter."),
  is_open: z.boolean(),
})

export type StoreInput = z.infer<typeof storeSchema>

export const categorySchema = z.object({
  id: uuid.optional(),
  name: z
    .string()
    .trim()
    .min(2, "Nama kategori minimal 2 karakter.")
    .max(40, "Nama kategori maksimal 40 karakter."),
  sort_order: z.number().int().min(0).max(999),
})

export type CategoryInput = z.infer<typeof categorySchema>

export const menuSchema = z.object({
  id: uuid.optional(),
  name: z
    .string()
    .trim()
    .min(2, "Nama menu minimal 2 karakter.")
    .max(80, "Nama menu maksimal 80 karakter."),
  description: z.string().trim().max(300, "Deskripsi maksimal 300 karakter."),
  price: z
    .number()
    .int("Harga harus bilangan bulat.")
    .min(0, "Harga tidak boleh negatif.")
    .max(10_000_000, "Harga terlalu besar."),
  category_id: z.string().trim().max(64).nullable(),
  image_url: z.string().trim().max(500, "URL foto maksimal 500 karakter.").nullable(),
  is_available: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
})

export type MenuInput = z.infer<typeof menuSchema>

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
})

export type LoginInput = z.infer<typeof loginSchema>

export const sellerSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  full_name: z.string().trim().max(80, "Nama maksimal 80 karakter."),
})

export type SellerInput = z.infer<typeof sellerSchema>
