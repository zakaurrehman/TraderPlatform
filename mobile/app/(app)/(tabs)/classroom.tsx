import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { useApi } from '@/api/hooks'
import { useAuth } from '@/auth/AuthContext'
import { canViewPremium, IS_IOS_FREE_ONLY } from '@/lib/gating'
import { Screen, Loader, ErrorState, EmptyState, Badge, WinRateBar, colors, font, spacing, radius } from '@/components/ui'
import type { Plan } from '@/types'

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research']

type CourseRow = {
  id: string
  title: string
  level: string
  description: string
  isPremium: boolean
  videos: { id: string }[]
  certificates: { id: string }[]
}
type Resp = { courses: CourseRow[]; completed: string[] }

export default function ClassroomScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const isPrem = canViewPremium((user?.plan ?? 'FREE') as Plan)
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Resp>('/api/classroom')

  const completed = new Set(data?.completed ?? [])
  const courses = [...(data?.courses ?? [])]
    // iOS: hide premium courses entirely (App Store IAP rule — Path A compliance)
    .filter((c) => !(IS_IOS_FREE_ONLY && c.isPremium))
    .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level))

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.head}>
        <Text style={styles.title}>Classroom</Text>
        <Text style={styles.sub}>Master Forex from Beginner to Expert</Text>
      </View>

      <View style={{ padding: spacing.lg }}>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState message="Could not load courses" onRetry={() => refetch()} />
        ) : courses.length === 0 ? (
          <EmptyState icon="school-outline" title="No courses yet. Check back soon!" />
        ) : (
          courses.map((course) => {
            const total = course.videos.length
            const done = course.videos.filter((v) => completed.has(v.id)).length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            const locked = course.isPremium && !isPrem
            const certified = course.certificates.length > 0
            return (
              <Pressable
                key={course.id}
                style={[styles.card, { opacity: locked ? 0.75 : 1 }]}
                onPress={() =>
                  router.push(locked ? '/(app)/order' : (`/(app)/classroom/${course.id}` as never))
                }
              >
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.badgeRow}>
                      <Badge label={course.level} />
                      {course.isPremium ? <Badge label="⭐ PREMIUM" color="#7c3aed" /> : null}
                      {locked ? <Badge label="🔒 Upgrade" color="#7c3aed" /> : null}
                      {certified ? <Badge label="✅ Certified" color={colors.green} /> : null}
                    </View>
                    <Text style={[styles.cTitle, { color: locked ? colors.muted : colors.ink }]}>
                      {course.title}
                    </Text>
                    <Text style={styles.cDesc}>{course.description}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                    <Text style={styles.pct}>{pct}%</Text>
                    <Text style={styles.frac}>{done}/{total}</Text>
                  </View>
                </View>
                <WinRateBar value={pct} />
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
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  cTitle: { fontWeight: '700', fontSize: 16 },
  cDesc: { color: colors.muted2, fontSize: font.small, marginTop: 2 },
  pct: { color: colors.primary, fontWeight: '800', fontSize: 20 },
  frac: { color: colors.muted2, fontSize: font.micro },
})
