"use client"

import dynamic from "next/dynamic"
import type { Store } from "@/lib/types"

const MapInner = dynamic(() => import("./map-view-inner"), { ssr: false })

export function MapView({ store, compact = false }: { store: Store; compact?: boolean }) {
  return <MapInner store={store} compact={compact} />
}
