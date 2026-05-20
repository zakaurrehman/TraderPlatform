import React from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApi } from '@/api/hooks'
import SignalCard from '@/components/SignalCard'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import type { Signal, SignalStat } from '@/types'

type StatsResp = { current: SignalStat | null; months: SignalStat[] }

const TOOLS: { label: string; icon: keyof typeof Ionicons.glyphMap; href: string }[] = [
  { label: 'History', icon: 'time-outline', href: '/(app)/signals-history' },
  { label: 'Live', icon: 'radio-outline', href: '/(app)/live' },
  { label: 'Calendar', icon: 'calendar-outline', href: '/(app)/calendar' },
  { label: 'Watchlist', icon: 'trending-up-outline', href: '/(app)/watchlist' },
  { label: 'Calculator', icon: 'calculator-outline', href: '/(app)/calculator' },
  { label: 'Brokers', icon: 'business-outline', href: '/(app)/brokers' },
  { label: 'Resources', icon: 'folder-outline', href: '/(app)/resources' },
  { label: 'Alerts', icon: 'notifications-outline', href: '/(app)/notifications' },
]

export default function SignalsScreen() {
  const router = useRouter()
  const signals = useApi<Signal[]>('/api/signals')
  const stats = useApi<StatsResp>('/api/signals?stats=1')

  const onRefresh = () => {
    signals.refetch()
    stats.refetch()
  }
  const list = signals.data ?? []
  const cur = stats.data?.current

  return (
    <Screen scroll refreshing={signals.isRefetching} onRefresh={onRefresh}>
      <View style={styles.head}>
        <View style={styles.headRow}>
          <Text style={styles.title}>Live Signals</Text>
          <Pressable onPress={() => router.push('/(app)/signals-history')}>
            <Text style={styles.link}>History  ›</Text>
          </Pressable>
        </View>
        <View style={styles.activeRow}>
          <View style={styles.greenDot} />
          <Text style={styles.activeText}>
            {list.length} Active Signal{list.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {cur ? (
        <View style={styles.statsBanner}>
          <Text style={styles.statsMonth}>This Month — {cur.month}</Text>
          <View style={styles.statsGrid}>
            <Stat value={`${cur.winRate}%`} label="Win Rate" color={colors.gold} />
            <Stat value={`+${cur.pipsGained}`} label="Pips" color={colors.green} />
            <Stat value={`${cur.totalSignals}`} label="Signals" color={colors.white} />
          </View>
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tools} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 10 }}>
        {TOOLS.map((t) => (
          <Pressable key={t.label} style={styles.tool} onPress={() => router.push(t.href as never)}>
            <Ionicons name={t.icon} size={20} color={colors.gold} />
            <Text style={styles.toolLabel}>{t.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: 4 }}>
        {signals.isLoading ? (
          <Loader />
        ) : signals.isError ? (
          <ErrorState message="Could not load signals" onRetry={() => signals.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState icon="hourglass-outline" title="No active signals right now." subtitle="Check back soon or view signal history." />
        ) : (
          list.map((s) => <SignalCard key={s.id} signal={s} />)
        )}
      </View>
    </Screen>
  )
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ color, fontWeight: '800', fontSize: 20 }}>{value}</Text>
      <Text style={{ color: colors.muted2, fontSize: font.micro, marginTop: 2 }}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.white, fontWeight: '800', fontSize: 20 },
  link: { color: colors.gold, fontSize: font.body, fontWeight: '600' },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  activeText: { color: colors.green, fontSize: font.body, fontWeight: '700' },
  statsBanner: { margin: spacing.lg, marginBottom: spacing.sm, backgroundColor: 'rgba(245,197,24,0.06)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg },
  statsMonth: { color: colors.muted, fontSize: font.tiny, marginBottom: 8 },
  statsGrid: { flexDirection: 'row', gap: 8 },
  tools: { marginVertical: spacing.sm },
  tool: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', gap: 4, minWidth: 76 },
  toolLabel: { color: colors.secondary, fontSize: font.tiny, fontWeight: '600' },
})
