import type { ReactNode } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native'

import type { TripStatus } from '../../tokens/tokens'
import { theme } from './theme'

const { neutral, radius, font } = theme

/** 按鈕：primary 品牌色、cta 琥珀（主要動作）、secondary 白底框線、danger 淡紅 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: {
  title: string
  onPress: () => void
  variant?: 'primary' | 'cta' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}) {
  const v = {
    primary: { bg: theme.brand.main, fg: theme.brand.on, border: theme.brand.main },
    cta: { bg: theme.cta.main, fg: theme.cta.on, border: theme.cta.main },
    secondary: { bg: neutral.surface, fg: neutral.text2, border: neutral.borderStrong },
    danger: { bg: theme.semantic.danger.bg, fg: theme.semantic.danger.fg, border: theme.semantic.danger.bg },
  }[variant]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.button,
        { backgroundColor: v.bg, borderColor: v.border, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={v.fg} /> : <Text style={[s.buttonText, { color: v.fg }]}>{title}</Text>}
    </Pressable>
  )
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>
}

/** 車趟狀態徽章：顏色只走 trip token，與後台一致 */
export function StatusChip({ status }: { status: TripStatus }) {
  const t = theme.trip[status]
  return (
    <View style={[s.chip, { backgroundColor: t.bg }]}>
      <Text style={[s.chipText, { color: t.fg }]}>{t.label}</Text>
    </View>
  )
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: neutral.bg },
  title: { fontSize: font.sizeTitle, fontWeight: '700', color: neutral.text },
  body: { fontSize: font.sizeBody, color: neutral.text },
  muted: { fontSize: font.sizeSmall, color: neutral.muted },
  num: { fontVariant: ['tabular-nums'] },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: neutral.borderStrong,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: neutral.surface,
    color: neutral.text,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: { fontSize: 17, fontWeight: '700' },
  card: {
    backgroundColor: neutral.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral.border,
    padding: 16,
    gap: 6,
  },
  chip: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontSize: 13, fontWeight: '700' },
})
