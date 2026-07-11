import React from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Button, Badge, colors, spacing } from '@/components/ui'
import { AdminRow } from '@/components/AdminRow'
import { formatDate, formatCurrency } from '@/lib/format'

type Withdrawal = {
  id: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'
  note?: string | null
  createdAt: string
  affiliate?: { fullName: string; email: string; paymentMethod?: string | null }
}

const COLOR: Record<string, string> = {
  PENDING: '#f59e0b',
  APPROVED: '#2563eb',
  PAID: '#16a34a',
  REJECTED: '#dc2626',
}

export default function AdminWithdrawalsScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Withdrawal[]>('/api/admin/withdrawals')
  const list = data ?? []

  async function setStatus(id: string, status: Withdrawal['status']) {
    await apiFetch('/api/admin/withdrawals', { method: 'PATCH', body: { id, status } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/admin/withdrawals'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load withdrawals" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {list.length === 0 ? (
          <EmptyState icon="wallet-outline" title="No withdrawal requests." />
        ) : (
          list.map((w) => (
            <AdminRow
              key={w.id}
              title={`${w.affiliate?.fullName ?? '—'}  ·  ${formatCurrency(w.amount)}`}
              subtitle={`${w.affiliate?.email ?? ''}  ·  ${w.affiliate?.paymentMethod ?? '—'}  ·  ${formatDate(w.createdAt)}${w.note ? `\n${w.note}` : ''}`}
              badge={<Badge label={w.status} color={COLOR[w.status]} />}
            >
              {w.status === 'PENDING' ? (
                <Button title="Approve" variant="outline" onPress={() => setStatus(w.id, 'APPROVED')} />
              ) : null}
              {w.status !== 'PAID' && w.status !== 'REJECTED' ? (
                <Button title="Mark Paid" onPress={() => setStatus(w.id, 'PAID')} />
              ) : null}
              {w.status !== 'REJECTED' && w.status !== 'PAID' ? (
                <Button title="Reject" variant="danger" onPress={() => setStatus(w.id, 'REJECTED')} />
              ) : null}
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
