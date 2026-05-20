import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, font, spacing, radius } from '@/theme'

/** Shared list-row container for admin module screens. */
export function AdminRow({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <View style={styles.row}>
      <View style={styles.headRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
        </View>
        {badge}
      </View>
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 12, marginBottom: 8 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  title: { color: colors.white, fontWeight: '700', fontSize: 14 },
  sub: { color: colors.muted, fontSize: font.small, marginTop: 2 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
})
