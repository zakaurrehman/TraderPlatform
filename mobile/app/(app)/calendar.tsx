import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useApi } from '@/api/hooks'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import { formatDateTime } from '@/lib/format'
import type { EconomicEvent, Impact } from '@/types'

const COLORS: Record<Impact, { color: string; bg: string }> = {
  HIGH: { color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  MEDIUM: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  LOW: { color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
}

export default function CalendarScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useApi<EconomicEvent[]>('/api/calendar')
  const now = Date.now()
  const events = (data ?? []).filter((e) => new Date(e.eventTime).getTime() >= now - 7 * 86400000)
  const upcoming = events.filter((e) => new Date(e.eventTime).getTime() >= now)
  const past = events.filter((e) => new Date(e.eventTime).getTime() < now).reverse()

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load calendar" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.legend}>
        {(Object.keys(COLORS) as Impact[]).map((k) => (
          <View key={k} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS[k].color }]} />
            <Text style={styles.legendLabel}>{k}</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: spacing.lg }}>
        {events.length === 0 ? (
          <EmptyState icon="calendar-outline" title="No events scheduled." subtitle="Admin will add them soon." />
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <Text style={styles.section}>Upcoming</Text>
                {upcoming.map((ev) => (
                  <EventRow key={ev.id} ev={ev} />
                ))}
              </>
            )}
            {past.length > 0 && (
              <>
                <Text style={[styles.section, { color: colors.muted2 }]}>Past (7 days)</Text>
                {past.map((ev) => (
                  <EventRow key={ev.id} ev={ev} past />
                ))}
              </>
            )}
          </>
        )}
      </View>
    </Screen>
  )
}

function EventRow({ ev, past }: { ev: EconomicEvent; past?: boolean }) {
  const c = COLORS[ev.impact]
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: past ? 'rgba(16,19,26,0.02)' : colors.card,
          borderLeftColor: c.color,
          opacity: past ? 0.75 : 1,
        },
      ]}
    >
      <View style={styles.rowHead}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={[styles.tag, { backgroundColor: c.bg }]}>
            <Text style={{ color: c.color, fontSize: font.tiny, fontWeight: '700' }}>{ev.impact}</Text>
          </View>
          <View style={styles.tagCur}>
            <Text style={{ color: colors.primary, fontSize: font.tiny, fontWeight: '700' }}>{ev.currency}</Text>
          </View>
        </View>
        <Text style={styles.time}>{formatDateTime(ev.eventTime)}</Text>
      </View>
      <Text style={styles.eventName}>{ev.name}</Text>
      {past && (ev.actual || ev.forecast || ev.previous) ? (
        <View style={styles.numbersRow}>
          {ev.actual ? <Text style={[styles.numCell, { color: colors.green }]}>Actual: {ev.actual}</Text> : null}
          {ev.forecast ? <Text style={[styles.numCell, { color: colors.secondary }]}>Forecast: {ev.forecast}</Text> : null}
          {ev.previous ? <Text style={[styles.numCell, { color: colors.muted2 }]}>Prev: {ev.previous}</Text> : null}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', gap: 14, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: colors.muted, fontSize: font.tiny },
  section: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginTop: spacing.md, marginBottom: spacing.sm },
  row: { borderWidth: 1, borderColor: colors.borderSoft, borderLeftWidth: 3, borderRadius: radius.md, padding: 12, marginBottom: 8 },
  rowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { paddingHorizontal: 7, paddingVertical: 1, borderRadius: radius.pill },
  tagCur: { backgroundColor: colors.overlay, paddingHorizontal: 7, paddingVertical: 1, borderRadius: radius.pill },
  time: { color: colors.muted2, fontSize: font.tiny },
  eventName: { color: colors.ink, fontWeight: '700', fontSize: 14, marginTop: 4 },
  numbersRow: { flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' },
  numCell: { fontSize: font.small },
})
