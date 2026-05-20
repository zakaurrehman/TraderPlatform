import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApi } from '@/api/hooks'
import { useAuth } from '@/auth/AuthContext'
import {
  Screen, Card, PlanBadge, Loader, ErrorState, Button,
  colors, font, spacing, radius,
} from '@/components/ui'
import { formatDate } from '@/lib/format'

type ProfileBundle = {
  fullName: string
  email: string
  phone?: string | null
  country?: string | null
  username: string
  plan: string
  studentId: string
  paymentMethod?: string | null
  createdAt: string
  totalEarned: number
  totalSales: number
  certificates: { id: string; issuedAt: string; course: { title: string; level: string } }[]
}

const LINKS: { href: string; label: string; sub: string }[] = [
  { href: '/(app)/affiliate', label: '🔗 Affiliate Dashboard', sub: 'Referrals & commissions' },
  { href: '/(app)/calculator', label: '📊 Risk Calculator', sub: 'Position size tool' },
  { href: '/(app)/watchlist', label: '📈 Market Watchlist', sub: 'Live prices' },
  { href: '/(app)/brokers', label: '🏦 Broker Recommendations', sub: 'Start trading' },
  { href: '/(app)/resources', label: '📁 Resources', sub: 'Guides & downloads' },
  { href: '/(app)/reviews', label: '⭐ Leave a Review', sub: 'Share your experience' },
]

export default function ProfileScreen() {
  const router = useRouter()
  const { signOut } = useAuth()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<ProfileBundle>('/api/mobile/profile')

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError || !data)
    return <Screen><ErrorState message="Could not load profile" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{data.fullName?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{data.fullName}</Text>
        <Text style={styles.sub}>{data.studentId} · @{data.username}</Text>
        <View style={{ marginTop: 8 }}>
          <PlanBadge plan={data.plan} />
        </View>
      </View>

      <View style={{ padding: spacing.lg }}>
        <View style={styles.statsRow}>
          <StatBox label="Sales" value={`${data.totalSales}`} />
          <StatBox label="Earned" value={`$${data.totalEarned.toFixed(0)}`} />
          <StatBox label="Certs" value={`${data.certificates.length}`} />
        </View>

        <Card>
          <Text style={styles.cardTitle}>Account Details</Text>
          {[
            ['Email', data.email],
            ['Phone', data.phone || '—'],
            ['Country', data.country || '—'],
            ['Payment', data.paymentMethod || '—'],
            ['Member since', formatDate(data.createdAt)],
          ].map(([label, value]) => (
            <View key={label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </Card>

        {data.certificates.length > 0 && (
          <Card>
            <Text style={styles.cardTitle}>🏆 Certificates</Text>
            {data.certificates.map((c) => (
              <View key={c.id} style={styles.certRow}>
                <Text style={{ fontSize: 18 }}>🎓</Text>
                <View>
                  <Text style={styles.certTitle}>{c.course.title}</Text>
                  <Text style={styles.certSub}>{c.course.level} · {formatDate(c.issuedAt)}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        <Card>
          <Text style={styles.cardTitle}>Quick Links</Text>
          {LINKS.map((l) => (
            <Pressable key={l.href} style={styles.linkRow} onPress={() => router.push(l.href as never)}>
              <View>
                <Text style={styles.linkLabel}>{l.label}</Text>
                <Text style={styles.linkSub}>{l.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted2} />
            </Pressable>
          ))}
        </Card>

        {data.plan === 'FREE' && (
          <View style={styles.upgrade}>
            <Text style={{ fontSize: 28 }}>⭐</Text>
            <Text style={styles.upgradeTitle}>Upgrade Your Plan</Text>
            <Text style={styles.upgradeSub}>Unlock premium research, signals, and courses.</Text>
            <Button title="View Plans" onPress={() => router.push('/(app)/order')} />
          </View>
        )}

        <Button
          title="Sign Out"
          variant="danger"
          icon="log-out-outline"
          style={{ marginTop: spacing.md, backgroundColor: 'rgba(255,68,68,0.12)' }}
          onPress={signOut}
        />
      </View>
    </Screen>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingVertical: spacing.xxl, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: colors.bg, fontSize: 28, fontWeight: '800' },
  name: { color: colors.white, fontWeight: '800', fontSize: 20 },
  sub: { color: colors.muted, fontSize: font.body, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  statValue: { color: colors.gold, fontWeight: '800', fontSize: 20 },
  statLabel: { color: colors.muted2, fontSize: font.tiny },
  cardTitle: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  detailLabel: { color: colors.muted, fontSize: font.body },
  detailValue: { color: colors.white, fontSize: font.body, maxWidth: '60%', textAlign: 'right' },
  certRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  certTitle: { color: colors.white, fontWeight: '600', fontSize: font.body },
  certSub: { color: colors.muted, fontSize: font.tiny },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  linkLabel: { color: colors.white, fontSize: font.body },
  linkSub: { color: colors.muted2, fontSize: font.tiny },
  upgrade: { backgroundColor: 'rgba(245,197,24,0.06)', borderWidth: 1, borderColor: 'rgba(245,197,24,0.2)', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: 8, marginTop: spacing.sm },
  upgradeTitle: { color: colors.white, fontWeight: '800', fontSize: 15 },
  upgradeSub: { color: colors.muted, fontSize: font.body, textAlign: 'center', marginBottom: 8 },
})
