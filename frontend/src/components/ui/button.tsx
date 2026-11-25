import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * 按鈕四級（規範第二層）：
 * primary 品牌色，一個畫面一兩顆 · secondary 白底框線 · ghost 文字 · danger 淡紅（確認框裡才用 dangerSolid）
 * cta 琥珀色，只給「最重要的一個動作」（例如派車、送出）
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/25 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-on-brand hover:bg-brand-hover',
        cta: 'bg-cta text-on-cta font-bold hover:brightness-95',
        secondary: 'border border-border-strong bg-surface text-fg-2 hover:bg-surface-2',
        ghost: 'text-fg-2 hover:bg-brand-soft',
        danger: 'bg-danger-soft text-danger hover:bg-danger hover:text-white',
        dangerSolid: 'bg-danger text-white hover:brightness-95',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-9 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
