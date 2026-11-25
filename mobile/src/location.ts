/**
 * 背景定位：系統每給一批位置就存進佇列再上傳；斷線時留在佇列，恢復後補傳（每批最多 500 點）。
 * 做法沿用 RideRadar 司機 App。
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

import { ApiError, sendLocations, type LocationPoint } from './api'
import { LOCATION_DISTANCE_M, LOCATION_INTERVAL_MS } from './config'
import { TRACKING } from './tripFlow'

export const LOCATION_TASK = 'anxin-location'
const QUEUE_KEY = 'anxin.queue'
const TRIP_KEY = 'anxin.activeTrip'
const BATCH = 500
const MAX_QUEUE = 20000

let flushing = false

async function readQueue(): Promise<LocationPoint[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY)
  return raw ? (JSON.parse(raw) as LocationPoint[]) : []
}

const writeQueue = (points: LocationPoint[]) => AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(points.slice(-MAX_QUEUE)))

export async function getActiveTrip(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(TRIP_KEY)
  return raw ? Number(raw) : null
}

async function enqueue(locations: Location.LocationObject[]) {
  const points = locations.map<LocationPoint>((l) => ({
    ts: new Date(l.timestamp).toISOString(),
    lat: l.coords.latitude,
    lng: l.coords.longitude,
    speed: l.coords.speed ?? null,
    heading: l.coords.heading ?? null,
    accuracy: l.coords.accuracy ?? null,
  }))
  await writeQueue([...(await readQueue()), ...points])
}

/** 上傳佇列；伺服器說車趟已不需追蹤就自動停止 */
export async function flush(): Promise<void> {
  const tripId = await getActiveTrip()
  if (!tripId || flushing) return
  flushing = true
  try {
    let queue = await readQueue()
    while (queue.length) {
      const batch = queue.slice(0, BATCH)
      const ack = await sendLocations(tripId, batch)
      queue = queue.slice(batch.length)
      await writeQueue(queue)
      if (!TRACKING.includes(ack.trip_status)) {
        await stopTracking()
        return
      }
    }
  } catch (e) {
    // 404：車趟已改派，丟掉佇列避免卡住；其他錯誤（離線）保留等下次
    if (e instanceof ApiError && (e.status === 403 || e.status === 404)) await stopTracking()
  } finally {
    flushing = false
  }
}

/** 要求定位權限（前景＋背景）。回傳 false 代表司機沒有允許「一律允許」 */
export async function ensurePermissions(): Promise<boolean> {
  const fg = await Location.requestForegroundPermissionsAsync()
  if (fg.status !== 'granted') return false
  const bg = await Location.requestBackgroundPermissionsAsync()
  return bg.status === 'granted'
}

export async function startTracking(tripId: number) {
  await AsyncStorage.multiSet([
    [TRIP_KEY, String(tripId)],
    [QUEUE_KEY, '[]'],
  ])
  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: LOCATION_INTERVAL_MS,
    distanceInterval: LOCATION_DISTANCE_M,
    pausesUpdatesAutomatically: false,
    activityType: Location.ActivityType.AutomotiveNavigation,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: '行程進行中',
      notificationBody: '正在回傳車輛位置',
    },
  })
}

export async function stopTracking() {
  if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK)
  }
  await AsyncStorage.multiRemove([TRIP_KEY, QUEUE_KEY])
}

TaskManager.defineTask<{ locations: Location.LocationObject[] }>(LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return
  await enqueue(data.locations)
  await flush()
})
