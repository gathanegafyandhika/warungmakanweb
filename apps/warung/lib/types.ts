export type Category = {
  id: string
  name: string
  sort_order: number
}

export type MenuItem = {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  sort_order: number
}

export type UserRole = "admin" | "seller"

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
}

export type Store = {
  id: string
  owner_id: string
  name: string
  tagline: string | null
  address: string
  latitude: number
  longitude: number
  whatsapp: string | null
  instagram: string | null
  opening_hours: string | null
  is_open: boolean
}

export const demoStore: Store = {
  id: "demo-store",
  owner_id: "demo-owner",
  name: "Warung Rasa Nusa",
  tagline: "Masakan rumahan, rasa yang selalu dirindukan.",
  address: "Jl. Ijen No. 18, Klojen, Kota Malang",
  latitude: -7.9771,
  longitude: 112.6341,
  whatsapp: "6281234567890",
  instagram: "warungrasanusa",
  opening_hours: "Senin–Sabtu · 07.00–20.00",
  is_open: true,
}

export const demoCategories: Category[] = [
  { id: "cat-nasi", name: "Nasi & Lauk", sort_order: 1 },
  { id: "cat-sayur", name: "Sayur", sort_order: 2 },
  { id: "cat-minum", name: "Minuman", sort_order: 3 },
]

export const demoMenu: MenuItem[] = [
  {
    id: "menu-1",
    category_id: "cat-nasi",
    name: "Nasi Campur Nusa",
    description: "Nasi hangat, ayam suwir, telur bumbu bali, dan sambal.",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
    is_available: true,
    sort_order: 1,
  },
  {
    id: "menu-2",
    category_id: "cat-nasi",
    name: "Ayam Goreng Kremes",
    description: "Ayam ungkep gurih dengan kremesan renyah dan lalapan.",
    price: 22000,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    is_available: true,
    sort_order: 2,
  },
  {
    id: "menu-3",
    category_id: "cat-sayur",
    name: "Sayur Asem",
    description: "Kuah segar dengan jagung, kacang panjang, dan melinjo.",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
    is_available: true,
    sort_order: 3,
  },
  {
    id: "menu-4",
    category_id: "cat-minum",
    name: "Es Teh Jawa",
    description: "Teh melati dingin dengan gula batu.",
    price: 5000,
    image_url: null,
    is_available: false,
    sort_order: 4,
  },
]
