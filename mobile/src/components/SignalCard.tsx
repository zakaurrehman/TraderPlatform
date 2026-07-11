import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { colors, radius, font } from '@/theme'
import { formatDateTime } from '@/lib/format'
import type { Signal, SignalStatus } from '@/types'

const STATUS_MAP: Record<SignalStatus, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: '🟢 Active', color: colors.green, bg: 'rgba(22,163,74,0.12)' },
  HIT_TP: { label: '✅ TP Hit', color: colors.primary, bg: 'rgba(37,99,235,0.12)' },
  HIT_SL: { label: '❌ SL Hit', color: colors.red, bg: 'rgba(220,38,38,0.12)' },
  CLOSED: { label: '⬜ Closed', color: colors.secondary, bg: 'rgba(148,163,184,0.1)' },
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  )
}

export default function SignalCard({ signal }: { signal: Signal }) {
  const isBuy = signal.direction === 'BUY'
  const s = STATUS_MAP[signal.status]
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.pair}>{signal.pair}</Text>
          <View
            style={[
              styles.dir,
              { backgroundColor: isBuy ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)' },
            ]}
          >
            <Text style={{ color: isBuy ? colors.green : colors.redText, fontWeight: '800', fontSize: font.tiny }}>
              {signal.direction}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: s.bg, borderColor: `${s.color}33` }]}>
          <Text style={{ color: s.color, fontSize: font.tiny, fontWeight: '700' }}>
            {s.label}
            {signal.pips != null ? ` +${signal.pips}p` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <Cell label="Entry" value={signal.entry.toFixed(5)} />
        <Cell label="TP1" value={signal.tp1.toFixed(5)} />
        <Cell label="SL" value={signal.sl.toFixed(5)} />
      </View>

      {(signal.tp2 || signal.tp3) && (
        <View style={[styles.grid, { marginTop: 6 }]}>
          {signal.tp2 ? <Cell label="TP2" value={signal.tp2.toFixed(5)} /> : <View style={styles.cell} />}
          {signal.tp3 ? <Cell label="TP3" value={signal.tp3.toFixed(5)} /> : <View style={styles.cell} />}
          <View style={styles.cell} />
        </View>
      )}

      {signal.imageUrl ? (
        <Image source={{ uri: signal.imageUrl }} style={styles.image} contentFit="cover" />
      ) : null}

      {signal.notes ? <Text style={styles.notes}>{signal.notes}</Text> : null}
      <Text style={styles.date}>{formatDateTime(signal.createdAt)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pair: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  dir: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill, borderWidth: 1 },
  grid: { flexDirection: 'row', gap: 6 },
  cell: { flex: 1, backgroundColor: colors.overlay, borderRadius: radius.sm, padding: 8 },
  cellLabel: { color: colors.muted, fontSize: font.micro, marginBottom: 2 },
  cellValue: { color: colors.ink, fontSize: font.small, fontWeight: '700' },
  image: { width: '100%', height: 160, borderRadius: radius.md, marginTop: 10 },
  notes: { color: colors.secondary, fontSize: font.small, marginTop: 8, lineHeight: 18 },
  date: { color: colors.muted2, fontSize: font.tiny, marginTop: 8 },
})
