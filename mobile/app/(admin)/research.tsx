import React, { useState } from 'react'
import { View } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, spacing } from '@/components/ui'
import { Select } from '@/components/Select'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'
import type { ResearchPost } from '@/types'

const CATEGORIES = ['Forex', 'Gold', 'Crypto', 'Stocks', 'Indices', 'Crude Oil']

export default function AdminResearchScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<ResearchPost[]>('/api/research?admin=1')
  const posts = data ?? []
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Forex')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [premium, setPremium] = useState('false')
  const [busy, setBusy] = useState(false)

  async function create() {
    setBusy(true)
    try {
      await apiFetch('/api/research', {
        method: 'POST',
        body: { title, category, content, imageUrl: imageUrl || undefined, isPremium: premium === 'true' },
      })
      qc.invalidateQueries({ queryKey: ['/api/research?admin=1'] })
      qc.invalidateQueries({ queryKey: ['/api/research'] })
      setTitle(''); setContent(''); setImageUrl('')
    } finally {
      setBusy(false)
    }
  }

  async function toggle(p: ResearchPost, field: 'published' | 'isPremium') {
    await apiFetch('/api/research', { method: 'PATCH', body: { id: p.id, [field]: !p[field] } }).catch(() => {})
    qc.invalidateQueries({ queryKey: ['/api/research?admin=1'] })
    qc.invalidateQueries({ queryKey: ['/api/research'] })
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load research" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ New Research Post">
          <Field label="Title" value={title} onChangeText={setTitle} />
          <Select label="Category" value={category} options={CATEGORIES} onChange={setCategory} />
          <Field label="Content (markdown / text)" multiline numberOfLines={5} style={{ minHeight: 140, textAlignVertical: 'top' }} value={content} onChangeText={setContent} />
          <Field label="Image URL (optional)" autoCapitalize="none" value={imageUrl} onChangeText={setImageUrl} />
          <Select label="Premium?" value={premium} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={setPremium} />
          <Button title="Publish" onPress={create} loading={busy} />
        </NewItemForm>

        {posts.length === 0 ? (
          <EmptyState icon="document-text-outline" title="No research posts yet." />
        ) : (
          posts.map((p) => (
            <AdminRow
              key={p.id}
              title={p.title}
              subtitle={`${p.category}${p.isPremium ? ' · Premium' : ''}`}
              badge={<Badge label={p.published ? 'PUBLISHED' : 'HIDDEN'} color={p.published ? colors.green : colors.muted} />}
            >
              <Button title={p.published ? 'Unpublish' : 'Publish'} variant="outline" onPress={() => toggle(p, 'published')} />
              <Button title={p.isPremium ? 'Make free' : 'Make premium'} variant="outline" onPress={() => toggle(p, 'isPremium')} />
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
