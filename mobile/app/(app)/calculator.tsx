import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Screen, Field, Button, colors, font, spacing, radius } from '@/components/ui'
import { Select } from '@/components/Select'

// Pip multiplier per pair — ported verbatim from the web /calculator page.
const PAIRS: Record<string, number> = {
  'EUR/USD': 1, 'GBP/USD': 1, 'AUD/USD': 1, 'NZD/USD': 1,
  'USD/JPY': 100, 'USD/CHF': 1, 'USD/CAD': 1,
  'GBP/JPY': 100, 'EUR/JPY': 100, 'XAU/USD': 1,
}

const RULES: [string, string][] = [
  ['1-2% Rule', 'Never risk more than 2% of your account on a single trade'],
  ['RR Ratio', 'Always aim for at least 1:2 risk-reward ratio (risk $1 to make $2)'],
  ['Correlation', 'Avoid having multiple correlated positions open at once'],
  ['Stop Loss', 'Always use a stop loss — no exceptions. Markets move fast.'],
]

export default function CalculatorScreen() {
  const [account, setAccount] = useState('10000')
  const [risk, setRisk] = useState('1')
  const [pair, setPair] = useState('EUR/USD')
  const [sl, setSl] = useState('20')
  const [result, setResult] = useState<{ lotSize: number; riskAmount: number; pipValue: number } | null>(null)

  function calculate() {
    const acct = parseFloat(account)
    const r = parseFloat(risk) / 100
    const slPips = parseFloat(sl)
    const pipMult = PAIRS[pair] || 1
    if (!acct || !r || !slPips) return
    const riskAmount = acct * r
    const pipValue = 10 / pipMult
    const lotSize = riskAmount / (slPips * pipValue)
    setResult({
      lotSize: Math.round(lotSize * 100) / 100,
      riskAmount: Math.round(riskAmount * 100) / 100,
      pipValue: Math.round(pipValue * 100) / 100,
    })
  }

  return (
    <Screen scroll>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Field label="Account Balance (USD)" keyboardType="decimal-pad" value={account} onChangeText={setAccount} placeholder="10000" />
          <Field label="Risk Percentage (%)" keyboardType="decimal-pad" value={risk} onChangeText={setRisk} placeholder="1" />
          <Select label="Currency Pair" value={pair} options={Object.keys(PAIRS)} onChange={setPair} />
          <Field label="Stop Loss (pips)" keyboardType="decimal-pad" value={sl} onChangeText={setSl} placeholder="20" />
          <Button title="Calculate Lot Size" onPress={calculate} />
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>📊 Position Size Result</Text>
            <View style={styles.resultGrid}>
              <View style={[styles.resultBox, { backgroundColor: 'rgba(245,197,24,0.08)', borderColor: 'rgba(245,197,24,0.15)' }]}>
                <Text style={styles.resultBoxLabel}>Lot Size</Text>
                <Text style={[styles.resultValue, { color: colors.gold }]}>{result.lotSize}</Text>
                <Text style={styles.resultUnit}>lots</Text>
              </View>
              <View style={[styles.resultBox, { backgroundColor: 'rgba(255,68,68,0.06)', borderColor: 'rgba(255,68,68,0.15)' }]}>
                <Text style={styles.resultBoxLabel}>Risk Amount</Text>
                <Text style={[styles.resultValue, { color: colors.redText }]}>${result.riskAmount}</Text>
                <Text style={styles.resultUnit}>{risk}% of account</Text>
              </View>
            </View>
            <View style={styles.pipBox}>
              <Text style={styles.pipText}>
                Pip Value: <Text style={{ color: colors.white, fontWeight: '700' }}>${result.pipValue}</Text> per pip per lot
              </Text>
            </View>
            <View style={styles.rule}>
              <Text style={styles.ruleText}>
                💡 <Text style={{ color: colors.green, fontWeight: '700' }}>Rule of thumb:</Text> Never risk more than
                1-2% per trade. With {pair}, a {sl} pip SL and ${account} account, trade{' '}
                <Text style={{ color: colors.gold, fontWeight: '700' }}>{result.lotSize} lots</Text>.
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.card, { marginTop: spacing.md }]}>
          <Text style={styles.tipsTitle}>📘 Risk Management Rules</Text>
          {RULES.map(([title, desc]) => (
            <View key={title} style={styles.ruleRow}>
              <Text style={{ color: colors.gold, marginTop: 1 }}>✓</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.ruleTitle}>{title}</Text>
                <Text style={styles.ruleDesc}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: 18 },
  resultCard: { marginTop: spacing.md, backgroundColor: 'rgba(245,197,24,0.04)', borderWidth: 1, borderColor: 'rgba(245,197,24,0.15)', borderRadius: radius.xl, padding: 18 },
  resultLabel: { color: colors.secondary, fontWeight: '600', fontSize: font.body, marginBottom: 12 },
  resultGrid: { flexDirection: 'row', gap: 10 },
  resultBox: { flex: 1, borderWidth: 1, borderRadius: radius.md, padding: 12, alignItems: 'center' },
  resultBoxLabel: { color: colors.muted, fontSize: font.tiny, marginBottom: 4 },
  resultValue: { fontWeight: '900', fontSize: 26 },
  resultUnit: { color: colors.muted2, fontSize: font.tiny },
  pipBox: { backgroundColor: colors.overlay, borderRadius: radius.sm, padding: 10, marginTop: 12 },
  pipText: { color: colors.muted, fontSize: font.small },
  rule: { backgroundColor: 'rgba(0,200,81,0.06)', borderWidth: 1, borderColor: 'rgba(0,200,81,0.12)', borderRadius: radius.sm, padding: 10, marginTop: 12 },
  ruleText: { color: colors.secondary, fontSize: font.small, lineHeight: 19 },
  tipsTitle: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 10 },
  ruleRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  ruleTitle: { color: colors.white, fontWeight: '700', fontSize: font.body },
  ruleDesc: { color: colors.muted, fontSize: font.small, marginTop: 2 },
})
