import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { WebView } from 'react-native-webview'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, Button, WinRateBar, colors, font, spacing, radius } from '@/components/ui'

type Video = { id: string; title: string; url: string; duration?: string | null; isPremium: boolean }
type Course = { id: string; title: string; level: string; description: string; videos: Video[] }
type Resp = { course: Course; completed: string[] }

function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?playsinline=1`
  return url
}

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>()
  const qc = useQueryClient()
  const key = `/api/classroom?courseId=${courseId}`
  const { data, isLoading, isError, refetch } = useApi<Resp>(key)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!activeId && data?.course.videos[0]) setActiveId(data.course.videos[0].id)
  }, [data, activeId])

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError || !data)
    return <Screen><ErrorState message="Course not found" onRetry={() => refetch()} /></Screen>

  const { course, completed } = data
  const done = course.videos.filter((v) => completed.includes(v.id)).length
  const total = course.videos.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const active = course.videos.find((v) => v.id === activeId) ?? course.videos[0]

  async function markComplete(videoId: string) {
    await apiFetch('/api/classroom', { method: 'POST', body: { videoId } }).catch(() => {})
    qc.invalidateQueries({ queryKey: [key] })
    qc.invalidateQueries({ queryKey: ['/api/classroom'] })
    qc.invalidateQueries({ queryKey: ['/api/mobile/profile'] })
  }

  return (
    <Screen scroll>
      <View style={styles.head}>
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.progressRow}>
          <Text style={styles.progressMeta}>{done}/{total} complete</Text>
          <Text style={styles.progressPct}>{pct}%</Text>
        </View>
        <WinRateBar value={pct} />
      </View>

      {active ? (
        <View>
          <View style={styles.player}>
            <WebView
              source={{ uri: toEmbedUrl(active.url) }}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              style={{ flex: 1, backgroundColor: '#000' }}
            />
          </View>
          <View style={styles.activeRow}>
            <Text style={styles.activeTitle}>{active.title}</Text>
            {completed.includes(active.id) ? (
              <Text style={styles.doneText}>Completed</Text>
            ) : (
              <Button title="✓ Mark Complete" onPress={() => markComplete(active.id)} variant="primary" />
            )}
          </View>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
        {course.videos.map((v, i) => {
          const isActive = active?.id === v.id
          const isDone = completed.includes(v.id)
          return (
            <Pressable
              key={v.id}
              style={[
                styles.videoRow,
                {
                  backgroundColor: isActive ? 'rgba(37,99,235,0.12)' : colors.overlay,
                  borderLeftColor: isDone ? colors.green : isActive ? colors.primary : 'transparent',
                },
              ]}
              onPress={() => setActiveId(v.id)}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Text style={styles.videoIdx}>{i + 1}.</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.videoTitle, { fontWeight: isDone ? '600' : '400' }]}>{v.title}</Text>
                    {v.duration ? <Text style={styles.videoDuration}>{v.duration}</Text> : null}
                  </View>
                </View>
              </View>
              {isDone ? <Text style={{ color: colors.green, fontSize: 16 }}>✓</Text> : null}
            </Pressable>
          )
        })}
      </View>

      {pct === 100 ? (
        <View style={styles.cert}>
          <Ionicons name="trophy" size={30} color="#f59e0b" />
          <Text style={styles.certTitle}>Course Complete!</Text>
          <Text style={styles.certSub}>Your certificate has been issued.</Text>
        </View>
      ) : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  head: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  title: { color: colors.ink, fontWeight: '800', fontSize: 18, marginBottom: 6 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progressMeta: { color: colors.muted, fontSize: font.small },
  progressPct: { color: colors.primary, fontWeight: '700', fontSize: font.body },
  player: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  activeRow: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderSoft, gap: 10 },
  activeTitle: { color: colors.ink, fontWeight: '700', fontSize: 15 },
  doneText: { color: colors.green, fontWeight: '700', fontSize: font.body },
  videoRow: { borderRadius: radius.md, padding: 10, marginBottom: 6, borderLeftWidth: 3, flexDirection: 'row', alignItems: 'center' },
  videoIdx: { color: colors.muted2, fontSize: font.small, width: 18 },
  videoTitle: { color: colors.ink, fontSize: font.body },
  videoDuration: { color: colors.muted2, fontSize: font.tiny },
  cert: { margin: spacing.lg, backgroundColor: 'rgba(22,163,74,0.08)', borderWidth: 1, borderColor: 'rgba(22,163,74,0.2)', borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 4 },
  certTitle: { color: colors.green, fontWeight: '800', fontSize: 16 },
  certSub: { color: colors.muted, fontSize: font.small },
})
