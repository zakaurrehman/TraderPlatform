import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { useApi } from '@/api/hooks'
import { Screen, Loader, ErrorState, Badge, RiskDisclaimer, colors, font, spacing } from '@/components/ui'
import { formatDateTime } from '@/lib/format'
import type { ResearchPost } from '@/types'

export default function ResearchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, refetch } = useApi<ResearchPost[]>('/api/research')

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load post" onRetry={() => refetch()} /></Screen>

  const post = (data ?? []).find((p) => p.id === id)
  if (!post) return <Screen><ErrorState message="Post not found" /></Screen>

  return (
    <Screen scroll>
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.hero} contentFit="cover" />
      ) : null}
      <View style={{ padding: spacing.lg }}>
        <View style={styles.badges}>
          <Badge label={post.category} />
          {post.isPremium ? <Badge label="⭐ Premium" color="#f0b429" /> : null}
        </View>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>by {post.author?.fullName ?? 'Shafy'}</Text>
          <Text style={styles.meta}>{formatDateTime(post.createdAt)}</Text>
        </View>
        <Text style={styles.body}>{post.content}</Text>
        <RiskDisclaimer />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 200 },
  badges: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  title: { color: colors.white, fontWeight: '800', fontSize: 22, lineHeight: 29, marginBottom: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16, marginBottom: 18, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  meta: { color: colors.muted2, fontSize: font.small },
  body: { color: colors.secondary, fontSize: 15, lineHeight: 27 },
})
