'use client'
import { useState } from 'react'

const PAIRS: Record<string, number> = {
  'EUR/USD': 1, 'GBP/USD': 1, 'AUD/USD': 1, 'NZD/USD': 1,
  'USD/JPY': 100, 'USD/CHF': 1, 'USD/CAD': 1,
  'GBP/JPY': 100, 'EUR/JPY': 100, 'XAU/USD': 1
}

export default function CalculatorPage() {
  const [form, setForm] = useState({ account: '10000', risk: '1', pair: 'EUR/USD', sl: '20' })
  const [result, setResult] = useState<{ lotSize: number; riskAmount: number; pipValue: number } | null>(null)

  function set(f: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [f]: e.target.value })) }

  function calculate() {
    const account = parseFloat(form.account)
    const risk = parseFloat(form.risk) / 100
    const sl = parseFloat(form.sl)
    const pipMult = PAIRS[form.pair] || 1

    if (!account || !risk || !sl) return

    const riskAmount = account * risk
    const pipValue = 10 / pipMult
    const lotSize = riskAmount / (sl * pipValue)

    setResult({ lotSize: Math.round(lotSize * 100) / 100, riskAmount: Math.round(riskAmount * 100) / 100, pipValue: Math.round(pipValue * 100) / 100 })
  }

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Risk Calculator</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Calculate ideal position size before every trade</p>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Account Balance (USD)</label>
              <input className="input-field" type="number" value={form.account} onChange={set('account')} placeholder="10000" />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Risk Percentage (%)</label>
              <input className="input-field" type="number" step="0.1" value={form.risk} onChange={set('risk')} placeholder="1" />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Currency Pair</label>
              <select className="input-field" value={form.pair} onChange={set('pair')} style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>
                {Object.keys(PAIRS).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Stop Loss (pips)</label>
              <input className="input-field" type="number" value={form.sl} onChange={set('sl')} placeholder="20" />
            </div>

            <button onClick={calculate} className="btn-primary" style={{ padding: '12px', fontSize: 15 }}>Calculate Lot Size</button>
          </div>
        </div>

        {result && (
          <div style={{ background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(0,200,81,0.06))', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 16, padding: 20 }}>
            <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 14, fontWeight: 600 }}>📊 Position Size Result</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Lot Size</div>
                <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 28 }}>{result.lotSize}</div>
                <div style={{ color: '#475569', fontSize: 11 }}>lots</div>
              </div>
              <div style={{ background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Risk Amount</div>
                <div style={{ color: '#ff6666', fontWeight: 900, fontSize: 28 }}>${result.riskAmount}</div>
                <div style={{ color: '#475569', fontSize: 11 }}>{form.risk}% of account</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 14px', marginTop: 12 }}>
              <div style={{ color: '#64748b', fontSize: 12 }}>Pip Value: <span style={{ color: 'white', fontWeight: 700 }}>${result.pipValue}</span> per pip per lot</div>
            </div>
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,200,81,0.06)', border: '1px solid rgba(0,200,81,0.12)', borderRadius: 10 }}>
              <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
                💡 <strong style={{ color: '#00c851' }}>Rule of thumb:</strong> Never risk more than 1-2% per trade. With {form.pair}, a {form.sl} pip SL and ${form.account} account → trade <strong style={{ color: '#f5c518' }}>{result.lotSize} lots</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Risk management tips */}
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.06)', borderRadius: 14, padding: 16, marginTop: 14 }}>
          <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>📘 Risk Management Rules</div>
          {[
            ['1-2% Rule', 'Never risk more than 2% of your account on a single trade'],
            ['RR Ratio', 'Always aim for at least 1:2 risk-reward ratio (risk $1 to make $2)'],
            ['Correlation', 'Avoid having multiple correlated positions open at once'],
            ['Stop Loss', 'Always use a stop loss — no exceptions. Markets move fast.']
          ].map(([title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={{ color: '#f5c518', marginTop: 1 }}>✓</span>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{title}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
