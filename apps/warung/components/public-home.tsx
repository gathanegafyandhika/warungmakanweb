"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import { ArrowUpRight, Camera, Clock3, MapPin, MessageCircle, Search, Utensils } from "lucide-react"
import { MapView } from "@/components/map-view"
import { formatRupiah, googleMapsUrl } from "@/lib/format"
import type { Category, MenuItem, Store } from "@/lib/types"

export function PublicHome({ store, categories, menu }: { store: Store; categories: Category[]; menu: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [search, setSearch] = useState("")
  const filtered = useMemo(() => menu.filter((item) => {
    const categoryMatch = activeCategory === "Semua" || categories.find((c) => c.id === item.category_id)?.name === activeCategory
    const searchMatch = `${item.name} ${item.description ?? ""}`.toLowerCase().includes(search.toLowerCase())
    return categoryMatch && searchMatch
  }), [activeCategory, categories, menu, search])

  return (
    <main className="overflow-hidden">
      <section className="relative bg-[var(--green)] text-white">
        <div className="absolute -right-32 -top-48 h-[34rem] w-[34rem] rounded-full border-[4rem] border-[var(--lime)]/10" />
        <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--orange)]/80 blur-3xl" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 lg:px-10">
          <a href="#atas" className="display max-w-[55%] truncate text-xl font-bold tracking-tight">{store.name}<span className="text-[var(--lime)]">.</span></a>
          <div className="hidden items-center gap-8 text-sm text-white/70 sm:flex">
            <a className="transition hover:text-white" href="#menu">Menu</a>
            <a className="transition hover:text-white" href="#lokasi">Lokasi</a>
            <a className="transition hover:text-white" href="#kontak">Kontak</a>
          </div>
          <a href="/login" className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold tracking-wide text-white transition hover:border-[var(--lime)] hover:text-[var(--lime)]">Masuk penjual</a>
        </nav>
        <div id="atas" className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-24 pt-14 lg:grid-cols-[1.08fr_.92fr] lg:items-end lg:px-10 lg:pb-32 lg:pt-24">
          <div className="reveal">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[var(--lime)]"><span className={`h-2 w-2 rounded-full ${store.is_open ? "bg-[var(--lime)]" : "bg-[var(--orange)]"}`} /> {store.is_open ? "Sedang buka" : "Sedang tutup"}</div>
            <h1 className="display max-w-2xl text-5xl font-bold leading-[.98] tracking-[-.045em] sm:text-7xl">{store.name}</h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-white/70">{store.tagline}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4 text-sm text-white/65"><span className="flex items-center gap-2"><Clock3 className="size-4 text-[var(--lime)]" /> {store.opening_hours}</span></div>
            <a href="#menu" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--lime)] px-6 py-3.5 text-sm font-bold text-[var(--green-deep)] transition hover:-translate-y-1 hover:bg-white">Lihat menu <ArrowUpRight className="size-4" /></a>
          </div>
          <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[28rem] lg:mb-[-3rem]">
            <div className="absolute -bottom-6 -left-5 z-10 rounded-2xl bg-[var(--orange)] px-5 py-4 text-white shadow-xl shadow-black/20"><div className="display text-2xl font-bold">Sejak 2012</div><div className="text-xs text-white/75">dari dapur kecil kami</div></div>
            <div className="aspect-[.88] rotate-2 overflow-hidden rounded-[8rem_1.5rem_1.5rem_1.5rem] bg-[var(--cream)] shadow-2xl shadow-black/20"><img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=90" alt="Semangkuk masakan rumahan Warung Rasa Nusa" /></div>
          </div>
        </div>
      </section>

      <section id="menu" className="paper-grid bg-[var(--paper)] px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow text-[var(--orange)]">Dari dapur hari ini</p><h2 className="display mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Menu favorit</h2></div><p className="max-w-xs text-sm leading-relaxed text-[var(--muted)]">Kami masak dalam porsi kecil supaya setiap sajian tetap hangat dan segar.</p></div>
          <div className="mb-8 flex flex-col gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{["Semua", ...categories.map((c) => c.name)].map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? "bg-[var(--green)] text-white" : "text-[var(--muted)] hover:bg-[var(--cream)]"}`}>{category}</button>)}</div><label className="flex min-w-48 items-center gap-2 border-b border-[var(--line)] px-1 py-2 text-sm text-[var(--muted)]"><Search className="size-4" /><input value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} placeholder="Cari menu..." className="w-full bg-transparent outline-none placeholder:text-[var(--muted)]" /></label></div>
          {filtered.length === 0 ? <div className="rounded-3xl border border-dashed border-[var(--line)] p-16 text-center text-[var(--muted)]">{menu.length === 0 ? "Belum ada menu yang dipublikasikan." : "Menu yang kamu cari belum tersedia."}</div> : <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item, index) => <article className={`menu-card reveal reveal-delay-${(index % 3) + 1} overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-white`} key={item.id}><div className="relative aspect-[1.25] overflow-hidden bg-[var(--cream)]">{item.image_url ? <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[var(--green)]/25"><Utensils className="size-16" /></div>}{!item.is_available && <div className="absolute inset-0 flex items-center justify-center bg-[var(--green)]/50"><span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--green)]">Habis hari ini</span></div>}</div><div className="p-5"><div className="mb-2 flex items-start justify-between gap-3"><h3 className="display text-xl font-bold">{item.name}</h3><span className="shrink-0 text-sm font-bold text-[var(--orange)]">{formatRupiah(item.price)}</span></div><p className="text-sm leading-relaxed text-[var(--muted)]">{item.description}</p></div></article>)}</div>}
        </div>
      </section>

      <section id="lokasi" className="bg-[var(--cream)] px-5 py-20 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center"><div><p className="eyebrow text-[var(--orange)]">Mampir, yuk</p><h2 className="display mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Temukan kami<br /><span className="text-[var(--green)]">di Kota Malang.</span></h2><p className="mt-6 max-w-sm leading-relaxed text-[var(--muted)]">{store.address}</p><a target="_blank" rel="noreferrer" href={googleMapsUrl(store.latitude, store.longitude)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[var(--green-deep)]"><MapPin className="size-4" /> Buka di Google Maps</a></div><div className="border-[10px] border-white shadow-xl"><MapView store={store} /></div></div></section>

      <section id="kontak" className="bg-[var(--orange)] px-5 py-16 text-white lg:px-10"><div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow text-white/65">Pesan meja atau tanya menu</p><h2 className="display mt-2 text-4xl font-bold">Sapa kami.</h2></div><div className="flex flex-wrap gap-3"><a target="_blank" rel="noreferrer" href={`https://wa.me/${store.whatsapp ?? ""}`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--orange)] transition hover:-translate-y-1"><MessageCircle className="size-4" /> WhatsApp</a>{store.instagram && <a target="_blank" rel="noreferrer" href={`https://instagram.com/${store.instagram.replace(/^@/, "")}`} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-bold transition hover:border-white"><Camera className="size-4" /> Instagram</a>}</div></div></section>
      <footer className="bg-[var(--green-deep)] px-5 py-6 text-center text-xs text-white/50">© {new Date().getFullYear()} {store.name}. Dibuat dengan rasa.</footer>
    </main>
  )
}
