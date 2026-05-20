import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useApi } from '@/api/hooks'
import SignalCard from '@/components/SignalCard'
import { Screen, Loader, ErrorState, Card, colors, font, spacing, radius } from '@/components/ui'
import type { Signal, SignalStat } from '@/types'

type StatsResp = { current: SignalStat | null; months: SignalStat[] }

export default function SignalHistoryScreen() {
  const closedQ = useApi<Signal[]>('/api/signals?history=1')
  const statsQ = useApi<StatsResp>('/api/signals?stats=1')

  if (closedQ.isLoading) return <Screen><Loader /></Screen>
  if (closedQ.isError)
    return <Screen><ErrorState message="Could not load history" onRetry={() => closedQ.refetch()} /></Screen>

  const closed = closedQ.data ?? []
  const tp = closed.filter((s) => s.status === 'HIT_TP').length
  const sl = closed.filter((s) => s.status === 'HIT_SL').length
  const wr = closed.length > 0 ? Math.round((tp / closed.length) * 100) : 0
  const months = statsQ.data?.months ?? []

  return (
    <Screen scroll refreshing={closedQ.isRefetching} onRefresh={() => { closedQ.refetch(); statsQ.refetch() }}>
      <View style={{ padding: spacing.lg }}>
        <Card>
          <Text style={styles.cardLabel}>Overall Performance</Text>
          <View style={styles.grid}>
            <Box value={`${wr}%`} label="Win Rate" color={colors.gold} bg="rgba(245,197,24,0.06)" />
            <Box value={`${tp}`} label="TP Hits" color={colors.green} bg="rgba(0,200,81,0.06)" />
            <Box value={`${sl}`} label="SL Hits" color={colors.red} bg="rgba(255,68,68,0.06)" />
          </View>
        </Card>

        {months.length > 0 && (
          <>
            <Text style={styles.section}>Monthly Breakdown</Text>
            {months.map((s) => (
              <View key={s.id} style={styles.monthRow}>
                <View>
                  <Text style={styles.monthName}>{s.month}</Text>
                  <Text style={styles.monthSub}>{s.totalSignals} signals</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.monthWr}>{s.winRate}%</Text>
                  <Text style={styles.monthPips}>+{s.pipsGained} pips</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <Text style={styles.section}>Closed Signals</Text>
        {closed.length === 0 ? (
          <Text style={styles.empty}>No closed signals yet.</Text>
        ) : (
          closed.map((s) => <SignalCard key={s.id} signal={s} />)
        )}
      </View>
    </Screen>
  )
}

function Box({ value, label, color, bg }: { value: string; label: string; color: string; bg: string }) {
  return (
    <View style={[styles.box, { backgroundColor: bg }]}>
      <Text style={{ color, fontWeight: '800', fontSize: 24 }}>{value}</Text>
      <Text style={{ color: colors.muted, fontSize: font.micro, marginTop: 2 }}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cardLabel: { color: colors.muted, fontSize: font.small, marginBottom: 10 },
  grid: { flexDirection: 'row', gap: 10 },
  box: { flex: 1, borderRadius: radius.sm, paddingVertical: 12, alignItems: 'center' },
  section: { color: colors.secondary, fontSize: font.body, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  monthRow: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  monthName: { color: colors.white, fontWeight: '700', fontSize: 14 },
  monthSub: { color: colors.muted, fontSize: font.small },
  monthWr: { color: colors.gold, fontWeight: '800', fontSize: 16 },
  monthPips: { color: colors.green, fontSize: font.small },
  empty: { color: colors.muted2, textAlign: 'center', padding: 32 },
})
