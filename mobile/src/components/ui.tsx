import React from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font, planColors, shadow } from '@/theme'

export function Screen({
  children,
  scroll,
  refreshing,
  onRefresh,
  edges = ['top'],
  style,
}: {
  children: React.ReactNode
  scroll?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
  style?: StyleProp<ViewStyle>
}) {
  return (
    <SafeAreaView style={[styles.screen, style]} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  )
}

export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
}) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  )
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}) {
  const content = <View style={[styles.card, style]}>{children}</View>
  if (onPress)
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
        {content}
      </Pressable>
    )
  return content
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  icon,
  style,
}: {
  title: string
  onPress?: () => void
  variant?: 'primary' | 'outline' | 'danger' | 'ghost'
  loading?: boolean
  disabled?: boolean
  icon?: keyof typeof Ionicons.glyphMap
  style?: StyleProp<ViewStyle>
}) {
  const isDisabled = disabled || loading
  const bg =
    variant === 'primary'
      ? colors.primary
      : variant === 'danger'
        ? colors.red
        : 'transparent'
  const fg =
    variant === 'primary' || variant === 'danger'
      ? colors.white
      : colors.primary
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && !isDisabled ? shadow.primary : null,
        {
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor: variant === 'outline' ? 'rgba(37,99,235,0.35)' : colors.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon ? <Ionicons name={icon} size={16} color={fg} /> : null}
          <Text style={{ color: fg, fontWeight: '800', fontSize: 15 }}>{title}</Text>
        </View>
      )}
    </Pressable>
  )
}

export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label?: string; error?: string }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        style={styles.input}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

export function Badge({
  label,
  color = colors.primary,
  bg,
}: {
  label: string
  color?: string
  bg?: string
}) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg || `${color}22`, borderColor: `${color}44` },
      ]}
    >
      <Text style={{ color, fontSize: font.tiny, fontWeight: '700' }}>{label}</Text>
    </View>
  )
}

export function PlanBadge({ plan }: { plan: string }) {
  const c = planColors[plan] || planColors.FREE
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: `${c.color}33` }]}>
      <Text style={{ color: c.color, fontSize: font.tiny, fontWeight: '800' }}>{plan}</Text>
    </View>
  )
}

export function Loader({ label }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      {label ? <Text style={styles.muted}>{label}</Text> : null}
    </View>
  )
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  subtitle,
}: {
  icon?: keyof typeof Ionicons.glyphMap
  title: string
  subtitle?: string
}) {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={44} color={colors.muted2} />
      <Text style={[styles.emptyTitle]}>{title}</Text>
      {subtitle ? <Text style={styles.muted}>{subtitle}</Text> : null}
    </View>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Ionicons name="alert-circle-outline" size={44} color={colors.red} />
      <Text style={[styles.emptyTitle, { color: colors.redText }]}>{message}</Text>
      {onRetry ? <Button title="Retry" variant="outline" onPress={onRetry} /> : null}
    </View>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.section}>{children}</Text>
}

export function WinRateBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <View style={styles.barTrack}>
      <View
        style={[
          styles.barFill,
          { width: `${pct}%`, backgroundColor: pct >= 60 ? colors.green : colors.primary },
        ]}
      />
    </View>
  )
}

export function LockBanner({ message }: { message: string }) {
  return (
    <View style={styles.lock}>
      <Ionicons name="lock-closed" size={18} color={colors.primary} />
      <Text style={{ color: colors.secondary, fontSize: font.body, flex: 1 }}>{message}</Text>
    </View>
  )
}

export function RiskDisclaimer() {
  return (
    <Text style={styles.disclaimer}>
      ⚠️ Risk warning: Trading Forex/CFDs carries a high level of risk and may not be
      suitable for all investors. Past performance is not indicative of future results.
      Educational content only — not financial advice.
    </Text>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  headerTitle: { color: colors.ink, fontWeight: '800', fontSize: font.h1 },
  headerSub: { color: colors.muted, fontSize: font.body, marginTop: 2 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: colors.secondary, fontSize: font.body, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 15,
  },
  errorText: { color: colors.redText, fontSize: font.small, marginTop: 4 },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  center: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 10 },
  muted: { color: colors.muted, fontSize: font.body, textAlign: 'center' },
  emptyTitle: { color: colors.body, fontSize: font.h3, fontWeight: '700', textAlign: 'center' },
  section: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: font.body,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.overlay,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: { height: 8, borderRadius: radius.pill },
  lock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(37,99,235,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    margin: spacing.lg,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: font.tiny,
    lineHeight: 16,
    padding: spacing.lg,
  },
})

export { colors, radius, spacing, font, shadow } from '@/theme'
