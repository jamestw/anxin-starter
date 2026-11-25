import { CarFront, LayoutDashboard, LogOut, Palette, Settings, type LucideIcon } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router'

import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/** 選單在這裡集中定義；新專案只改這個陣列 */
export const NAV: NavItem[] = [
  { to: '/', label: '總覽', icon: LayoutDashboard },
  { to: '/trips', label: '車趟', icon: CarFront },
  { to: '/ui', label: '元件範例', icon: Palette },
  { to: '/settings', label: '設定', icon: Settings },
]

/** 專案名稱：新專案改這裡（品牌色改 styles/brand.css） */
export const APP_NAME = '安心行'
export const APP_SUBTITLE = '車行後台'

/**
 * 後台外框（規範第二層）：
 * 電腦（sm 以上）左側深色側欄；手機改成固定在下方的 navbar（單手好按），標題放上方。
 */
export function AppShell() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { pathname } = useLocation()
  const current = NAV.find((n) => (n.to === '/' ? pathname === '/' : pathname.startsWith(n.to)))

  return (
    <div className="min-h-screen sm:grid sm:grid-cols-[212px_minmax(0,1fr)]">
      <aside className="hidden h-screen flex-col bg-sidebar p-3 text-sidebar-text sm:sticky sm:top-0 sm:flex">
        <div className="flex items-center gap-2.5 px-2 pb-5 pt-1">
          <img src="/favicon.svg" alt="" className="size-8 rounded-md" />
          <div className="leading-tight">
            <strong className="block text-base text-white">{APP_NAME}</strong>
            <span className="text-xs">{APP_SUBTITLE}</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5" aria-label="主選單">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm',
                  isActive ? 'bg-brand text-white' : 'hover:bg-sidebar-2 hover:text-white',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 px-2 pt-3 text-xs">
          <div className="text-white">{user?.name}</div>
          <div>{user?.carrier_name ?? '平台管理'}</div>
          <button onClick={logout} className="mt-2 flex items-center gap-1.5 hover:text-white">
            <LogOut className="size-3.5" /> 登出
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col pb-16 sm:pb-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-surface px-4">
          <h1 className="text-xl font-semibold text-fg">{current?.label ?? APP_NAME}</h1>
          <span className="text-sm text-fg-muted sm:hidden">{user?.carrier_name}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-surface sm:hidden"
        style={{ gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))` }}
        aria-label="主選單"
      >
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-0.5 py-2 text-xs', isActive ? 'text-brand' : 'text-fg-muted')
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
