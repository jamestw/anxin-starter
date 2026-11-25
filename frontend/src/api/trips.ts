import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { TripStatus } from '@/lib/trip'

/** 欄位 snake_case，與後端 schemas/trip.py 一致 */
export interface Trip {
  id: number
  trip_no: string
  pickup_at: string
  pickup_address: string
  dropoff_address: string
  driver_name: string | null
  plate_no: string | null
  status: TripStatus
}

export interface Page<T> {
  items: T[]
  total: number
}

export function listTrips(params: { q?: string; limit?: number; offset?: number } = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && qs.set(k, String(v)))
  return api<Page<Trip>>(`/trips?${qs}`)
}

export function useTrips(q: string) {
  return useQuery({ queryKey: ['trips', q], queryFn: () => listTrips({ q }) })
}
