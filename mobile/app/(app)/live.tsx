import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useApi } from '@/api/hooks'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import { formatDateTime } from '@/lib/format'
import type { LiveSession } from '@/types'

export default function LiveScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useApi<LiveSession[]>('/api/live')
  const now = Date.now()
  const sessions = data ?? []
  const live = sessions.filter((s) => s.isLive)
  const upcoming = sessions
    .filter((s) => !s.isLive && new Date(s.scheduledAt).getTime() >= now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 10)

  function countdown(at: string) {
    const diff = new Date(at).getTime() - now
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load sessions" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {live.map((s) => (
          <View key={s.id} style={styles.liveCard}>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE NOW</Text>
            </View>
            <Text style={styles.liveTitle}>{s.title}</Text>
            {s.description ? <Text style={styles.liveDesc}>{s.description}</Text> : null}
            {s.streamUrl ? (
              <Pressable
                style={styles.watchBtn}
                onPress={() => WebBrowser.openBrowserAsync(s.streamUrl as string)}
              >
                <Text style={styles.watchBtnText}>Watch Live</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
        {live.length === 0 ? (
          <EmptyState icon="radio-outline" title="No live session right now." subtitle="Check upcoming sessions below." />
        ) : null}

        <Text style={styles.section}>Upcoming Sessions</Text>
        {upcoming.length === 0 ? (
          <Text style={styles.muted}>No upcoming sessions scheduled.</Text>
        ) : (
          upcoming.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.cardHead}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{countdown(s.scheduledAt)}</Text>
                </View>
              </View>
              {s.description ? <Text style={styles.cardDesc}>{s.description}</Text> : null}
              <Text style={styles.cardDate}>{formatDateTime(s.scheduledAt)}</Text>
            </View>
          ))
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  liveCard: { backgroundColor: 'rgba(220,38,38,0.08)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.3)', borderRadius: radius.lg, padding: 16, marginBottom: 14 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.red },
  liveText: { color: colors.redText, fontWeight: '800', fontSize: font.body, letterSpacing: 1 },
  liveTitle: { color: colors.ink, fontWeight: '800', fontSize: 18, marginBottom: 6 },
  liveDesc: { color: colors.secondary, fontSize: font.body, marginBottom: 12 },
  watchBtn: { alignSelf: 'flex-start', backgroundColor: colors.red, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 22 },
  watchBtnText: { color: colors.white, fontWeight: '700' },
  section: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginTop: spacing.md, marginBottom: spacing.sm },
  muted: { color: colors.muted2, fontSize: font.body },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, marginBottom: 10 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, flex: 1 },
  cardDesc: { color: colors.muted, fontSize: font.small, marginTop: 6 },
  cardDate: { color: colors.muted2, fontSize: font.tiny, marginTop: 6 },
  chip: { backgroundColor: 'rgba(37,99,235,0.1)', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  chipText: { color: colors.primary, fontSize: font.tiny, fontWeight: '700' },
})
