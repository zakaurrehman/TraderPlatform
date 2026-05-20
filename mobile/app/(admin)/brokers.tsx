import React, { useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, spacing } from '@/components/ui'
import { Select } from '@/components/Select'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'
import type { Broker } from '@/types'

export default function AdminBrokersScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Broker[]>('/api/brokers')
  const brokers = data ?? []
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState('4.5')
  const [link, setLink] = useState('')
  const [minDeposit, setMinDeposit] = useState('')
  const [regulation, setRegulation] = useState('')
  const [recommended, setRecommended] = useState('false')
  const [busy, setBusy] = useState(false)

  async function create() {
    setBusy(true)
    try {
      await apiFetch('/api/brokers', {
        method: 'POST',
        body: {
          name, description, rating: parseFloat(rating), link,
          minDeposit: minDeposit || undefined, regulation: regulation || undefined,
          isRecommended: recommended === 'true',
        },
      })
      qc.invalidateQueries({ queryKey: ['/api/brokers'] })
      setName(''); setDescription(''); setLink(''); setMinDeposit(''); setRegulation('')
    } finally {
      setBusy(false)
    }
  }

  async function toggleRecommended(b: Broker) {
    await apiFetch('/api/brokers', { method: 'PATCH', body: { id: b.id, isRecommended: !b.isRecommended } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/brokers'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load brokers" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ New Broker">
          <Field label="Name" value={name} onChangeText={setName} />
          <Field label="Description" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} value={description} onChangeText={setDescription} />
          <Field label="Rating (0-5)" keyboardType="decimal-pad" value={rating} onChangeText={setRating} />
          <Field label="Affiliate Link" autoCapitalize="none" value={link} onChangeText={setLink} />
          <Field label="Min Deposit" value={minDeposit} onChangeText={setMinDeposit} />
          <Field label="Regulation" value={regulation} onChangeText={setRegulation} />
          <Select label="Recommended?" value={recommended} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={setRecommended} />
          <Button title="Add Broker" onPress={create} loading={busy} />
        </NewItemForm>

        {brokers.length === 0 ? (
          <EmptyState icon="business-outline" title="No brokers yet." />
        ) : (
          brokers.map((b) => (
            <AdminRow
              key={b.id}
              title={b.name}
              subtitle={b.description.slice(0, 80)}
              badge={b.isRecommended ? <Badge label="⭐ PICK" color={colors.gold} /> : <Badge label="LISTED" color={colors.muted} />}
            >
              <Button title={b.isRecommended ? 'Unfeature' : 'Feature'} variant="outline" onPress={() => toggleRecommended(b)} />
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
