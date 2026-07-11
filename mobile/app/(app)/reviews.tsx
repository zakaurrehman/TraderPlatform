import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Field, Button, Loader, ErrorState, colors, font, spacing, radius } from '@/components/ui'
import { timeAgo } from '@/lib/format'
import type { Review } from '@/types'

const schema = z.object({
  clientName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, 'Tell us a bit more'),
})
type FormData = z.infer<typeof schema>

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)}>
          <Text style={{ fontSize: 28, color: n <= value ? '#f59e0b' : colors.muted2 }}>★</Text>
        </Pressable>
      ))}
    </View>
  )
}

export default function ReviewsScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Review[]>('/api/reviews')
  const reviews = data ?? []
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clientName: '', email: '', rating: 5, content: '' },
  })

  async function onSubmit(d: FormData) {
    setBusy(true)
    try {
      await apiFetch('/api/reviews', {
        method: 'POST',
        body: { clientName: d.clientName, email: d.email || null, rating: d.rating, content: d.content },
        auth: false,
      })
      qc.invalidateQueries({ queryKey: ['/api/reviews'] })
      setSuccess(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        {success ? (
          <View style={styles.successBox}>
            <Text style={{ fontSize: 36 }}>✅</Text>
            <Text style={styles.successText}>Review submitted! Pending approval.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>Leave a Review</Text>
            <Controller control={control} name="clientName" render={({ field: { onChange, value } }) => (
              <Field label="Your Name" placeholder="John Doe" value={value} onChangeText={onChange} error={errors.clientName?.message} />
            )} />
            <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
              <Field label="Email (optional)" placeholder="you@email.com" autoCapitalize="none" keyboardType="email-address" value={value} onChangeText={onChange} error={errors.email?.message} />
            )} />
            <Text style={styles.label}>Rating</Text>
            <Controller control={control} name="rating" render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: spacing.md }}>
                <Stars value={value} onChange={onChange} />
              </View>
            )} />
            <Controller control={control} name="content" render={({ field: { onChange, value } }) => (
              <Field
                label="Your Review"
                placeholder="Share your experience…"
                multiline
                numberOfLines={5}
                style={{ minHeight: 120, textAlignVertical: 'top' }}
                value={value}
                onChangeText={onChange}
                error={errors.content?.message}
              />
            )} />
            <Button title="Submit Review" onPress={handleSubmit(onSubmit)} loading={busy} />
          </View>
        )}

        <Text style={styles.section}>What clients are saying</Text>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <ErrorState message="Could not load reviews" onRetry={() => refetch()} />
        ) : reviews.length === 0 ? (
          <Text style={{ color: colors.muted2, textAlign: 'center', padding: 24 }}>No reviews yet.</Text>
        ) : (
          reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={styles.reviewName}>{r.clientName}</Text>
                <Text style={styles.reviewTime}>{timeAgo(r.createdAt)}</Text>
              </View>
              <Text style={{ color: '#f59e0b', marginBottom: 6 }}>{'★'.repeat(r.rating)}</Text>
              <Text style={styles.reviewBody}>{r.content}</Text>
            </View>
          ))
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 20, marginBottom: spacing.lg },
  title: { color: colors.ink, fontWeight: '800', fontSize: 18, marginBottom: spacing.md },
  label: { color: colors.secondary, fontSize: font.body, marginBottom: 6 },
  successBox: { backgroundColor: 'rgba(22,163,74,0.06)', borderWidth: 1, borderColor: 'rgba(22,163,74,0.2)', borderRadius: radius.lg, padding: 24, alignItems: 'center', marginBottom: spacing.lg, gap: 8 },
  successText: { color: colors.green, fontWeight: '700' },
  section: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 8, marginTop: spacing.md },
  reviewCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 14, marginBottom: 8 },
  reviewName: { color: colors.ink, fontWeight: '700' },
  reviewTime: { color: colors.muted2, fontSize: font.tiny },
  reviewBody: { color: colors.secondary, fontSize: font.body, lineHeight: 20 },
})
