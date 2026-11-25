/**
 * 安心行 設計 token —— React Native / Expo 用（與 tokens.css 同一組值）。
 * 專案只覆寫 brand 與 cta：`const theme = { ...tokens, brand: { ...tokens.brand, main: '#0d3b2e' } }`
 */
export const tokens = {
  brand: { main: '#1c3dd1', hover: '#1733b0', soft: '#eef2ff', on: '#ffffff' },
  cta: { main: '#f59e0b', soft: '#fff4db', on: '#613b00' },
  neutral: {
    bg: '#f3f5f9',
    surface: '#ffffff',
    surface2: '#f8fafc',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',
    text: '#0f172a',
    text2: '#334155',
    muted: '#64748b',
  },
  semantic: {
    success: { fg: '#067647', bg: '#ecfdf3' },
    warn: { fg: '#b54708', bg: '#fffaeb' },
    danger: { fg: '#d92d20', bg: '#fef3f2' },
    info: { fg: '#1d4ed8', bg: '#eff6ff' },
  },
  trip: {
    assigned: { fg: '#1d4ed8', bg: '#eff6ff', label: '已指派' },
    departed: { fg: '#b45309', bg: '#fff4db', label: '已出發' },
    onboard: { fg: '#067647', bg: '#e3f6ec', label: '已上車' },
    done: { fg: '#64748b', bg: '#eef1f6', label: '完成' },
    alert: { fg: '#d92d20', bg: '#fde8e6', label: '異常' },
  },
  font: {
    // RN 不吃 fallback 清單：iOS 用系統字（PingFang TC），Android 用 Noto Sans TC（系統內建）
    sans: undefined as string | undefined,
    sizeBody: 16,
    sizeSmall: 13,
    sizeTitle: 20,
  },
  radius: { sm: 6, md: 8, lg: 12 },
} as const

export type TripStatus = keyof typeof tokens.trip
