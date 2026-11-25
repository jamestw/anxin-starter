/**
 * Tailwind 3 舊專案用的 preset：顏色全部指向 tokens.css 的 CSS 變數。
 * 用法（tailwind.config.js）：
 *   import anxin from './tokens/tailwind-preset.js'
 *   export default { presets: [anxin], content: [...] }
 * 並在 index.css 最上方 @import './tokens/tokens.css'。
 * 新專案用 Tailwind 4，不需要這個檔（frontend/src/styles/index.css 的 @theme 已對好）。
 */
const v = (name) => `var(--${name})`

export default {
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: v('brand'), hover: v('brand-hover'), soft: v('brand-soft'), on: v('on-brand') },
        cta: { DEFAULT: v('cta'), soft: v('cta-soft'), on: v('on-cta') },
        bg: v('bg'),
        surface: { DEFAULT: v('surface'), 2: v('surface-2') },
        border: { DEFAULT: v('border'), strong: v('border-strong') },
        fg: { DEFAULT: v('text'), 2: v('text-2'), muted: v('muted') },
        success: { DEFAULT: v('success'), soft: v('success-soft') },
        warn: { DEFAULT: v('warn'), soft: v('warn-soft') },
        danger: { DEFAULT: v('danger'), soft: v('danger-soft') },
        info: { DEFAULT: v('info'), soft: v('info-soft') },
        trip: {
          assigned: v('trip-assigned'),
          'assigned-soft': v('trip-assigned-soft'),
          departed: v('trip-departed'),
          'departed-soft': v('trip-departed-soft'),
          onboard: v('trip-onboard'),
          'onboard-soft': v('trip-onboard-soft'),
          done: v('trip-done'),
          'done-soft': v('trip-done-soft'),
          alert: v('trip-alert'),
          'alert-soft': v('trip-alert-soft'),
        },
        sidebar: { DEFAULT: v('sidebar'), 2: v('sidebar-2'), text: v('sidebar-text') },
      },
      fontFamily: { sans: v('font-body') },
      borderRadius: { sm: v('round-sm'), DEFAULT: v('round'), lg: v('round-lg') },
      boxShadow: { sm: v('elev-sm'), md: v('elev-md') },
    },
  },
}
