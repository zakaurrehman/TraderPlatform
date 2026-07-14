import React from 'react'
import { View, Text, StyleSheet, Pressable, Share } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApi } from '@/api/hooks'
import { Screen, Loader, ErrorState, Card, colors, font, spacing, radius } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/format'

type Bundle = {
  referralCode: string | null
  referralLink: string | null
  totalEarned: number
  available: number
  withdrawn: number
  totalSales: number
  commissionsCount: number
  salesRecent: { id: string; clientName: string; amount: number; createdAt: string }[]
  withdrawalsRecent: { id: string; amount: number; status: string; createdAt: string }[]
}

export default function AffiliateDashboard() {
  const router = useRouter()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Bundle>('/api/mobile/affiliate')

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError || !data)
    return <Screen><ErrorState message="Could not load dashboard" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={styles.head}>
        <Text style={styles.sub}>50% commission on every sale</Text>
      </View>

      <View style={{ padding: spacing.lg }}>
        <View style={styles.statsGrid}>
          <StatBox label="Total Earned" value={formatCurrency(data.totalEarned)} color={colors.primary} />
          <StatBox label="Available" value={formatCurrency(data.available)} color={colors.green} />
          <StatBox label="Withdrawn" value={formatCurrency(data.withdrawn)} color={colors.secondary} />
          <StatBox label="Total Sales" value={String(data.totalSales)} color={colors.ink} />
        </View>

        {data.referralLink ? (
          <Card>
            <Text style={styles.sectionTitle}>Your Referral Link</Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} numberOfLines={2}>{data.referralLink}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <Pressable
                style={styles.smallBtn}
                onPress={() => Clipboard.setStringAsync(data.referralLink!)}
              >
                <Ionicons name="copy-outline" size={14} color={colors.primary} />
                <Text style={styles.smallBtnText}>Copy</Text>
              </Pressable>
              <Pressable
                style={styles.smallBtn}
                onPress={() => Share.share({ message: `Join Trade with Shafy via my link: ${data.referralLink}` })}
              >
                <Ionicons name="share-social-outline" size={14} color={colors.primary} />
                <Text style={styles.smallBtnText}>Share</Text>
              </Pressable>
            </View>
          </Card>
        ) : (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>
              Your referral link will be activated once your account is approved.
            </Text>
          </View>
        )}

        <View style={styles.quickRow}>
          <Pressable style={styles.quickCard} onPress={() => router.push('/(app)/affiliate/commissions')}>
            <Ionicons name="stats-chart" size={20} color={colors.primary} />
            <Text style={styles.quickTitle}>Commissions</Text>
            <Text style={styles.quickSub}>{data.commissionsCount} records</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => router.push('/(app)/affiliate/withdraw')}>
            <Ionicons name="wallet-outline" size={22} color={colors.green} />
            <Text style={styles.quickTitle}>Withdraw</Text>
            <Text style={[styles.quickSub, { color: colors.green }]}>{formatCurrency(data.available)} available</Text>
          </Pressable>
        </View>

        {data.salesRecent.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Recent Sales</Text>
            {data.salesRecent.map((s) => (
              <View key={s.id} style={styles.saleRow}>
                <View>
                  <Text style={styles.saleName}>{s.clientName}</Text>
                  <Text style={styles.saleDate}>{formatDate(s.createdAt)}</Text>
                </View>
                <Text style={styles.saleAmount}>{formatCurrency(s.amount * 0.5)}</Text>
              </View>
            ))}
          </Card>
        )}

        {data.withdrawalsRecent.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Recent Withdrawal Requests</Text>
            {data.withdrawalsRecent.map((w) => (
              <View key={w.id} style={styles.saleRow}>
                <View>
                  <Text style={styles.saleName}>${w.amount.toFixed(2)}</Text>
                  <Text style={styles.saleDate}>{formatDate(w.createdAt)}</Text>
                </View>
                <Text style={[styles.saleAmount, { color: statusColor(w.status) }]}>{w.status}</Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    </Screen>
  )
}

function statusColor(s: string) {
  if (s === 'PAID') return colors.green
  if (s === 'REJECTED') return colors.red
  if (s === 'APPROVED') return colors.primary
  return colors.secondary
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  title: { color: colors.ink, fontWeight: '800', fontSize: 20 },
  sub: { color: colors.muted, fontSize: font.body, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  stat: { width: '48%', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 14 },
  statLabel: { color: colors.muted2, fontSize: font.tiny, marginBottom: 4 },
  statValue: { fontWeight: '800', fontSize: 22 },
  sectionTitle: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 10 },
  linkBox: { backgroundColor: 'rgba(37,99,235,0.06)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 10 },
  linkText: { color: colors.muted, fontSize: font.small },
  smallBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(37,99,235,0.08)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 7 },
  smallBtnText: { color: colors.primary, fontWeight: '700', fontSize: font.small },
  pendingBox: { backgroundColor: 'rgba(245,158,11,0.06)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: radius.lg, padding: 16, marginBottom: 14 },
  pendingText: { color: '#f59e0b', fontSize: font.body },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  quickCard: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 14, alignItems: 'center', gap: 4 },
  quickTitle: { color: colors.ink, fontWeight: '700', fontSize: font.body },
  quickSub: { color: colors.muted2, fontSize: font.tiny },
  saleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.overlay },
  saleName: { color: colors.ink, fontSize: font.body },
  saleDate: { color: colors.muted2, fontSize: font.tiny },
  saleAmount: { color: colors.green, fontWeight: '700', fontSize: font.body },
})
