import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useApi } from '@/api/hooks'
import { Screen, Loader, ErrorState, EmptyState, colors, font, spacing, radius } from '@/components/ui'
import type { Broker } from '@/types'

export default function BrokersScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Broker[]>('/api/brokers')
  const brokers = data ?? []

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load brokers" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <View style={styles.disclaimer}>
          <Text style={styles.discTitle}>Disclaimer</Text>
          <Text style={styles.discBody}>
            These are affiliate broker links. Always do your own research. Trading involves risk and you
            may lose more than you invest.
          </Text>
        </View>

        {brokers.length === 0 ? (
          <EmptyState icon="business-outline" title="Broker recommendations coming soon." />
        ) : (
          brokers.map((b) => (
            <View
              key={b.id}
              style={[
                styles.card,
                { borderColor: b.isRecommended ? 'rgba(245,158,11,0.25)' : colors.borderSoft },
              ]}
            >
              {b.isRecommended ? (
                <View style={[styles.pickBadge, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                  <Ionicons name="star" size={11} color="#f59e0b" />
                  <Text style={{ color: '#f59e0b', fontSize: font.tiny, fontWeight: '700' }}>
                    Shafy&apos;s Pick
                  </Text>
                </View>
              ) : null}
              <View style={styles.headRow}>
                <Text style={styles.name}>{b.name}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.rating}>{b.rating}</Text>
                </View>
              </View>
              <Text style={styles.desc}>{b.description}</Text>
              <View style={styles.tagsRow}>
                {b.minDeposit ? (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Min: {b.minDeposit}</Text>
                  </View>
                ) : null}
                {b.regulation ? (
                  <View style={[styles.tag, { backgroundColor: 'rgba(22,163,74,0.08)' }]}>
                    <Text style={[styles.tagText, { color: colors.green }]}>✓ {b.regulation}</Text>
                  </View>
                ) : null}
              </View>
              <Pressable style={styles.btn} onPress={() => WebBrowser.openBrowserAsync(b.link)}>
                <Text style={styles.btnText}>Open Account</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  disclaimer: { backgroundColor: 'rgba(245,158,11,0.06)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: radius.md, padding: 12, marginBottom: 14 },
  discTitle: { color: '#f59e0b', fontWeight: '700', fontSize: font.body },
  discBody: { color: colors.secondary, fontSize: font.small, lineHeight: 18, marginTop: 4 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderRadius: radius.lg, padding: 16, marginBottom: 12 },
  pickBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 8 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  name: { color: colors.ink, fontWeight: '800', fontSize: 17 },
  ratingRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  star: { color: '#f59e0b', fontSize: 14 },
  rating: { color: colors.ink, fontWeight: '700', fontSize: font.body },
  desc: { color: colors.muted, fontSize: font.body, lineHeight: 20, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  tag: { backgroundColor: 'rgba(37,99,235,0.08)', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  tagText: { color: colors.secondary, fontSize: font.tiny },
  btn: { backgroundColor: colors.primary, borderRadius: radius.sm, paddingVertical: 11, alignItems: 'center' },
  btnText: { color: colors.white, fontWeight: '800', fontSize: 14 },
})
