import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'

import { login } from '@/api/auth'
import { APP_NAME, APP_SUBTITLE } from '@/components/AppShell'
import { toast } from '@/components/Feedback'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const token = useAuthStore((s) => s.token)
  const setLogin = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (r) => {
      setLogin(r.access_token, r.user)
      navigate('/', { replace: true })
    },
    onError: (e) => toast.error(e.message),
  })

  if (token) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <img src="/favicon.svg" alt="" className="size-10 rounded-lg" />
            <div>
              <div className="text-xl font-bold text-fg">{APP_NAME}</div>
              <div className="text-sm text-fg-muted">{APP_SUBTITLE}</div>
            </div>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate()
            }}
          >
            <Field label="帳號" htmlFor="username">
              <Input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Field>
            <Field label="密碼" htmlFor="password">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button type="submit" variant="primary" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? '登入中…' : '登入'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
