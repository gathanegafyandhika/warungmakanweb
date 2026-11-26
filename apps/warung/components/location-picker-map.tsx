"use client"

import dynamic from "next/dynamic"

const LocationPickerMapInner = dynamic(
  () => import("./location-picker-map-inner"),
  { ssr: false },
)

export function LocationPickerMap({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number
  longitude: number
  onChange: (latitude: number, longitude: number) => void
}) {
  return (
    <LocationPickerMapInner
      latitude={latitude}
      longitude={longitude}
      onChange={onChange}
    />
  )
}
