import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/auth/AuthContext'
import { Screen, Button, colors, font, spacing, radius } from '@/components/ui'

const TILES: { label: string; icon: keyof typeof Ionicons.glyphMap; href: string; desc: string }[] = [
  { label: 'Users', icon: 'people-outline', href: '/(admin)/users', desc: 'Approve / change plan' },
  { label: 'Signals', icon: 'flash-outline', href: '/(admin)/signals', desc: 'Post & close signals' },
  { label: 'Research', icon: 'document-text-outline', href: '/(admin)/research', desc: 'Posts & gating' },
  { label: 'Courses', icon: 'school-outline', href: '/(admin)/courses', desc: 'Manage videos' },
  { label: 'Live', icon: 'radio-outline', href: '/(admin)/sessions', desc: 'Stream sessions' },
  { label: 'Calendar', icon: 'calendar-outline', href: '/(admin)/calendar', desc: 'Economic events' },
  { label: 'Brokers', icon: 'business-outline', href: '/(admin)/brokers', desc: 'Affiliate brokers' },
  { label: 'Resources', icon: 'folder-outline', href: '/(admin)/resources', desc: 'Downloads & tiers' },
  { label: 'Reviews', icon: 'star-outline', href: '/(admin)/reviews', desc: 'Moderation queue' },
  { label: 'Sales', icon: 'cash-outline', href: '/(admin)/sales', desc: 'Record sales' },
  { label: 'Affiliates', icon: 'git-branch-outline', href: '/(admin)/affiliates', desc: 'Affiliate stats' },
  { label: 'Withdrawals', icon: 'wallet-outline', href: '/(admin)/withdrawals', desc: 'Pay out requests' },
  { label: 'Payments', icon: 'card-outline', href: '/(admin)/payments', desc: 'Confirm orders' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  return (
    <Screen scroll>
      <View style={styles.head}>
        <Text style={styles.title}>Welcome, {user?.fullName?.split(' ')[0] ?? 'Admin'}</Text>
        <Text style={styles.sub}>Trade with Shafy — Admin Console</Text>
      </View>
      <View style={styles.grid}>
        {TILES.map((t) => (
          <Pressable
            key={t.href}
            style={styles.tile}
            onPress={() => router.push(t.href as never)}
          >
            <Ionicons name={t.icon} size={22} color={colors.primary} />
            <Text style={styles.tileLabel}>{t.label}</Text>
            <Text style={styles.tileSub}>{t.desc}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ padding: spacing.lg }}>
        <Button
          title="Sign Out"
          variant="dangerSoft"
          icon="log-out-outline"
          onPress={signOut}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  head: { padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  title: { color: colors.ink, fontWeight: '800', fontSize: 22 },
  sub: { color: colors.muted, fontSize: font.body, marginTop: 2 },
  grid: { padding: spacing.lg, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: { width: '48%', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, gap: 6 },
  tileLabel: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  tileSub: { color: colors.muted, fontSize: font.tiny },
})
