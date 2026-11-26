"use client"

import { useEffect, useMemo, useRef } from "react"
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function ClickToMove({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

function Recenter({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap()
  const previous = useRef<[number, number]>([latitude, longitude])

  useEffect(() => {
    const [lastLat, lastLng] = previous.current
    if (lastLat === latitude && lastLng === longitude) return
    previous.current = [latitude, longitude]
    map.panTo([latitude, longitude], { animate: true })
  }, [latitude, longitude, map])

  return null
}

export default function LocationPickerMapInner({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number
  longitude: number
  onChange: (latitude: number, longitude: number) => void
}) {
  const markerRef = useRef<L.Marker>(null)
  const position = useMemo<[number, number]>(() => [latitude, longitude], [latitude, longitude])

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (!marker) return
        const next = marker.getLatLng()
        onChange(next.lat, next.lng)
      },
    }),
    [onChange],
  )

  return (
    <div className="h-[26rem] overflow-hidden rounded-[1.5rem] border border-[var(--line)]">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable
          position={position}
          icon={pinIcon}
          ref={markerRef}
          eventHandlers={eventHandlers}
        />
        <ClickToMove onChange={onChange} />
        <Recenter latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  )
}
