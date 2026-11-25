import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** 合併 className（shadcn 慣例） */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
