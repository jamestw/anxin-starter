import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: number
  name: string
  role: 'carrier_admin' | 'dispatcher' | 'platform_admin'
  carrier_id: number | null
  carrier_name: string | null
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

/** 登入狀態：zustand 只放這類全域狀態；伺服器資料一律走 TanStack Query */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'anxin.auth' },
  ),
)
