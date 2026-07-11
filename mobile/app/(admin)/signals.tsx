import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, spacing, font } from '@/components/ui'
import { Select } from '@/components/Select'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'
import type { Signal } from '@/types'

export default function AdminSignalsScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Signal[]>('/api/signals?all=1')
  const list = data ?? []
  const [pair, setPair] = useState('XAU/USD')
  const [direction, setDirection] = useState('BUY')
  const [entry, setEntry] = useState('')
  const [tp1, setTp1] = useState('')
  const [tp2, setTp2] = useState('')
  const [tp3, setTp3] = useState('')
  const [sl, setSl] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)

  async function create() {
    setBusy(true)
    try {
      await apiFetch('/api/signals', {
        method: 'POST',
        body: {
          pair, direction,
          entry: parseFloat(entry), tp1: parseFloat(tp1),
          tp2: tp2 ? parseFloat(tp2) : undefined,
          tp3: tp3 ? parseFloat(tp3) : undefined,
          sl: parseFloat(sl), notes: notes || undefined,
        },
      })
      qc.invalidateQueries({ queryKey: ['/api/signals?all=1'] })
      qc.invalidateQueries({ queryKey: ['/api/signals'] })
      setEntry(''); setTp1(''); setTp2(''); setTp3(''); setSl(''); setNotes('')
    } finally {
      setBusy(false)
    }
  }

  async function close(id: string, status: 'HIT_TP' | 'HIT_SL' | 'CLOSED', pips?: number) {
    await apiFetch('/api/signals', { method: 'PATCH', body: { id, status, pips } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/signals?all=1'] })
    qc.invalidateQueries({ queryKey: ['/api/signals'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load signals" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ New Signal" defaultOpen={false}>
          <Field label="Pair" value={pair} onChangeText={setPair} placeholder="EUR/USD" />
          <Select label="Direction" value={direction} options={['BUY', 'SELL']} onChange={setDirection} />
          <Field label="Entry" keyboardType="decimal-pad" value={entry} onChangeText={setEntry} />
          <Field label="TP1" keyboardType="decimal-pad" value={tp1} onChangeText={setTp1} />
          <Field label="TP2 (optional)" keyboardType="decimal-pad" value={tp2} onChangeText={setTp2} />
          <Field label="TP3 (optional)" keyboardType="decimal-pad" value={tp3} onChangeText={setTp3} />
          <Field label="SL" keyboardType="decimal-pad" value={sl} onChangeText={setSl} />
          <Field label="Notes" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} value={notes} onChangeText={setNotes} />
          <Button title="Publish Signal" onPress={create} loading={busy} />
        </NewItemForm>

        {list.length === 0 ? (
          <EmptyState icon="flash-outline" title="No signals yet." />
        ) : (
          list.map((s) => (
            <AdminRow
              key={s.id}
              title={`${s.pair} ${s.direction}`}
              subtitle={`Entry ${s.entry} · TP ${s.tp1} · SL ${s.sl}${s.pips != null ? `  ·  ${s.pips}p` : ''}`}
              badge={<Badge label={s.status} color={s.status === 'HIT_TP' ? colors.primary : s.status === 'HIT_SL' ? colors.red : s.status === 'ACTIVE' ? colors.green : colors.secondary} />}
            >
              {s.status === 'ACTIVE' ? (
                <>
                  <Button title="Hit TP" onPress={() => close(s.id, 'HIT_TP', Math.abs(s.tp1 - s.entry))} />
                  <Button title="Hit SL" variant="danger" onPress={() => close(s.id, 'HIT_SL', -Math.abs(s.sl - s.entry))} />
                  <Button title="Close" variant="outline" onPress={() => close(s.id, 'CLOSED')} />
                </>
              ) : (
                <Text style={{ color: colors.muted, fontSize: font.small }}>Closed</Text>
              )}
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
