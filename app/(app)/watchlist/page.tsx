export default function WatchlistPage() {
  const pairs = [
    { symbol: 'EURUSD', name: 'Euro / US Dollar' },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar' },
    { symbol: 'XAUUSD', name: 'Gold / US Dollar' },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen' },
    { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen' },
    { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar' },
    { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar' },
    { symbol: 'USOIL', name: 'Crude Oil (WTI)' }
  ]

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: '#10131a' }}>Market Watchlist</h1>
        <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>Live prices powered by TradingView</p>
      </div>

      {/* TradingView Market Overview Widget */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
          <TradingViewWidget />
        </div>

        {/* Mini charts for each pair */}
        <div style={{ color: '#55606f', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Tracked Pairs</div>
        {pairs.map(p => (
          <div key={p.symbol} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.06)', borderRadius: 10, padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#10131a', fontWeight: 700, fontSize: 14 }}>{p.symbol}</div>
                <div style={{ color: '#9aa3b2', fontSize: 11, marginTop: 1 }}>{p.name}</div>
              </div>
              <MiniChartWidget symbol={p.symbol} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TradingViewWidget() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js" async>
          {
            "colorTheme": "light",
            "dateRange": "1D",
            "showChart": true,
            "locale": "en",
            "largeChartUrl": "",
            "isTransparent": true,
            "showSymbolLogo": true,
            "showFloatingTooltip": false,
            "width": "100%",
            "height": "450",
            "tabs": [
              {
                "title": "Forex",
                "symbols": [
                  {"s": "FX:EURUSD", "d": "EUR/USD"},
                  {"s": "FX:GBPUSD", "d": "GBP/USD"},
                  {"s": "FX:USDJPY", "d": "USD/JPY"},
                  {"s": "OANDA:XAUUSD", "d": "XAU/USD"},
                  {"s": "FX:GBPJPY", "d": "GBP/JPY"},
                  {"s": "FX:USDCAD", "d": "USD/CAD"}
                ],
                "originalTitle": "Forex"
              },
              {
                "title": "Commodities",
                "symbols": [
                  {"s": "TVC:USOIL", "d": "Crude Oil"},
                  {"s": "TVC:GOLD", "d": "Gold"},
                  {"s": "TVC:SILVER", "d": "Silver"}
                ],
                "originalTitle": "Commodities"
              }
            ]
          }
          </script>
        </div>
      `
    }} />
  )
}

function MiniChartWidget({ symbol }: { symbol: string }) {
  const tvSymbol = symbol === 'XAUUSD' ? 'OANDA:XAUUSD' : symbol === 'USOIL' ? 'TVC:USOIL' : `FX:${symbol}`
  return (
    <div style={{ width: 80, height: 40 }} dangerouslySetInnerHTML={{
      __html: `
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
          {
            "symbol": "${tvSymbol}",
            "width": 80,
            "height": 40,
            "locale": "en",
            "dateRange": "1D",
            "colorTheme": "light",
            "isTransparent": true,
            "autosize": false,
            "largeChartUrl": "",
            "noTimeScale": true
          }
          </script>
        </div>
      `
    }} />
  )
}
