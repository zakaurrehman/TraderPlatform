import React, { useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, spacing } from '@/components/ui'
import { Select } from '@/components/Select'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'
import type { Resource, ResourceTier } from '@/types'

const TIERS: ResourceTier[] = ['FREE', 'BASIC', 'PREMIUM']

export default function AdminResourcesScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Resource[]>('/api/resources')
  const items = data ?? []
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [category, setCategory] = useState('Guides')
  const [tier, setTier] = useState<ResourceTier>('FREE')
  const [busy, setBusy] = useState(false)

  async function create() {
    setBusy(true)
    try {
      await apiFetch('/api/resources', {
        method: 'POST',
        body: { title, description, fileUrl, category, tier },
      })
      qc.invalidateQueries({ queryKey: ['/api/resources'] })
      setTitle(''); setDescription(''); setFileUrl('')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load resources" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ New Resource">
          <Field label="Title" value={title} onChangeText={setTitle} />
          <Field label="Description" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} value={description} onChangeText={setDescription} />
          <Field label="File URL" autoCapitalize="none" value={fileUrl} onChangeText={setFileUrl} />
          <Field label="Category" value={category} onChangeText={setCategory} />
          <Select label="Tier" value={tier} options={TIERS} onChange={(v) => setTier(v as ResourceTier)} />
          <Button title="Add Resource" onPress={create} loading={busy} />
        </NewItemForm>

        {items.length === 0 ? (
          <EmptyState icon="folder-outline" title="No resources yet." />
        ) : (
          items.map((r) => (
            <AdminRow
              key={r.id}
              title={r.title}
              subtitle={`${r.category}  ·  ${r.downloads} downloads`}
              badge={<Badge label={r.tier} color={r.tier === 'FREE' ? colors.green : r.tier === 'BASIC' ? colors.gold : '#f0b429'} />}
            />
          ))
        )}
      </View>
    </Screen>
  )
}
