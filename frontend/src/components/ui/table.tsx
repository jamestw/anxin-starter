import * as React from 'react'

import { cn } from '@/lib/utils'

/** 表格：外層可橫捲、表頭固定；手機版請另給卡片清單（見 TripsPage） */
export function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="max-h-[70vh] overflow-auto rounded-lg border border-border bg-surface">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  )
}

export function Th({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'sticky top-0 z-10 whitespace-nowrap border-b border-border bg-surface-2 px-3 py-2.5 text-left font-semibold text-fg-2',
        className,
      )}
      {...props}
    />
  )
}

export function Td({ className, ...props }: React.ComponentProps<'td'>) {
  return <td className={cn('border-b border-border px-3 py-2.5 text-fg', className)} {...props} />
}
