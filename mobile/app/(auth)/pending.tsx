import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen, Button, colors, font, spacing } from '@/components/ui'

export default function PendingScreen() {
  const router = useRouter()
  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.wrap}>
        <Ionicons name="hourglass-outline" size={72} color={colors.gold} />
        <Text style={styles.title}>Account Pending Approval</Text>
        <Text style={styles.body}>
          Your account has been created but is awaiting approval from the Trade with Shafy
          team. You&apos;ll be able to sign in and access content once an admin approves your
          account. We&apos;ll notify you as soon as it&apos;s ready.
        </Text>
        <Button
          title="Back to Login"
          variant="outline"
          icon="arrow-back"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 16 },
  title: { color: colors.white, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  body: {
    color: colors.secondary,
    fontSize: font.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
})
