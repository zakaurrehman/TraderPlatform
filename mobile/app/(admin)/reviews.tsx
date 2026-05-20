import React from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Button, Badge, colors, spacing } from '@/components/ui'
import { AdminRow } from '@/components/AdminRow'
import type { Review } from '@/types'

export default function AdminReviewsScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Review[]>('/api/reviews?all=1')
  const list = data ?? []

  async function setStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    await apiFetch('/api/reviews', { method: 'PATCH', body: { id, status } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/reviews?all=1'] })
    qc.invalidateQueries({ queryKey: ['/api/reviews'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load reviews" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {list.length === 0 ? (
          <EmptyState icon="star-outline" title="No reviews yet." />
        ) : (
          list.map((r) => (
            <AdminRow
              key={r.id}
              title={`${r.clientName}  ${'★'.repeat(r.rating)}`}
              subtitle={r.content}
              badge={<Badge label={r.status} color={r.status === 'APPROVED' ? colors.green : r.status === 'REJECTED' ? colors.red : '#f0b429'} />}
            >
              {r.status !== 'APPROVED' ? (
                <Button title="Approve" onPress={() => setStatus(r.id, 'APPROVED')} />
              ) : null}
              {r.status !== 'REJECTED' ? (
                <Button title="Reject" variant="danger" onPress={() => setStatus(r.id, 'REJECTED')} />
              ) : null}
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
