import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Field, Button, Loader, colors, font, spacing, radius } from '@/components/ui'
import { formatDate } from '@/lib/format'

type Resp = {
  available: number
  requests: { id: string; amount: number; status: string; createdAt: string; note?: string | null }[]
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: '#f59e0b',
  APPROVED: '#2563eb',
  PAID: '#16a34a',
  REJECTED: '#dc2626',
}

export default function WithdrawScreen() {
  const qc = useQueryClient()
  const { data, isLoading, refetch } = useApi<Resp>('/api/withdrawals')
  const available = data?.available ?? 0
  const requests = data?.requests ?? []
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const schema = z.object({
    amount: z.coerce
      .number()
      .positive('Enter an amount')
      .max(available, `Cannot exceed available ($${available.toFixed(2)})`),
    note: z.string().optional(),
  })
  type FormData = z.infer<typeof schema>

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, note: '' },
  })

  async function onSubmit(d: FormData) {
    setBusy(true)
    setError('')
    try {
      await apiFetch('/api/withdrawals', { method: 'POST', body: { amount: d.amount, note: d.note } })
      qc.invalidateQueries({ queryKey: ['/api/withdrawals'] })
      qc.invalidateQueries({ queryKey: ['/api/mobile/affiliate'] })
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) return <Screen><Loader /></Screen>

  return (
    <Screen scroll refreshing={false} onRefresh={refetch}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>${available.toFixed(2)}</Text>
        </View>

        {success ? (
          <View style={styles.successBox}>
            <Text style={{ fontSize: 32 }}>✅</Text>
            <Text style={styles.successText}>Request submitted! Admin will process within 24–48h.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Controller control={control} name="amount" render={({ field: { onChange, value } }) => (
              <Field
                label="Amount (USD)"
                keyboardType="decimal-pad"
                placeholder="0.00"
                value={String(value || '')}
                onChangeText={(t) => onChange(t)}
                error={errors.amount?.message}
              />
            )} />
            <Controller control={control} name="note" render={({ field: { onChange, value } }) => (
              <Field
                label="Payment details / note"
                placeholder="e.g. USDT TRC20: TXxxx… or Bank: John Doe, Acct 1234"
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
                value={value}
                onChangeText={onChange}
              />
            )} />
            {error ? <Text style={{ color: colors.redText, marginBottom: 12 }}>{error}</Text> : null}
            <Button title="Request Withdrawal" onPress={handleSubmit(onSubmit)} loading={busy} />
          </View>
        )}

        {requests.length > 0 && (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.section}>Previous Requests</Text>
            {requests.map((r) => (
              <View key={r.id} style={styles.reqRow}>
                <View>
                  <Text style={styles.reqAmt}>${r.amount.toFixed(2)}</Text>
                  <Text style={styles.reqDate}>{formatDate(r.createdAt)}</Text>
                </View>
                <Text style={[styles.reqStatus, { color: STATUS_COLOR[r.status] || colors.secondary }]}>
                  {r.status}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  balanceCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(22,163,74,0.15)', borderRadius: radius.xl, padding: 18, alignItems: 'center', marginBottom: 14 },
  balanceLabel: { color: colors.muted, fontSize: font.body },
  balanceValue: { color: colors.green, fontWeight: '900', fontSize: 36, marginTop: 4 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 18 },
  successBox: { backgroundColor: 'rgba(22,163,74,0.06)', borderWidth: 1, borderColor: 'rgba(22,163,74,0.2)', borderRadius: radius.lg, padding: 20, alignItems: 'center', gap: 8 },
  successText: { color: colors.green, fontWeight: '700', textAlign: 'center' },
  section: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 8 },
  reqRow: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reqAmt: { color: colors.ink, fontWeight: '700' },
  reqDate: { color: colors.muted2, fontSize: font.tiny },
  reqStatus: { fontWeight: '700', fontSize: font.small },
})
