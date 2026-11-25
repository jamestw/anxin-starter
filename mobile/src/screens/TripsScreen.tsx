import { useCallback, useEffect, useState } from 'react'
import { Alert, AppState, FlatList, RefreshControl, Text, View } from 'react-native'

import type { TripStatus } from '../../../tokens/tokens'
import { myTrips, setTripStatus, type Me, type Trip } from '../api'
import { ensurePermissions, getActiveTrip, startTracking, stopTracking } from '../location'
import { NEXT_ACTION, TRACKING } from '../tripFlow'
import { Button, Card, StatusChip, s } from '../ui'

const time = new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei' })

/** 今日車趟：列表＋每趟一顆「下一步」大按鈕；出發後自動開始回傳定位 */
export default function TripsScreen({ me, onLogout }: { me: Me; onLogout: () => void }) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await myTrips()
      setTrips(list)
      // App 重開時：有進行中的車趟但定位沒在跑 → 重新開始；都結束了 → 停止
      const running = list.find((t) => TRACKING.includes(t.status))
      const active = await getActiveTrip()
      if (running && active !== running.id) await startTracking(running.id)
      if (!running && active) await stopTracking()
    } catch (e) {
      Alert.alert('讀取車趟失敗', (e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const sub = AppState.addEventListener('change', (st) => st === 'active' && load())
    return () => sub.remove()
  }, [load])

  const advance = async (trip: Trip, to: TripStatus) => {
    if (to === 'departed' && !(await ensurePermissions())) {
      Alert.alert('需要定位權限', '請到設定把定位改成「一律允許」，調度和乘客才看得到車輛位置。')
      return
    }
    setBusyId(trip.id)
    try {
      const updated = await setTripStatus(trip.id, to)
      setTrips((list) => list.map((t) => (t.id === updated.id ? updated : t)))
      if (TRACKING.includes(updated.status)) await startTracking(updated.id)
      else await stopTracking()
    } catch (e) {
      Alert.alert('更新失敗', (e as Error).message)
      load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <View style={[s.screen, { paddingTop: 56 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
        <View>
          <Text style={s.title}>今日車趟</Text>
          <Text style={s.muted}>
            {me.name}・{me.carrier_name}
          </Text>
        </View>
        <Button title="登出" variant="secondary" onPress={onLogout} style={{ minHeight: 40 }} />
      </View>
      <FlatList
        data={trips}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={!loading ? <Text style={[s.muted, { textAlign: 'center' }]}>目前沒有車趟</Text> : undefined}
        renderItem={({ item }) => {
          const next = NEXT_ACTION[item.status]
          return (
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[s.title, s.num]}>{time.format(new Date(item.pickup_at))}</Text>
                <StatusChip status={item.status} />
              </View>
              <Text style={s.body}>{item.pickup_address}</Text>
              <Text style={s.muted}>→ {item.dropoff_address}</Text>
              <Text style={[s.muted, s.num]}>
                {item.trip_no}
                {item.plate_no ? `・${item.plate_no}` : ''}
              </Text>
              {next && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <Button
                    title={next.label}
                    variant="cta"
                    style={{ flex: 1 }}
                    loading={busyId === item.id}
                    onPress={() => advance(item, next.to)}
                  />
                  {item.status !== 'assigned' && (
                    <Button title="回報異常" variant="danger" onPress={() => advance(item, 'alert')} />
                  )}
                </View>
              )}
            </Card>
          )
        }}
      />
    </View>
  )
}
