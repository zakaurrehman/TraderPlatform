import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApi } from '@/api/hooks'
import { useAuth } from '@/auth/AuthContext'
import { apiFetch } from '@/api/client'
import { clearTokens } from '@/api/tokenStore'
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
  { href: '/(app)/affiliate', label: 'Affiliate Dashboard', sub: 'Referrals & commissions' },
  { href: '/(app)/calculator', label: 'Risk Calculator', sub: 'Position size tool' },
  { href: '/(app)/watchlist', label: 'Market Watchlist', sub: 'Live prices' },
  { href: '/(app)/brokers', label: 'Broker Recommendations', sub: 'Start trading' },
  { href: '/(app)/resources', label: 'Resources', sub: 'Guides & downloads' },
  { href: '/(app)/reviews', label: 'Leave a Review', sub: 'Share your experience' },
]

export default function ProfileScreen() {
  const router = useRouter()
  const { signOut } = useAuth()
  const [deleting, setDeleting] = useState(false)

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account, profile, course progress, posts, comments, and affiliate records. This action cannot be undone.\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'Type-tap "Delete Forever" to permanently delete your account.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: deleteAccount,
                },
              ]
            )
          },
        },
      ]
    )
  }

  const deleteAccount = async () => {
    setDeleting(true)
    try {
      await apiFetch('/api/mobile/auth/delete-account', { method: 'DELETE' })
      await clearTokens()
      // signOut clears auth state + root navigator redirects to landing
      await signOut()
      Alert.alert('Account Deleted', 'Your account and all associated data have been permanently deleted.')
    } catch (e) {
      Alert.alert(
        'Could not delete account',
        e instanceof Error ? e.message : 'Please contact support at shafqatrafique45978@gmail.com.'
      )
      setDeleting(false)
    }
  }
  const { data, isLoading, isError, refetch, isRefetching } = useApi<ProfileBundle>('/api/mobile/profile')

  if (isLoading) return <Screen edges={['top']}><Loader /></Screen>
  if (isError || !data)
    return <Screen edges={['top']}><ErrorState message="Could not load profile" onRetry={() => refetch()} /></Screen>

  return (
    <Screen edges={['top']} scroll refreshing={isRefetching} onRefresh={refetch}>
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
            <Text style={styles.cardTitle}>Certificates</Text>
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

        {data.plan === 'FREE' && Platform.OS !== 'ios' && (
          <View style={styles.upgrade}>
            <Ionicons name="star" size={26} color="#f59e0b" />
            <Text style={styles.upgradeTitle}>Upgrade Your Plan</Text>
            <Text style={styles.upgradeSub}>Unlock premium research, signals, and courses.</Text>
            <Button title="View Plans" onPress={() => router.push('/(app)/order')} />
          </View>
        )}

        <Button
          title="Sign Out"
          variant="dangerSoft"
          icon="log-out-outline"
          style={{ marginTop: spacing.md }}
          onPress={signOut}
        />

        <View style={styles.deleteSection}>
          <Text style={styles.deleteSectionTitle}>Danger Zone</Text>
          <Text style={styles.deleteSectionBody}>
            Permanently delete your account, all certificates, course progress, posts,
            comments and affiliate records. This cannot be undone.
          </Text>
          <Button
            title={deleting ? 'Deleting…' : 'Delete My Account'}
            variant="danger"
            icon="trash-outline"
            onPress={confirmDeleteAccount}
            loading={deleting}
          />
        </View>
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
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: colors.white, fontSize: 28, fontWeight: '800' },
  name: { color: colors.ink, fontWeight: '800', fontSize: 20 },
  sub: { color: colors.muted, fontSize: font.body, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  statValue: { color: colors.primary, fontWeight: '800', fontSize: 20 },
  statLabel: { color: colors.muted2, fontSize: font.tiny },
  cardTitle: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  detailLabel: { color: colors.muted, fontSize: font.body },
  detailValue: { color: colors.ink, fontSize: font.body, maxWidth: '60%', textAlign: 'right' },
  certRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  certTitle: { color: colors.ink, fontWeight: '600', fontSize: font.body },
  certSub: { color: colors.muted, fontSize: font.tiny },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  linkLabel: { color: colors.ink, fontSize: font.body },
  linkSub: { color: colors.muted2, fontSize: font.tiny },
  upgrade: { backgroundColor: 'rgba(37,99,235,0.06)', borderWidth: 1, borderColor: 'rgba(37,99,235,0.2)', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: 8, marginTop: spacing.sm },
  deleteSection: { marginTop: spacing.xl, padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', borderRadius: radius.lg, backgroundColor: 'rgba(220,38,38,0.04)' },
  deleteSectionTitle: { color: colors.redText, fontWeight: '800', fontSize: 14, marginBottom: 6 },
  deleteSectionBody: { color: colors.muted, fontSize: font.small, lineHeight: 18, marginBottom: 12 },
  upgradeTitle: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  upgradeSub: { color: colors.muted, fontSize: font.body, textAlign: 'center', marginBottom: 8 },
})
