import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useApi } from '@/api/hooks'
import { timeAgo } from '@/lib/format'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import type { CommunityPost } from '@/types'

export default function CommunityScreen() {
  const router = useRouter()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<CommunityPost[]>('/api/community')
  const posts = data ?? []

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.head}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.sub}>Share analysis & connect with traders</Text>
      </View>

      <View style={{ padding: spacing.lg }}>
        <Pressable style={styles.newBtn} onPress={() => router.push('/(app)/community/new')}>
          <Ionicons name="create-outline" size={18} color={colors.white} />
          <Text style={styles.newBtnText}>Create a Post</Text>
        </Pressable>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState message="Could not load community" onRetry={() => refetch()} />
        ) : posts.length === 0 ? (
          <EmptyState icon="people-outline" title="No posts yet." subtitle="Start the conversation!" />
        ) : (
          posts.map((post) => {
            const likes = post.reactions.filter((r) => r.type === 'LIKE').length
            const dislikes = post.reactions.filter((r) => r.type === 'DISLIKE').length
            return (
              <Pressable
                key={post.id}
                style={styles.card}
                onPress={() => router.push(`/(app)/community/${post.id}` as never)}
              >
                {post.imageUrl ? (
                  <Image source={{ uri: post.imageUrl }} style={styles.img} contentFit="cover" />
                ) : null}
                <View style={styles.authorRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.author.fullName[0]?.toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>{post.author.fullName}</Text>
                    <Text style={styles.authorSub}>
                      {post.author.studentId} · {timeAgo(post.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.snippet}>
                  {post.content.slice(0, 120)}
                  {post.content.length > 120 ? '…' : ''}
                </Text>
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>👍 {likes}</Text>
                  <Text style={styles.stat}>👎 {dislikes}</Text>
                  <Text style={styles.stat}>💬 {post.comments.length}</Text>
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
  title: { color: colors.ink, fontWeight: '800', fontSize: 20 },
  sub: { color: colors.muted, fontSize: font.body, marginTop: 2 },
  newBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, marginBottom: spacing.md },
  newBtnText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, marginBottom: 12 },
  img: { width: '100%', height: 160, borderRadius: radius.sm, marginBottom: 10 },
  authorRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(37,99,235,0.15)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  authorName: { color: colors.ink, fontWeight: '700', fontSize: font.body },
  authorSub: { color: colors.muted2, fontSize: font.tiny },
  postTitle: { color: colors.ink, fontWeight: '700', fontSize: 14, lineHeight: 20, marginBottom: 6 },
  snippet: { color: colors.muted, fontSize: font.small, lineHeight: 18, marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 16 },
  stat: { color: colors.muted2, fontSize: font.small },
})
