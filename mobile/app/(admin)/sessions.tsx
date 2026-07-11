import React, { useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, spacing } from '@/components/ui'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'
import { formatDateTime } from '@/lib/format'
import type { LiveSession } from '@/types'

export default function AdminSessionsScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<LiveSession[]>('/api/live')
  const list = data ?? []
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [streamUrl, setStreamUrl] = useState('')
  // ISO 8601 e.g. 2026-05-25T19:00:00
  const [scheduledAt, setScheduledAt] = useState('')
  const [busy, setBusy] = useState(false)

  async function create() {
    setBusy(true)
    try {
      await apiFetch('/api/live', {
        method: 'POST',
        body: { title, description: description || null, streamUrl: streamUrl || null, scheduledAt },
      })
      qc.invalidateQueries({ queryKey: ['/api/live'] })
      setTitle(''); setDescription(''); setStreamUrl(''); setScheduledAt('')
    } finally {
      setBusy(false)
    }
  }

  async function toggleLive(id: string, isLive: boolean) {
    await apiFetch('/api/live', { method: 'PATCH', body: { id, isLive } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/live'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load sessions" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ New Live Session">
          <Field label="Title" value={title} onChangeText={setTitle} />
          <Field label="Description" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} value={description} onChangeText={setDescription} />
          <Field label="Stream URL" autoCapitalize="none" value={streamUrl} onChangeText={setStreamUrl} />
          <Field
            label="Scheduled At (ISO, e.g. 2026-05-25T19:00:00Z)"
            autoCapitalize="none"
            value={scheduledAt}
            onChangeText={setScheduledAt}
          />
          <Button title="Schedule" onPress={create} loading={busy} />
        </NewItemForm>

        {list.length === 0 ? (
          <EmptyState icon="radio-outline" title="No sessions yet." />
        ) : (
          list.map((s) => (
            <AdminRow
              key={s.id}
              title={s.title}
              subtitle={formatDateTime(s.scheduledAt)}
              badge={<Badge label={s.isLive ? 'LIVE' : 'SCHEDULED'} color={s.isLive ? colors.red : colors.primary} />}
            >
              <Button
                title={s.isLive ? 'End Live' : 'Go Live'}
                variant={s.isLive ? 'danger' : 'primary'}
                onPress={() => toggleLive(s.id, !s.isLive)}
              />
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
