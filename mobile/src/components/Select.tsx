import React, { useState } from 'react'
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font } from '@/theme'

export function Select({
  label,
  value,
  options,
  placeholder = 'Select…',
  onChange,
  error,
}: {
  label?: string
  value: string
  options: string[] | { label: string; value: string }[]
  placeholder?: string
  onChange: (v: string) => void
  error?: string
}) {
  const [open, setOpen] = useState(false)
  const norm = options.map((o) =>
    typeof o === 'string' ? { label: o, value: o } : o
  )
  const selected = norm.find((o) => o.value === value)

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.box} onPress={() => setOpen(true)}>
        <Text style={{ color: selected ? colors.white : colors.muted, fontSize: 15 }}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.muted} />
      </Pressable>
      {error ? <Text style={styles.err}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label || 'Select'}</Text>
            <FlatList
              data={norm}
              keyExtractor={(i) => i.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                >
                  <Text
                    style={{
                      color: item.value === value ? colors.gold : colors.body,
                      fontSize: 15,
                      fontWeight: item.value === value ? '700' : '400',
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.value === value ? (
                    <Ionicons name="checkmark" size={18} color={colors.gold} />
                  ) : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  label: { color: colors.secondary, fontSize: font.body, marginBottom: 6 },
  box: {
    backgroundColor: colors.overlay2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  err: { color: colors.redText, fontSize: font.small, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    maxHeight: '70%',
  },
  sheetTitle: {
    color: colors.white,
    fontWeight: '800',
    fontSize: font.h3,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
})
