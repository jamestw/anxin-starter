import { api } from '@/lib/api'
import type { AuthUser } from '@/stores/auth'

export interface LoginResponse {
  access_token: string
  user: AuthUser
}

export function login(username: string, password: string) {
  return api<LoginResponse>('/auth/login', { method: 'POST', json: { username, password } })
}
