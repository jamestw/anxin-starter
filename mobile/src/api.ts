import * as SecureStore from 'expo-secure-store'

import type { TripStatus } from '../../tokens/tokens'
import { API_URL } from './config'

const TOKEN_KEY = 'anxin.driver.token'

/** 後端錯誤：status＋中文訊息（後端一律回 { detail: "中文訊息" }） */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY)
export const setToken = (t: string | null) =>
  t ? SecureStore.setItemAsync(TOKEN_KEY, t) : SecureStore.deleteItemAsync(TOKEN_KEY)

export async function api<T>(path: string, body?: unknown): Promise<T> {
  const token = await getToken()
  let res: Response
  try {
    res = await fetch(`${API_URL}/api/v1${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, '連不上伺服器，請確認網路')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new ApiError(res.status, typeof data?.detail === 'string' ? data.detail : `請求失敗（${res.status}）`)
  }
  return (await res.json()) as T
}

/** 欄位 snake_case，與後端 schemas 一致 */
export interface Me {
  id: number
  name: string
  role: string
  carrier_name: string | null
}

export interface Trip {
  id: number
  trip_no: string
  pickup_at: string
  pickup_address: string
  dropoff_address: string
  plate_no: string | null
  status: TripStatus
}

export interface LocationPoint {
  ts: string
  lat: number
  lng: number
  speed: number | null
  heading: number | null
  accuracy: number | null
}

export const login = (username: string, password: string) =>
  api<{ access_token: string; user: Me }>('/auth/login', { username, password })
export const me = () => api<Me>('/auth/me')
export const myTrips = () => api<Trip[]>('/driver/trips')
export const setTripStatus = (id: number, status: TripStatus) => api<Trip>(`/driver/trips/${id}/status`, { status })
export const sendLocations = (id: number, points: LocationPoint[]) =>
  api<{ accepted: number; trip_status: TripStatus }>(`/driver/trips/${id}/locations`, { points })
