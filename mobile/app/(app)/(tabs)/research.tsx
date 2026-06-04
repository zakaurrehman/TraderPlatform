import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { useApi } from '@/api/hooks'
import { useAuth } from '@/auth/AuthContext'
import { isLocked, IS_IOS_FREE_ONLY } from '@/lib/gating'
import { timeAgo } from '@/lib/format'
import { Screen, Loader, ErrorState, EmptyState, Badge, colors, font, spacing, radius } from '@/components/ui'
import type { ResearchPost, Plan } from '@/types'

const CATEGORIES = ['All', 'Forex', 'Gold', 'Crypto', 'Stocks', 'Indices', 'Crude Oil']

export default function ResearchScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const plan = (user?.plan ?? 'FREE') as Plan
  const [cat, setCat] = useState('All')
  const { data, isLoading, isError, refetch, isRefetching } = useApi<ResearchPost[]>('/api/research')

  const posts = (data ?? [])
    .filter((p) => p.published)
    // iOS: hide premium posts entirely (App Store IAP rule — Path A compliance)
    .filter((p) => !(IS_IOS_FREE_ONLY && p.isPremium))
    .filter((p) => cat === 'All' || p.category === cat)
    .slice(0, 30)

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.head}>
        <View style={styles.headRow}>
          <Text style={styles.title}>Market Research</Text>
          <Badge label={plan} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 12 }}>
          {CATEGORIES.map((c) => {
            const active = c === cat
            return (
              <Pressable
                key={c}
                onPress={() => setCat(c)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={{ color: active ? colors.gold : colors.muted, fontSize: font.small, fontWeight: '600' }}>
                  {c}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <View style={{ padding: spacing.lg }}>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState message="Could not load research" onRetry={() => refetch()} />
        ) : posts.length === 0 ? (
          <EmptyState icon="document-text-outline" title="No posts yet." />
        ) : (
          posts.map((post) => {
            const locked = isLocked(post.isPremium, plan)
            return (
              <Pressable
                key={post.id}
                onPress={() =>
                  router.push(locked ? '/(app)/order' : (`/(app)/research/${post.id}` as never))
                }
                style={[styles.card, { opacity: locked ? 0.75 : 1 }]}
              >
                {post.imageUrl ? (
                  <Image source={{ uri: post.imageUrl }} style={styles.cardImg} contentFit="cover" blurRadius={locked ? 12 : 0} />
                ) : null}
                <View style={{ padding: 14 }}>
                  <View style={styles.badgeRow}>
                    <Badge label={post.category} />
                    {post.isPremium ? <Badge label="⭐ PREMIUM" color="#a855f7" /> : null}
                    {locked ? <Badge label="🔒 Locked" color={colors.redText} /> : null}
                  </View>
                  <Text style={[styles.cardTitle, { color: locked ? colors.muted : colors.white }]}>
                    {post.title}
                  </Text>
                  {locked ? (
                    <View style={styles.lockBox}>
                      <Text style={{ color: '#a855f7', fontSize: font.small, fontWeight: '600' }}>
                        🔒 PREMIUM plan required · Tap to upgrade
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.snippet}>{post.content.slice(0, 100)}…</Text>
                  )}
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>by {post.author?.fullName ?? 'Shafy'}</Text>
                    <Text style={styles.meta}>{timeAgo(post.createdAt)}</Text>
                  </View>
                </View>
              </Pressable>
            )
          })
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.white, fontWeight: '800', fontSize: 20 },
  chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.overlay2, borderWidth: 1, borderColor: colors.borderSoft },
  chipActive: { backgroundColor: 'rgba(245,197,24,0.15)', borderColor: 'rgba(245,197,24,0.3)' },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', marginBottom: 12 },
  cardImg: { width: '100%', height: 160 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  cardTitle: { fontWeight: '700', fontSize: 15, lineHeight: 21, marginBottom: 6 },
  snippet: { color: colors.muted, fontSize: font.small, lineHeight: 18, marginBottom: 8 },
  lockBox: { backgroundColor: 'rgba(168,85,247,0.08)', borderWidth: 1, borderColor: 'rgba(168,85,247,0.2)', borderRadius: 8, padding: 10, marginBottom: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { color: colors.muted2, fontSize: font.tiny },
})
