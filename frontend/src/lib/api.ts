import { useAuthStore } from '@/stores/auth'

/** 後端錯誤：status＋中文訊息（後端一律回 { detail: "中文訊息" }） */
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const BASE = '/api/v1'

/** FastAPI 422 的 detail 是陣列，轉成一句中文 */
function detailToMessage(detail: unknown, status: number): string {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    const fields = detail.map((d) => (Array.isArray(d?.loc) ? d.loc.slice(1).join('.') : '')).filter(Boolean)
    return fields.length ? `欄位格式不正確：${fields.join('、')}` : '資料格式不正確'
  }
  return status >= 500 ? '伺服器發生錯誤，請稍後再試' : `請求失敗（${status}）`
}

/**
 * 唯一的 fetch 入口：自動帶 token、JSON 編解碼、錯誤轉 ApiError、401 自動登出。
 * 各資源的呼叫寫在 src/api/<資源>.ts，頁面再用 TanStack Query 包。
 */
export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  const token = useAuthStore.getState().token
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  if (res.status === 401 && token) {
    useAuthStore.getState().logout()
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, detailToMessage(body?.detail, res.status))
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
