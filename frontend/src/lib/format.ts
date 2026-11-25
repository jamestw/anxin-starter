/** 時間一律以台北時區顯示（後端傳 ISO 8601 含時區） */
const tw = new Intl.DateTimeFormat('zh-TW', {
  timeZone: 'Asia/Taipei',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatDateTime(iso: string) {
  return tw.format(new Date(iso))
}
