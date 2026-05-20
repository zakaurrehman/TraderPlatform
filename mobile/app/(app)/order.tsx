import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiFetch } from '@/api/client'
import { Screen, Field, Button, colors, font, spacing, radius } from '@/components/ui'
import { Select } from '@/components/Select'
import { SERVICES } from '@/lib/format'
import { PAYMENT_METHODS } from '@/lib/constants'

type Service = (typeof SERVICES)[number]

const schema = z.object({
  clientName: z.string().min(2, 'Full name required'),
  clientEmail: z.string().email('Valid email required'),
  phone: z.string().min(4, 'Phone required'),
  country: z.string().min(2, 'Country required'),
  referralCode: z.string().optional(),
  paymentMethod: z.string().min(1, 'Payment method required'),
  paymentNote: z.string().min(2, 'Add your transaction ID or proof'),
})
type FormData = z.infer<typeof schema>

export default function OrderScreen() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selected, setSelected] = useState<Service | null>(null)
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clientName: '', clientEmail: '', phone: '', country: '', referralCode: '', paymentMethod: '', paymentNote: '' },
  })

  async function onSubmit(d: FormData) {
    if (!selected) return
    setBusy(true)
    setError('')
    try {
      await apiFetch('/api/order', {
        method: 'POST',
        body: { ...d, service: selected.name, amount: selected.price },
        auth: false,
      })
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit')
    } finally {
      setBusy(false)
    }
  }

  if (success) {
    return (
      <Screen>
        <View style={styles.successWrap}>
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <Text style={styles.successTitle}>Order Received!</Text>
          <Text style={styles.successSub}>
            Your payment is being verified. You will receive access within 24 hours.
          </Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Choose Your Plan</Text>

        {step === 1 ? (
          <View>
            {SERVICES.filter((s) => !('comingSoon' in s && s.comingSoon)).map((svc) => (
              <Pressable
                key={svc.name}
                style={[
                  styles.plan,
                  { borderColor: selected?.name === svc.name ? colors.gold : colors.borderSoft },
                ]}
                onPress={() => {
                  setSelected(svc as Service)
                  setStep(2)
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planName}>{svc.name}</Text>
                    <Text style={styles.planDesc}>{svc.description}</Text>
                  </View>
                  <Text style={styles.planPrice}>${svc.price}</Text>
                </View>
                <View style={{ marginTop: 6 }}>
                  {svc.features.map((f) => (
                    <Text key={f} style={styles.feature}>• {f}</Text>
                  ))}
                </View>
                {('popular' in svc && svc.popular) ? <Text style={styles.popular}>🔥 Most Popular</Text> : null}
                {('bestValue' in svc && svc.bestValue) ? <Text style={styles.best}>💎 Best Value</Text> : null}
              </Pressable>
            ))}
          </View>
        ) : selected ? (
          <View>
            <View style={styles.selectedCard}>
              <Text style={styles.selectedLabel}>Selected plan</Text>
              <Text style={styles.selectedName}>{selected.name}</Text>
              <Text style={styles.selectedPrice}>${selected.price}</Text>
            </View>

            <View style={styles.payInstructions}>
              <Text style={styles.payTitle}>Payment Instructions</Text>
              <Text style={styles.payLine}>
                1. Transfer <Text style={{ color: colors.gold, fontWeight: '700' }}>${selected.price}</Text> via one of:
              </Text>
              <Text style={styles.payLine}>• Bank Transfer — contact admin</Text>
              <Text style={styles.payLine}>• USDT (TRC20) — contact admin</Text>
              <Text style={styles.payLine}>• WhatsApp: +1 234 567 8900</Text>
              <Text style={styles.payLine}>2. Fill in your details + transaction ID below</Text>
              <Text style={styles.payLine}>3. Access granted within 24h</Text>
            </View>

            <Controller control={control} name="clientName" render={({ field: { onChange, value } }) => (
              <Field label="Full Name" placeholder="John Doe" value={value} onChangeText={onChange} error={errors.clientName?.message} />
            )} />
            <Controller control={control} name="clientEmail" render={({ field: { onChange, value } }) => (
              <Field label="Email" keyboardType="email-address" autoCapitalize="none" placeholder="you@email.com" value={value} onChangeText={onChange} error={errors.clientEmail?.message} />
            )} />
            <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
              <Field label="Phone" keyboardType="phone-pad" placeholder="+1 234 567 8900" value={value} onChangeText={onChange} error={errors.phone?.message} />
            )} />
            <Controller control={control} name="country" render={({ field: { onChange, value } }) => (
              <Field label="Country" placeholder="United States" value={value} onChangeText={onChange} error={errors.country?.message} />
            )} />
            <Controller control={control} name="referralCode" render={({ field: { onChange, value } }) => (
              <Field label="Referral Code (if any)" placeholder="XXXX000000" autoCapitalize="characters" value={value} onChangeText={onChange} />
            )} />
            <Controller control={control} name="paymentMethod" render={({ field: { onChange, value } }) => (
              <Select label="Preferred Payment Method *" placeholder="Select method" options={PAYMENT_METHODS} value={value} onChange={onChange} error={errors.paymentMethod?.message} />
            )} />
            <Controller control={control} name="paymentNote" render={({ field: { onChange, value } }) => (
              <Field
                label="Transaction ID / Payment Note"
                placeholder="Paste your transaction ID or proof of payment"
                multiline
                numberOfLines={4}
                style={{ minHeight: 100, textAlignVertical: 'top' }}
                value={value}
                onChangeText={onChange}
                error={errors.paymentNote?.message}
              />
            )} />

            {error ? <Text style={{ color: colors.redText, marginBottom: 12 }}>{error}</Text> : null}

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Back" variant="outline" onPress={() => setStep(1)} style={{ flex: 1 }} />
              <Button title="Submit Order" onPress={handleSubmit(onSubmit)} loading={busy} style={{ flex: 2 }} />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  h1: { color: colors.white, fontWeight: '800', fontSize: 24, marginBottom: spacing.lg, textAlign: 'center' },
  plan: { backgroundColor: colors.card, borderWidth: 1, borderRadius: radius.xl, padding: 16, marginBottom: 12 },
  planName: { color: colors.white, fontWeight: '800', fontSize: 16 },
  planDesc: { color: colors.muted, fontSize: font.body, marginTop: 2 },
  planPrice: { color: colors.gold, fontWeight: '900', fontSize: 22 },
  feature: { color: colors.secondary, fontSize: font.small, marginTop: 2 },
  popular: { color: '#ff6666', fontWeight: '700', fontSize: font.tiny, marginTop: 8 },
  best: { color: colors.green, fontWeight: '700', fontSize: font.tiny, marginTop: 8 },
  selectedCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 18, marginBottom: 12 },
  selectedLabel: { color: colors.secondary, fontSize: font.body },
  selectedName: { color: colors.white, fontWeight: '800', fontSize: 18, marginTop: 4 },
  selectedPrice: { color: colors.gold, fontWeight: '900', fontSize: 26, marginTop: 4 },
  payInstructions: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 18, marginBottom: 14 },
  payTitle: { color: colors.white, fontWeight: '700', marginBottom: 8 },
  payLine: { color: colors.secondary, fontSize: font.small, lineHeight: 22 },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 12 },
  successTitle: { color: colors.white, fontWeight: '800', fontSize: 22 },
  successSub: { color: colors.muted, fontSize: font.body, textAlign: 'center', lineHeight: 22 },
})
