import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { formatDateTime, timeAgo } from '@/lib/format'
import { Screen, Loader, ErrorState, colors, font, spacing, radius } from '@/components/ui'
import type { Comment } from '@/types'

type PostDetail = {
  id: string
  title: string
  content: string
  imageUrl?: string | null
  createdAt: string
  author: { fullName: string; studentId: string }
  likes: number
  dislikes: number
  userReaction: 'LIKE' | 'DISLIKE' | null
  comments: Comment[]
}

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const qc = useQueryClient()
  const key = `/api/community?id=${id}`
  const { data, isLoading, isError, refetch } = useApi<PostDetail>(key)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError || !data)
    return <Screen><ErrorState message="Post not found" onRetry={() => refetch()} /></Screen>

  async function react(type: 'LIKE' | 'DISLIKE') {
    await apiFetch('/api/community', { method: 'PATCH', body: { postId: id, type } }).catch(() => {})
    qc.invalidateQueries({ queryKey: [key] })
    qc.invalidateQueries({ queryKey: ['/api/community'] })
  }

  async function submitComment() {
    if (!comment.trim()) return
    setBusy(true)
    try {
      await apiFetch('/api/community/comments', {
        method: 'POST',
        body: { postId: id, content: comment.trim() },
      })
      setComment('')
      qc.invalidateQueries({ queryKey: [key] })
    } finally {
      setBusy(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll>
        <View style={{ padding: spacing.lg }}>
          <View style={styles.card}>
            <View style={styles.authorRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{data.author.fullName[0]?.toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{data.author.fullName}</Text>
                <Text style={styles.authorSub}>
                  {data.author.studentId} · {formatDateTime(data.createdAt)}
                </Text>
              </View>
            </View>
            <Text style={styles.title}>{data.title}</Text>
            {data.imageUrl ? (
              <Image source={{ uri: data.imageUrl }} style={styles.img} contentFit="cover" />
            ) : null}
            <Text style={styles.body}>{data.content}</Text>
            <View style={styles.reactRow}>
              <Pressable
                style={[styles.reactBtn, data.userReaction === 'LIKE' && styles.reactActiveLike]}
                onPress={() => react('LIKE')}
              >
                <Text style={{ color: data.userReaction === 'LIKE' ? colors.green : colors.muted }}>
                  👍 {data.likes}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.reactBtn, data.userReaction === 'DISLIKE' && styles.reactActiveDislike]}
                onPress={() => react('DISLIKE')}
              >
                <Text style={{ color: data.userReaction === 'DISLIKE' ? colors.redText : colors.muted }}>
                  👎 {data.dislikes}
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.commentsTitle}>
            💬 {data.comments.length} Comment{data.comments.length !== 1 ? 's' : ''}
          </Text>

          {data.comments.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <View style={styles.cAvatar}>
                <Text style={styles.cAvatarText}>{c.authorName[0]?.toUpperCase()}</Text>
              </View>
              <View style={styles.commentBubble}>
                <View style={styles.commentMeta}>
                  <Text style={styles.cName}>{c.authorName}</Text>
                  <Text style={styles.cId}>{c.studentId}</Text>
                  <Text style={styles.cTime}>{timeAgo(c.createdAt)}</Text>
                </View>
                <Text style={styles.cContent}>{c.content}</Text>
              </View>
            </View>
          ))}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment…"
              placeholderTextColor={colors.muted}
              value={comment}
              onChangeText={setComment}
            />
            <Pressable style={styles.postBtn} onPress={submitComment} disabled={busy}>
              <Text style={styles.postBtnText}>{busy ? '…' : 'Post'}</Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  authorRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(245,197,24,0.15)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.gold, fontWeight: '800', fontSize: 14 },
  authorName: { color: colors.white, fontWeight: '700' },
  authorSub: { color: colors.muted2, fontSize: font.tiny },
  title: { color: colors.white, fontWeight: '800', fontSize: 18, marginBottom: 10 },
  img: { width: '100%', height: 200, borderRadius: radius.sm, marginBottom: 10 },
  body: { color: colors.secondary, fontSize: 14, lineHeight: 24 },
  reactRow: { flexDirection: 'row', gap: 12, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.overlay2 },
  reactBtn: { backgroundColor: colors.overlay2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 },
  reactActiveLike: { backgroundColor: 'rgba(0,200,81,0.15)', borderColor: 'rgba(0,200,81,0.3)' },
  reactActiveDislike: { backgroundColor: 'rgba(255,68,68,0.1)', borderColor: 'rgba(255,68,68,0.3)' },
  commentsTitle: { color: colors.secondary, fontWeight: '700', fontSize: 14, marginBottom: 10 },
  commentRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  cAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(245,197,24,0.1)', alignItems: 'center', justifyContent: 'center' },
  cAvatarText: { color: colors.gold, fontWeight: '700', fontSize: 12 },
  commentBubble: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: radius.md, padding: 10 },
  commentMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 },
  cName: { color: colors.white, fontWeight: '700', fontSize: 12 },
  cId: { color: colors.muted2, fontSize: font.tiny },
  cTime: { color: colors.muted2, fontSize: font.tiny, marginLeft: 'auto' },
  cContent: { color: colors.secondary, fontSize: 13, lineHeight: 19 },
  inputRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  input: { flex: 1, backgroundColor: colors.overlay2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 11, color: colors.white },
  postBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: 16, justifyContent: 'center' },
  postBtnText: { color: colors.bg, fontWeight: '800' },
})
