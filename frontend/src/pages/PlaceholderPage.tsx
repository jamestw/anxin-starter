import { Card, CardContent } from '@/components/ui/card'

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <Card>
      <CardContent className="text-fg-muted">{title}：這頁留給新專案自己填。</CardContent>
    </Card>
  )
}
