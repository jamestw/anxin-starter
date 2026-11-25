import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useEffect, useState } from 'react'
import { Toaster, toast as sonner } from 'sonner'

import { Button } from '@/components/ui/button'

/**
 * 全站通知與確認框（規範第二層），所有頁面只用這兩個：
 *   toast.success('已儲存') / toast.error(e.message) / toast.info('...')
 *   if (await confirm({ title: '刪除派車單？', message: '刪除後無法復原', danger: true })) { ... }
 * <FeedbackHost /> 放在 App 最外層一次即可。
 */
export const toast = {
  success: (msg: string) => sonner.success(msg),
  error: (msg: string) => sonner.error(msg),
  info: (msg: string) => sonner(msg),
}

interface ConfirmOptions {
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void }
let openConfirm: ((p: Pending) => void) | null = null

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (!openConfirm) {
      resolve(window.confirm(options.title))
      return
    }
    openConfirm({ ...options, resolve })
  })
}

export function FeedbackHost() {
  const [pending, setPending] = useState<Pending | null>(null)

  useEffect(() => {
    openConfirm = setPending
    return () => {
      openConfirm = null
    }
  }, [])

  const close = (ok: boolean) => {
    pending?.resolve(ok)
    setPending(null)
  }

  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      <AlertDialog.Root open={!!pending} onOpenChange={(open) => !open && close(false)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-5 shadow-md">
            <AlertDialog.Title className="text-[17px] font-semibold text-fg">{pending?.title}</AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-fg-muted">
              {pending?.message ?? ''}
            </AlertDialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button variant="secondary">{pending?.cancelText ?? '取消'}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button variant={pending?.danger ? 'dangerSolid' : 'primary'} onClick={() => close(true)}>
                  {pending?.confirmText ?? '確定'}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}
