import React from 'react'
import { View } from 'react-native'
import { useApi } from '@/api/hooks'
import { Screen, Loader, ErrorState, EmptyState, Badge, colors, spacing } from '@/components/ui'
import { AdminRow } from '@/components/AdminRow'
import { formatCurrency } from '@/lib/format'

type Affiliate = {
  id: string
  fullName: string
  email: string
  username: string
  referralCode: string | null
  status: string
  sales: number
  earned: number
}

export default function AdminAffiliatesScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Affiliate[]>('/api/admin/affiliates')
  const list = data ?? []

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load affiliates" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {list.length === 0 ? (
          <EmptyState icon="git-branch-outline" title="No affiliates yet." />
        ) : (
          list.map((a) => (
            <AdminRow
              key={a.id}
              title={`${a.fullName}  ·  @${a.username}`}
              subtitle={`${a.email}${a.referralCode ? `  ·  Ref ${a.referralCode}` : ''}  ·  ${a.sales} sales  ·  ${formatCurrency(a.earned)}`}
              badge={<Badge label={a.status} color={a.status === 'APPROVED' ? colors.green : a.status === 'PENDING' ? '#f0b429' : colors.red} />}
            />
          ))
        )}
      </View>
    </Screen>
  )
}
