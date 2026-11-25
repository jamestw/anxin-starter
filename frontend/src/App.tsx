import { Route, Routes } from 'react-router'

import { AppShell } from '@/components/AppShell'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import TripsPage from '@/pages/TripsPage'
import UiKitPage from '@/pages/UiKitPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* 公開頁（乘客追車 /p/:token、客戶入口 /c/:slug）放在這裡，不包 ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<PlaceholderPage title="總覽" />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="ui" element={<UiKitPage />} />
          <Route path="settings" element={<PlaceholderPage title="設定" />} />
        </Route>
      </Route>
    </Routes>
  )
}
