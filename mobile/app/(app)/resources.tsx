import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useApi } from '@/api/hooks'
import { useAuth } from '@/auth/AuthContext'
import { IS_IOS_FREE_ONLY } from '@/lib/gating'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import type { Resource } from '@/types'

// Tier order — matches the web `/resources` gating exactly.
const TIER_ORDER: Record<string, number> = { FREE: 0, BASIC: 1, PREMIUM: 2 }
const PLAN_TIER: Record<string, number> = { FREE: 0, BASIC: 1, PREMIUM: 2 }

const TIER_COLOR: Record<string, { color: string; bg: string }> = {
  FREE: { color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  BASIC: { color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  PREMIUM: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
}

export default function ResourcesScreen() {
  const { user } = useAuth()
  const userTier = PLAN_TIER[user?.plan ?? 'FREE'] ?? 0
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Resource[]>('/api/resources')
  // iOS: only show FREE tier resources (App Store IAP rule — Path A compliance)
  const resources = (data ?? []).filter((r) => !IS_IOS_FREE_ONLY || r.tier === 'FREE')
  const categories = Array.from(new Set(resources.map((r) => r.category)))

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load resources" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {resources.length === 0 ? (
          <EmptyState icon="folder-outline" title="Resources coming soon!" />
        ) : (
          categories.map((cat) => {
            const items = resources.filter((r) => r.category === cat)
            return (
              <View key={cat} style={{ marginBottom: 18 }}>
                <Text style={styles.cat}>{cat}</Text>
                {items.map((r) => {
                  const tc = TIER_COLOR[r.tier] ?? TIER_COLOR.FREE
                  const locked = (TIER_ORDER[r.tier] ?? 0) > userTier
                  return (
                    <View key={r.id} style={[styles.card, { opacity: locked ? 0.7 : 1 }]}>
                      <View style={styles.tierRow}>
                        <View style={[styles.tierTag, { backgroundColor: tc.bg }]}>
                          <Text style={{ color: tc.color, fontSize: font.micro, fontWeight: '700' }}>{r.tier}</Text>
                        </View>
                        {locked ? <Text style={{ color: colors.muted }}>🔒</Text> : null}
                      </View>
                      <Text style={styles.title}>{r.title}</Text>
                      <Text style={styles.desc}>{r.description}</Text>
                      <Text style={styles.downloads}>📥 {r.downloads} downloads</Text>
                      {locked ? (
                        <View style={styles.lockBox}>
                          <Text style={styles.lockText}>Upgrade to {r.tier} to unlock</Text>
                        </View>
                      ) : (
                        <Pressable
                          style={styles.btn}
                          onPress={() => WebBrowser.openBrowserAsync(r.fileUrl)}
                        >
                          <Text style={styles.btnText}>📄 Download PDF</Text>
                        </Pressable>
                      )}
                    </View>
                  )
                })}
              </View>
            )
          })
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  cat: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 8 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.lg, padding: 14, marginBottom: 8 },
  tierRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  tierTag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: radius.pill, alignSelf: 'flex-start' },
  title: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  desc: { color: colors.muted, fontSize: font.small, marginTop: 2 },
  downloads: { color: colors.muted2, fontSize: font.tiny, marginTop: 6, marginBottom: 8 },
  lockBox: { backgroundColor: colors.overlay, borderRadius: radius.sm, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start' },
  lockText: { color: colors.muted2, fontSize: font.body },
  btn: { alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 8, paddingHorizontal: 16 },
  btnText: { color: colors.white, fontWeight: '700', fontSize: font.body },
})
