/**
 * 後端網址：建置時用 EXPO_PUBLIC_API_URL（eas.json 的 env）。
 * 開發時預設連本機；Android 模擬器連本機要用 10.0.2.2，實機請改成電腦的區網 IP。
 */
const DEFAULT_API_URL = __DEV__ ? 'http://localhost:8000' : 'https://your-domain.example'
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '')

/** 行程中定位回傳間隔 */
export const LOCATION_INTERVAL_MS = 5000
export const LOCATION_DISTANCE_M = 10
