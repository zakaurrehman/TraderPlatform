'use client'
import { useState, useEffect } from 'react'

type Signal = { id: string; pair: string; direction: string; entry: number; tp1: number; tp2: number | null; tp3: number | null; sl: number; status: string; pips: number | null; notes: string | null; createdAt: string }

const PAIRS = ['EUR/USD', 'GBP/USD', 'XAU/USD', 'USD/JPY', 'GBP/JPY', 'USD/CHF', 'USD/CAD', 'AUD/USD', 'NZD/USD', 'EUR/JPY', 'USOIL', 'US30', 'NAS100']

export default function AdminSignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ pair: 'EUR/USD', direction: 'BUY', entry: '', tp1: '', tp2: '', tp3: '', sl: '', notes: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/signals?all=1').then(r => r.json()).then(setSignals) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/signals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, entry: +form.entry, tp1: +form.tp1, tp2: form.tp2 ? +form.tp2 : null, tp3: form.tp3 ? +form.tp3 : null, sl: +form.sl }) })
    const signal = await res.json()
    setSignals(prev => [signal, ...prev])
    setForm({ pair: 'EUR/USD', direction: 'BUY', entry: '', tp1: '', tp2: '', tp3: '', sl: '', notes: '' })
    setShowForm(false)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string, pips?: number) {
    await fetch('/api/signals', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, pips }) })
    setSignals(prev => prev.map(s => s.id === id ? { ...s, status, pips: pips ?? s.pips } : s))
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }
  const STATUS_COLORS: Record<string, string> = { ACTIVE: '#16a34a', HIT_TP: '#2563eb', HIT_SL: '#dc2626', CLOSED: '#7a8494' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>Manage Signals</h1>
          <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>{signals.filter(s => s.status === 'ACTIVE').length} active signals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ New Signal'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Post New Signal</h3>
          <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Pair</label>
              <select style={{ ...inputStyle, background: '#ffffff' }} value={form.pair} onChange={e => setForm(f => ({ ...f, pair: e.target.value }))}>
                {PAIRS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Direction</label>
              <select style={{ ...inputStyle, background: '#ffffff' }} value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}>
                <option>BUY</option><option>SELL</option>
              </select>
            </div>
            {[['Entry', 'entry'], ['TP1', 'tp1'], ['TP2', 'tp2'], ['TP3', 'tp3'], ['Stop Loss', 'sl']].map(([label, field]) => (
              <div key={field}>
                <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>{label}</label>
                <input style={inputStyle} type="number" step="any" placeholder="0.00000" value={form[field as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== 'tp2' && field !== 'tp3'} />
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Analysis Notes</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Add trade rationale..." />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Posting...' : '⚡ Post Signal'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {signals.map(s => (
          <div key={s.id} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{s.pair}</span>
                <span style={{ background: s.direction === 'BUY' ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)', color: s.direction === 'BUY' ? '#16a34a' : '#dc2626', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s.direction}</span>
                <span style={{ color: STATUS_COLORS[s.status] || '#7a8494', fontSize: 12, fontWeight: 700 }}>{s.status}</span>
              </div>
              <span style={{ color: '#9aa3b2', fontSize: 11 }}>{new Date(s.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10, fontSize: 12 }}>
              {[['Entry', s.entry], ['TP1', s.tp1], ['SL', s.sl], ['Pips', s.pips ?? '—']].map(([l, v]) => (
                <div key={l} style={{ background: 'rgba(16,19,26,0.04)', borderRadius: 6, padding: '5px 8px' }}>
                  <div style={{ color: '#9aa3b2', fontSize: 10 }}>{l}</div>
                  <div style={{ color: '#10131a', fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
            {s.status === 'ACTIVE' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { const p = prompt('Pips gained?'); updateStatus(s.id, 'HIT_TP', p ? +p : undefined) }} style={{ flex: 1, padding: '6px', borderRadius: 6, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✅ TP Hit</button>
                <button onClick={() => { const p = prompt('Pips lost?'); updateStatus(s.id, 'HIT_SL', p ? +p : undefined) }} style={{ flex: 1, padding: '6px', borderRadius: 6, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>❌ SL Hit</button>
                <button onClick={() => updateStatus(s.id, 'CLOSED')} style={{ flex: 1, padding: '6px', borderRadius: 6, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.1)', color: '#7a8494', cursor: 'pointer', fontSize: 12 }}>Close</button>
              </div>
            )}
          </div>
        ))}
        {signals.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 40 }}>No signals yet.</div>}
      </div>
    </div>
  )
}
