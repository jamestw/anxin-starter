/** 車趟狀態：名稱與後端 TripStatus、司機 App 一致；顏色只走 trip-* token */
export const TRIP_STATUS = {
  assigned: { label: '已指派', className: 'bg-trip-assigned-soft text-trip-assigned' },
  departed: { label: '已出發', className: 'bg-trip-departed-soft text-trip-departed' },
  onboard: { label: '已上車', className: 'bg-trip-onboard-soft text-trip-onboard' },
  done: { label: '完成', className: 'bg-trip-done-soft text-trip-done' },
  alert: { label: '異常', className: 'bg-trip-alert-soft text-trip-alert' },
} as const

export type TripStatus = keyof typeof TRIP_STATUS
