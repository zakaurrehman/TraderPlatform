import React, { useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, spacing } from '@/components/ui'
import { Select } from '@/components/Select'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'
import { formatDateTime } from '@/lib/format'
import type { EconomicEvent, Impact } from '@/types'

const IMPACTS: Impact[] = ['LOW', 'MEDIUM', 'HIGH']

export default function AdminCalendarScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<EconomicEvent[]>('/api/calendar')
  const events = data ?? []
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [impact, setImpact] = useState<Impact>('MEDIUM')
  const [eventTime, setEventTime] = useState('')
  const [forecast, setForecast] = useState('')
  const [previous, setPrevious] = useState('')
  const [actuals, setActuals] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  async function create() {
    setBusy(true)
    try {
      await apiFetch('/api/calendar', {
        method: 'POST',
        body: { name, currency, impact, eventTime, forecast: forecast || undefined, previous: previous || undefined },
      })
      qc.invalidateQueries({ queryKey: ['/api/calendar'] })
      setName(''); setEventTime(''); setForecast(''); setPrevious('')
    } finally {
      setBusy(false)
    }
  }

  async function setActual(id: string) {
    const value = actuals[id]
    if (!value) return
    await apiFetch('/api/calendar', { method: 'PATCH', body: { id, actual: value } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/calendar'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load calendar" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ New Event">
          <Field label="Name" value={name} onChangeText={setName} />
          <Field label="Currency (e.g. USD)" autoCapitalize="characters" value={currency} onChangeText={setCurrency} />
          <Select label="Impact" value={impact} options={IMPACTS} onChange={(v) => setImpact(v as Impact)} />
          <Field label="Event Time (ISO)" autoCapitalize="none" value={eventTime} onChangeText={setEventTime} />
          <Field label="Forecast" value={forecast} onChangeText={setForecast} />
          <Field label="Previous" value={previous} onChangeText={setPrevious} />
          <Button title="Create Event" onPress={create} loading={busy} />
        </NewItemForm>

        {events.length === 0 ? (
          <EmptyState icon="calendar-outline" title="No events yet." />
        ) : (
          events.map((e) => (
            <AdminRow
              key={e.id}
              title={`${e.name}  ·  ${e.currency}`}
              subtitle={`${formatDateTime(e.eventTime)}${e.forecast ? `  ·  Fcst ${e.forecast}` : ''}${e.previous ? `  ·  Prev ${e.previous}` : ''}${e.actual ? `  ·  Actual ${e.actual}` : ''}`}
              badge={<Badge label={e.impact} color={e.impact === 'HIGH' ? colors.red : e.impact === 'MEDIUM' ? '#f59e0b' : colors.green} />}
            >
              <Field
                placeholder="Set actual"
                value={actuals[e.id] ?? ''}
                onChangeText={(t) => setActuals((m) => ({ ...m, [e.id]: t }))}
              />
              <Button title="Save Actual" variant="outline" onPress={() => setActual(e.id)} />
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
