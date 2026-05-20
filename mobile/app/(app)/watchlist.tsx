import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { Screen, colors, font, spacing, radius } from '@/components/ui'

/**
 * Embeds TradingView widgets — the same data source the web /watchlist page
 * uses, just rendered in a WebView so the experience matches.
 */
const OVERVIEW_HTML = `
<!DOCTYPE html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;background:#111118;color:#e2e8f0;font-family:-apple-system,Segoe UI,sans-serif}</style>
</head><body>
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
  {
    "colorTheme": "dark","dateRange": "1D","showChart": true,"locale": "en","largeChartUrl": "",
    "isTransparent": true,"showSymbolLogo": true,"showFloatingTooltip": false,
    "width": "100%","height": "550",
    "tabs": [
      {"title":"Forex","symbols":[
        {"s":"FX:EURUSD","d":"EUR/USD"},{"s":"FX:GBPUSD","d":"GBP/USD"},
        {"s":"FX:USDJPY","d":"USD/JPY"},{"s":"OANDA:XAUUSD","d":"XAU/USD"},
        {"s":"FX:GBPJPY","d":"GBP/JPY"},{"s":"FX:USDCAD","d":"USD/CAD"}],"originalTitle":"Forex"},
      {"title":"Commodities","symbols":[
        {"s":"TVC:USOIL","d":"Crude Oil"},{"s":"TVC:GOLD","d":"Gold"},
        {"s":"TVC:SILVER","d":"Silver"}],"originalTitle":"Commodities"}
    ]
  }
  </script>
</div>
</body></html>`

const PAIRS = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', tv: 'FX:EURUSD' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', tv: 'FX:GBPUSD' },
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', tv: 'OANDA:XAUUSD' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', tv: 'FX:USDJPY' },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', tv: 'FX:GBPJPY' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', tv: 'FX:USDCAD' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', tv: 'FX:AUDUSD' },
  { symbol: 'USOIL', name: 'Crude Oil (WTI)', tv: 'TVC:USOIL' },
]

function miniHtml(tv: string) {
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:transparent}</style></head><body>
<div class="tradingview-widget-container">
<div class="tradingview-widget-container__widget"></div>
<script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
{"symbol":"${tv}","width":"100%","height":60,"locale":"en","dateRange":"1D","colorTheme":"dark","isTransparent":true,"autosize":false,"noTimeScale":true}
</script></div></body></html>`
}

export default function WatchlistScreen() {
  return (
    <Screen scroll>
      <View style={{ padding: spacing.lg }}>
        <View style={styles.overview}>
          <WebView
            originWhitelist={['*']}
            source={{ html: OVERVIEW_HTML }}
            style={{ height: 560, backgroundColor: 'transparent' }}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>

        <Text style={styles.section}>Tracked Pairs</Text>
        {PAIRS.map((p) => (
          <View key={p.symbol} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.symbol}>{p.symbol}</Text>
              <Text style={styles.name}>{p.name}</Text>
            </View>
            <View style={{ width: 110, height: 60 }}>
              <WebView
                originWhitelist={['*']}
                source={{ html: miniHtml(p.tv) }}
                style={{ flex: 1, backgroundColor: 'transparent' }}
                scrollEnabled={false}
                javaScriptEnabled
              />
            </View>
          </View>
        ))}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  overview: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', marginBottom: 14 },
  section: { color: colors.secondary, fontWeight: '700', fontSize: font.body, marginBottom: 8 },
  row: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  symbol: { color: colors.white, fontWeight: '700', fontSize: 14 },
  name: { color: colors.muted2, fontSize: font.tiny, marginTop: 1 },
})
