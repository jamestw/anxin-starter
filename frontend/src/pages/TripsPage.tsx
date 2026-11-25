import { useState } from 'react'

import { useTrips } from '@/api/trips'
import { StatusChip } from '@/components/StatusChip'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, Td, Th } from '@/components/ui/table'
import { formatDateTime } from '@/lib/format'

/** 列表頁範本：搜尋＋電腦版表格＋手機版卡片清單 */
export default function TripsPage() {
  const [q, setQ] = useState('')
  const { data, isLoading, error } = useTrips(q)

  return (
    <div className="flex flex-col gap-4">
      <Input className="max-w-xs" placeholder="搜尋單號、地址、司機" value={q} onChange={(e) => setQ(e.target.value)} />

      {isLoading && <p className="text-fg-muted">載入中…</p>}
      {error && <p className="text-danger">{error.message}</p>}
      {data && data.items.length === 0 && <p className="text-fg-muted">沒有符合的車趟</p>}

      {data && data.items.length > 0 && (
        <>
          <div className="hidden sm:block">
            <Table>
              <thead>
                <tr>
                  <Th>單號</Th>
                  <Th>上車時間</Th>
                  <Th>上車地點</Th>
                  <Th>下車地點</Th>
                  <Th>司機／車號</Th>
                  <Th>狀態</Th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-2">
                    <Td className="num">{t.trip_no}</Td>
                    <Td className="num">{formatDateTime(t.pickup_at)}</Td>
                    <Td>{t.pickup_address}</Td>
                    <Td>{t.dropoff_address}</Td>
                    <Td>
                      {t.driver_name ?? '未指派'} <span className="num text-fg-muted">{t.plate_no}</span>
                    </Td>
                    <Td>
                      <StatusChip status={t.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="flex flex-col gap-3 sm:hidden">
            {data.items.map((t) => (
              <Card key={t.id}>
                <CardContent className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="num font-semibold">{formatDateTime(t.pickup_at)}</span>
                    <StatusChip status={t.status} />
                  </div>
                  <div>{t.pickup_address}</div>
                  <div className="text-fg-muted">→ {t.dropoff_address}</div>
                  <div className="text-sm text-fg-2">
                    {t.driver_name ?? '未指派'} <span className="num">{t.plate_no}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
