import React, { useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, colors, spacing } from '@/components/ui'
import { Select } from '@/components/Select'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'
import { formatCurrency, formatDate } from '@/lib/format'

type Sale = {
  id: string
  clientName: string
  clientEmail: string
  amount: number
  description?: string | null
  createdAt: string
  affiliate?: { fullName: string }
}

type AffOption = { id: string; fullName: string; username: string }

export default function AdminSalesScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Sale[]>('/api/admin/sales')
  const aff = useApi<AffOption[]>('/api/admin/affiliates-list')

  const list = data ?? []
  const affOptions = (aff.data ?? []).map((a) => ({ label: `${a.fullName} (@${a.username})`, value: a.id }))

  const [affiliateId, setAffiliateId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)

  async function create() {
    if (!affiliateId) return
    setBusy(true)
    try {
      await apiFetch('/api/admin/sales', {
        method: 'POST',
        body: { affiliateId, clientName, clientEmail, amount: parseFloat(amount), description: description || undefined },
      })
      qc.invalidateQueries({ queryKey: ['/api/admin/sales'] })
      qc.invalidateQueries({ queryKey: ['/api/admin/affiliates'] })
      setClientName(''); setClientEmail(''); setAmount(''); setDescription('')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load sales" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ Record Sale">
          <Select label="Affiliate" value={affiliateId} options={affOptions} onChange={setAffiliateId} placeholder="Select affiliate" />
          <Field label="Client Name" value={clientName} onChangeText={setClientName} />
          <Field label="Client Email" keyboardType="email-address" autoCapitalize="none" value={clientEmail} onChangeText={setClientEmail} />
          <Field label="Amount (USD)" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
          <Field label="Description (optional)" value={description} onChangeText={setDescription} />
          <Button title="Save Sale (50% commission auto-created)" onPress={create} loading={busy} />
        </NewItemForm>

        {list.length === 0 ? (
          <EmptyState icon="cash-outline" title="No sales yet." />
        ) : (
          list.map((s) => (
            <AdminRow
              key={s.id}
              title={`${s.clientName}  ·  ${formatCurrency(s.amount)}`}
              subtitle={`${s.affiliate?.fullName ?? '—'}  ·  ${formatDate(s.createdAt)}${s.description ? `  ·  ${s.description}` : ''}`}
            />
          ))
        )}
      </View>
    </Screen>
  )
}
