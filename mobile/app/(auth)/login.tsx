import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Image } from 'expo-image'
import { Link, useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Screen, Field, Button, colors, font, spacing } from '@/components/ui'
import { useAuth, PendingApprovalError } from '@/auth/AuthContext'
import { ApiError } from '@/api/client'

const schema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

const LOGO = require('../../assets/logo.png')

export default function LoginScreen() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  async function onSubmit(data: FormData) {
    setError('')
    setLoading(true)
    try {
      await signIn(data.username.trim(), data.password)
      // Root navigator handles role-based redirect.
    } catch (e) {
      if (e instanceof PendingApprovalError) {
        router.replace('/(auth)/pending')
        return
      }
      // Provide more helpful errors based on what the server actually returned.
      if (e instanceof ApiError) {
        if (e.status === 401) {
          setError('Invalid username/email or password.')
        } else if (e.status === 429) {
          setError('Too many attempts. Please wait a minute and try again.')
        } else if (e.status === 404 || e.status === 0) {
          setError('Cannot reach the server. Please check your connection.')
        } else {
          setError(e.message || 'Login failed')
        }
      } else {
        setError('Cannot reach the server. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <View style={styles.brandWrap}>
            <Image source={LOGO} style={styles.logo} contentFit="contain" />
            <Text style={styles.sub}>Sign in to your account</Text>
          </View>

          <View style={styles.card}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <Field
                  label="Username or Email"
                  placeholder="Enter your username or email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  error={errors.username?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Field
                  label="Password"
                  placeholder="Enter password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            {error ? (
              <View style={styles.errBox}>
                <Text style={styles.errText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={{ marginTop: 4 }}
            />

            <Text style={styles.footer}>
              Don&apos;t have an account?{' '}
              <Link href="/(auth)/register" style={{ color: colors.gold, fontWeight: '700' }}>
                Register as Affiliate
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  brandWrap: { alignItems: 'center', marginBottom: spacing.xl },
  logo: { width: 240, height: 70, marginBottom: 8 },
  sub: { color: colors.muted, fontSize: font.body, marginTop: 6 },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 24,
  },
  errBox: {
    backgroundColor: 'rgba(255,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errText: { color: colors.redText, fontSize: font.body },
  footer: { textAlign: 'center', color: colors.muted2, fontSize: font.body, marginTop: 20 },
})
