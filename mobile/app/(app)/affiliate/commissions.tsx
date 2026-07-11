import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useApi } from '@/api/hooks'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/format'

type CommissionRow = {
  id: string
  amount: number
  withdrawn: boolean
  createdAt: string
  sale: { clientName: string; amount: number }
}

export default function CommissionsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useApi<CommissionRow[]>('/api/mobile/affiliate/commissions')
  const items = data ?? []

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load commissions" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {items.length === 0 ? (
          <EmptyState
            icon="cash-outline"
            title="No commissions yet."
            subtitle="Share your referral link to start earning!"
          />
        ) : (
          items.map((c) => (
            <View key={c.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.sale.clientName}</Text>
                <Text style={styles.sale}>Sale: {formatCurrency(c.sale.amount)}</Text>
                <Text style={styles.date}>{formatDate(c.createdAt)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.amount}>{formatCurrency(c.amount)}</Text>
                <View
                  style={[
                    styles.tag,
                    {
                      backgroundColor: c.withdrawn ? 'rgba(148,163,184,0.1)' : 'rgba(22,163,74,0.1)',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: c.withdrawn ? colors.muted : colors.green,
                      fontWeight: '700',
                      fontSize: font.micro,
                    }}
                  >
                    {c.withdrawn ? 'Paid Out' : 'Available'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  name: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  sale: { color: colors.muted, fontSize: font.small, marginTop: 2 },
  date: { color: colors.muted2, fontSize: font.tiny, marginTop: 2 },
  amount: { color: colors.green, fontWeight: '800', fontSize: 18 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, marginTop: 4 },
})
