import * as React from 'react'

import { cn } from '@/lib/utils'

/** 聚焦樣式（淡黃底＋品牌框）由 styles/index.css 全站統一處理 */
export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-fg placeholder:text-fg-muted disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
