import { confirm, toast } from '@/components/Feedback'
import { StatusChip } from '@/components/StatusChip'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { TRIP_STATUS, type TripStatus } from '@/lib/trip'

const SWATCHES = [
  ['brand', 'bg-brand'],
  ['cta', 'bg-cta'],
  ['success', 'bg-success'],
  ['warn', 'bg-warn'],
  ['danger', 'bg-danger'],
  ['info', 'bg-info'],
  ['sidebar', 'bg-sidebar'],
] as const

/** 元件範例頁：新專案開好後先看這頁，確認品牌色與元件長相 */
export default function UiKitPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>色票</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {SWATCHES.map(([name, cls]) => (
            <div key={name} className="flex flex-col items-center gap-1 text-xs text-fg-muted">
              <div className={`size-12 rounded-md ${cls}`} />
              {name}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>車趟狀態</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(Object.keys(TRIP_STATUS) as TripStatus[]).map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>按鈕</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="primary">主要</Button>
          <Button variant="cta">派車</Button>
          <Button variant="secondary">次要</Button>
          <Button variant="ghost">文字</Button>
          <Button variant="danger">刪除</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知、確認框、對話框</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toast.success('已儲存')}>成功通知</Button>
          <Button onClick={() => toast.error('司機電話格式不正確')}>錯誤通知</Button>
          <Button
            variant="danger"
            onClick={async () => {
              if (await confirm({ title: '刪除派車單？', message: '刪除後無法復原', danger: true, confirmText: '刪除' }))
                toast.success('已刪除')
            }}
          >
            確認框
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">對話框</Button>
            </DialogTrigger>
            <DialogContent title="新增車輛" description="車號存檔後不可修改">
              <div className="flex flex-col gap-4">
                <Field label="車號" htmlFor="plate" hint="例：RAA-1234">
                  <Input id="plate" />
                </Field>
                <Button variant="primary">儲存</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>表單</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="乘客姓名" htmlFor="name">
            <Input id="name" placeholder="王小明" />
          </Field>
          <Field label="電話" htmlFor="phone" error="電話格式不正確">
            <Input id="phone" defaultValue="0912" />
          </Field>
        </CardContent>
      </Card>
    </div>
  )
}
