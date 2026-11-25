import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { getToken, me as fetchMe, setToken, type Me } from './src/api'
import { stopTracking } from './src/location'
import LoginScreen from './src/screens/LoginScreen'
import TripsScreen from './src/screens/TripsScreen'
import { s } from './src/ui'
import { theme } from './src/theme'

export default function App() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<Me | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        if (await getToken()) setUser(await fetchMe())
      } catch {
        await setToken(null)
      } finally {
        setReady(true)
      }
    })()
  }, [])

  const logout = async () => {
    await stopTracking()
    await setToken(null)
    setUser(null)
  }

  if (!ready) {
    return (
      <View style={[s.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={theme.brand.main} />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="dark" />
      {user ? <TripsScreen me={user} onLogout={logout} /> : <LoginScreen onLogin={setUser} />}
    </>
  )
}
