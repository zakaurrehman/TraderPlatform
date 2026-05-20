import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Screen, Field, Button, colors, font, spacing } from '@/components/ui'
import { Select } from '@/components/Select'
import { useAuth } from '@/auth/AuthContext'
import { COUNTRIES, PAYMENT_METHODS } from '@/lib/constants'
import { getRefCode, clearRefCode } from '@/lib/refcode'

const LOGO = require('../../assets/logo.png')

const schema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Valid email required'),
    phone: z.string().min(4, 'Phone is required'),
    city: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    username: z.string().min(3, 'Username must be 3+ chars'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    socialHandle: z.string().optional(),
    referralCode: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type FormData = z.infer<typeof schema>

export default function RegisterScreen() {
  const { register } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '', email: '', phone: '', city: '', country: '',
      username: '', password: '', confirmPassword: '',
      paymentMethod: '', socialHandle: '', referralCode: '',
    },
  })

  useEffect(() => {
    getRefCode().then((code) => {
      if (code) setValue('referralCode', code)
    })
  }, [setValue])

  async function onSubmit(data: FormData) {
    setError('')
    setLoading(true)
    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        username: data.username,
        password: data.password,
        paymentMethod: data.paymentMethod,
        socialHandle: data.socialHandle,
        referralCode: data.referralCode,
      })
      await clearRefCode()
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Screen edges={['top', 'bottom']}>
        <View style={styles.successWrap}>
          <Ionicons name="checkmark-circle" size={72} color={colors.green} />
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successSub}>
            Your affiliate account is under review. You will be notified once approved.
          </Text>
          <Button title="Back to Login" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <Image source={LOGO} style={styles.logo} contentFit="contain" />
          <Text style={styles.sub}>Register as an Affiliate</Text>
        </View>

        <View style={styles.card}>
          <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => (
            <Field label="Full Name *" placeholder="John Doe" value={value} onChangeText={onChange} error={errors.fullName?.message} />
          )} />
          <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
            <Field label="Email *" placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.email?.message} />
          )} />
          <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
            <Field label="Phone *" placeholder="+1 234 567 8900" keyboardType="phone-pad" value={value} onChangeText={onChange} error={errors.phone?.message} />
          )} />
          <Controller control={control} name="city" render={({ field: { onChange, value } }) => (
            <Field label="City" placeholder="New York" value={value} onChangeText={onChange} />
          )} />
          <Controller control={control} name="country" render={({ field: { onChange, value } }) => (
            <Select label="Country *" placeholder="Select your country" options={COUNTRIES} value={value} onChange={onChange} error={errors.country?.message} />
          )} />
          <Controller control={control} name="username" render={({ field: { onChange, value } }) => (
            <Field label="Username *" placeholder="johndoe" autoCapitalize="none" value={value} onChangeText={onChange} error={errors.username?.message} />
          )} />
          <Controller control={control} name="paymentMethod" render={({ field: { onChange, value } }) => (
            <Select label="Preferred Payment Method *" placeholder="Select payment method" options={PAYMENT_METHODS} value={value} onChange={onChange} error={errors.paymentMethod?.message} />
          )} />
          <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
            <Field label="Password *" placeholder="••••••••" secureTextEntry value={value} onChangeText={onChange} error={errors.password?.message} />
          )} />
          <Controller control={control} name="confirmPassword" render={({ field: { onChange, value } }) => (
            <Field label="Re-enter Password *" placeholder="••••••••" secureTextEntry value={value} onChangeText={onChange} error={errors.confirmPassword?.message} />
          )} />
          <Controller control={control} name="socialHandle" render={({ field: { onChange, value } }) => (
            <Field label="Social Handle (optional)" placeholder="@yourhandle" autoCapitalize="none" value={value} onChangeText={onChange} />
          )} />
          <Controller control={control} name="referralCode" render={({ field: { onChange, value } }) => (
            <Field label="Referral Code (optional)" placeholder="Auto-filled from invite link" autoCapitalize="characters" value={value} onChangeText={onChange} />
          )} />

          {error ? (
            <View style={styles.errBox}><Text style={styles.errText}>{error}</Text></View>
          ) : null}

          <Button title="Submit Application" icon="arrow-forward" onPress={handleSubmit(onSubmit)} loading={loading} style={{ marginTop: 4 }} />

          <Text style={styles.footer}>
            Already registered?{' '}
            <Link href="/(auth)/login" style={{ color: colors.gold, fontWeight: '700' }}>Sign In</Link>
          </Text>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.xl },
  logo: { width: 240, height: 70 },
  sub: { color: colors.muted, fontSize: font.body, textAlign: 'center', marginTop: 4 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 22 },
  errBox: { backgroundColor: 'rgba(255,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(255,68,68,0.3)', borderRadius: 8, padding: 12, marginBottom: 12 },
  errText: { color: colors.redText, fontSize: font.body },
  footer: { textAlign: 'center', color: colors.muted2, fontSize: font.body, marginTop: 20 },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 14 },
  successTitle: { color: colors.white, fontSize: 22, fontWeight: '800' },
  successSub: { color: colors.muted, fontSize: font.body, textAlign: 'center', lineHeight: 22, marginBottom: 10 },
})
