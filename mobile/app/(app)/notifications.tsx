import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import { timeAgo } from '@/lib/format'
import type { AppNotification } from '@/types'

export default function NotificationsScreen() {
  const router = useRouter()
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<AppNotification[]>('/api/notifications')
  const items = data ?? []
  const unread = items.filter((n) => !n.read).length

  async function open(n: AppNotification) {
    if (!n.read) {
      await apiFetch('/api/notifications', { method: 'PATCH', body: { id: n.id } }).catch(() => {})
      qc.invalidateQueries({ queryKey: ['/api/notifications'] })
    }
    if (n.link) {
      const path = n.link.startsWith('/(') ? n.link : `/(app)${n.link}`
      router.push(path as never)
    }
  }

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.head}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.sub}>{unread} unread</Text>
      </View>
      <View style={{ padding: spacing.lg }}>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState message="Could not load notifications" onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState icon="notifications-outline" title="No notifications yet." />
        ) : (
          items.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => open(n)}
              style={[
                styles.card,
                {
                  backgroundColor: n.read ? 'rgba(255,255,255,0.02)' : colors.card,
                  borderColor: n.read ? colors.borderSoft : 'rgba(245,197,24,0.18)',
                  borderLeftWidth: n.read ? 1 : 3,
                  borderLeftColor: n.read ? colors.borderSoft : colors.gold,
                },
              ]}
            >
              <View style={styles.headerRow}>
                <Text style={[styles.titleRow, { fontWeight: n.read ? '400' : '700' }]}>{n.title}</Text>
                <View style={styles.metaRow}>
                  {!n.read ? <View style={styles.dot} /> : null}
                  <Text style={styles.time}>{timeAgo(n.createdAt)}</Text>
                </View>
              </View>
              <Text style={styles.message}>{n.message}</Text>
            </Pressable>
          ))
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  title: { color: colors.white, fontWeight: '800', fontSize: 20 },
  sub: { color: colors.muted, fontSize: font.body, marginTop: 2 },
  card: { borderWidth: 1, borderRadius: radius.md, padding: 14, marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  titleRow: { color: colors.white, fontSize: 14, flex: 1, marginRight: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  time: { color: colors.muted2, fontSize: font.tiny },
  message: { color: colors.muted, fontSize: font.body },
})
