import { TRIP_STATUS, type TripStatus } from '@/lib/trip'
import { cn } from '@/lib/utils'

/** 車趟狀態徽章：顏色只從 trip-* token 來，頁面不要自己寫顏色 */
export function StatusChip({ status, className }: { status: TripStatus; className?: string }) {
  const s = TRIP_STATUS[status]
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', s.className, className)}
    >
      {s.label}
    </span>
  )
}
