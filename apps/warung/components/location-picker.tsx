"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { LocateFixed, Loader2, Save } from "lucide-react"
import { saveStore } from "@/app/actions/store"
import { LocationPickerMap } from "@/components/location-picker-map"
import type { Store } from "@/lib/types"

export function LocationPicker({ store }: { store: Store }) {
  const [latitude, setLatitude] = useState(store.latitude)
  const [longitude, setLongitude] = useState(store.longitude)
  const [pending, start] = useTransition()

  function useMyLocation() {
    if (!navigator.geolocation) {
      toast.error("Browser ini tidak mendukung lokasi.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Number(position.coords.latitude.toFixed(6)))
        setLongitude(Number(position.coords.longitude.toFixed(6)))
        toast.success("Lokasi ditemukan. Jangan lupa simpan.")
      },
      () => toast.error("Lokasi tidak bisa diakses. Izinkan lokasi di browser."),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function submit() {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast.error("Latitude dan longitude harus berupa angka.")
      return
    }
    start(async () => {
      const result = await saveStore({
        name: store.name,
        tagline: store.tagline ?? "",
        address: store.address,
        latitude,
        longitude,
        whatsapp: store.whatsapp ?? "",
        instagram: store.instagram ?? "",
        opening_hours: store.opening_hours ?? "",
        is_open: store.is_open,
      })
      if (result.ok) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.68fr_1.32fr]">
      <div className="space-y-5">
        <div>
          <label htmlFor="latitude" className="mb-2 block text-sm font-semibold">
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            value={Number.isFinite(latitude) ? latitude : ""}
            onChange={(event) => setLatitude(Number(event.target.value))}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]"
          />
        </div>
        <div>
          <label htmlFor="longitude" className="mb-2 block text-sm font-semibold">
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            value={Number.isFinite(longitude) ? longitude : ""}
            onChange={(event) => setLongitude(Number(event.target.value))}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--green)]"
          />
        </div>
        <button
          onClick={useMyLocation}
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-bold text-[var(--green)] transition hover:bg-[var(--cream)]"
        >
          <LocateFixed className="size-4" /> Gunakan lokasi saya
        </button>
        <button
          onClick={submit}
          disabled={pending}
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--green-deep)] disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan lokasi
        </button>
        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Klik peta atau geser marker untuk memindahkan titik. Angka latitude dan
          longitude ikut berubah otomatis.
        </p>
      </div>
      <LocationPickerMap
        latitude={latitude}
        longitude={longitude}
        onChange={(lat, lng) => {
          setLatitude(Number(lat.toFixed(6)))
          setLongitude(Number(lng.toFixed(6)))
        }}
      />
    </div>
  )
}
