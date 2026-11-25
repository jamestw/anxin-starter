import type { TripStatus } from '../../tokens/tokens'

/** 司機按鈕的下一步，與後端 services/driver_service.py 的 NEXT 一致 */
export const NEXT_ACTION: Partial<Record<TripStatus, { to: TripStatus; label: string }>> = {
  assigned: { to: 'departed', label: '出發' },
  departed: { to: 'onboard', label: '乘客上車' },
  onboard: { to: 'done', label: '結束行程' },
}

/** 這些狀態要回傳定位 */
export const TRACKING: TripStatus[] = ['departed', 'onboard', 'alert']
