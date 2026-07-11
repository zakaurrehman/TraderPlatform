import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, font, spacing, radius } from '@/theme'

/**
 * Collapsible "New item" card used across admin screens. The caller renders
 * its own fields + submit button inside `children`.
 */
export function NewItemForm({
  label = '+ New',
  children,
  defaultOpen = false,
}: {
  label?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.head} onPress={() => setOpen((v) => !v)}>
        <Text style={styles.label}>{label}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primary} />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginBottom: spacing.md, overflow: 'hidden' },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  label: { color: colors.primary, fontWeight: '700', fontSize: font.body },
  body: { padding: 12, borderTopWidth: 1, borderTopColor: colors.borderSoft },
})
