import { tokens } from '../../tokens/tokens'

/**
 * 本 App 的主題：共用 token＋本專案品牌色。
 * 新專案只改 brand / cta（跟網頁 frontend/src/styles/brand.css 同一組值），其他顏色不要改。
 */
export const theme = {
  ...tokens,
  brand: { ...tokens.brand, main: '#1c3dd1' },
  cta: { ...tokens.cta, main: '#f59e0b' },
}
