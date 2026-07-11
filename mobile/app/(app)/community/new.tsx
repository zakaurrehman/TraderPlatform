import React, { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiFetch } from '@/api/client'
import { Screen, Field, Button, spacing } from '@/components/ui'

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(5, 'Write something to share'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

export default function NewPostScreen() {
  const router = useRouter()
  const qc = useQueryClient()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '', imageUrl: '' },
  })

  async function onSubmit(data: FormData) {
    setBusy(true)
    setError('')
    try {
      await apiFetch('/api/community', {
        method: 'POST',
        body: { title: data.title, content: data.content, imageUrl: data.imageUrl || undefined },
      })
      qc.invalidateQueries({ queryKey: ['/api/community'] })
      router.back()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not post')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen scroll>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <Controller control={control} name="title" render={({ field: { onChange, value } }) => (
          <Field label="Title" placeholder="What's your analysis?" value={value} onChangeText={onChange} error={errors.title?.message} />
        )} />
        <Controller control={control} name="content" render={({ field: { onChange, value } }) => (
          <Field
            label="Content"
            placeholder="Share your trade idea, chart breakdown…"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={6}
            style={{ minHeight: 140, textAlignVertical: 'top' }}
            error={errors.content?.message}
          />
        )} />
        <Controller control={control} name="imageUrl" render={({ field: { onChange, value } }) => (
          <Field label="Image URL (optional)" placeholder="https://…" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.imageUrl?.message} />
        )} />
        {error ? <Text style={{ color: '#dc2626', marginBottom: 12 }}>{error}</Text> : null}
        <Button title="Publish Post" onPress={handleSubmit(onSubmit)} loading={busy} />
      </ScrollView>
    </Screen>
  )
}
