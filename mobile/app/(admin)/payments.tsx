import React, { useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, spacing } from '@/components/ui'
import { AdminRow } from '@/components/AdminRow'
import { formatCurrency, formatDate } from '@/lib/format'

type Payment = {
  id: string
  clientName: string
  clientEmail: string
  service: string
  amount: number
  referralCode?: string | null
  paymentMethod?: string | null
  paymentNote?: string | null
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED'
  rejectedNote?: string | null
  createdAt: string
}

const COLOR: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#16a34a',
  REJECTED: '#dc2626',
}

export default function AdminPaymentsScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Payment[]>('/api/admin/payments')
  const list = data ?? []
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})

  async function setStatus(id: string, status: 'CONFIRMED' | 'REJECTED', rejectedNote?: string) {
    await apiFetch('/api/admin/payments', { method: 'PATCH', body: { id, status, rejectedNote } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/admin/payments'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load payments" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {list.length === 0 ? (
          <EmptyState icon="card-outline" title="No payment requests." />
        ) : (
          list.map((p) => (
            <AdminRow
              key={p.id}
              title={`${p.clientName}  ·  ${p.service}  ·  ${formatCurrency(p.amount)}`}
              subtitle={`${p.clientEmail}${p.referralCode ? `  ·  Ref ${p.referralCode}` : ''}  ·  ${p.paymentMethod ?? '—'}  ·  ${formatDate(p.createdAt)}${p.paymentNote ? `\nNote: ${p.paymentNote}` : ''}`}
              badge={<Badge label={p.status} color={COLOR[p.status]} />}
            >
              {p.status === 'PENDING' ? (
                <>
                  <Button title="Confirm" onPress={() => setStatus(p.id, 'CONFIRMED')} />
                  <Field
                    placeholder="Reject reason (optional)"
                    value={rejectNotes[p.id] ?? ''}
                    onChangeText={(t) => setRejectNotes((m) => ({ ...m, [p.id]: t }))}
                  />
                  <Button
                    title="Reject"
                    variant="danger"
                    onPress={() => setStatus(p.id, 'REJECTED', rejectNotes[p.id] || undefined)}
                  />
                </>
              ) : null}
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
