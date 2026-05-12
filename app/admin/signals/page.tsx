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

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }
  const STATUS_COLORS: Record<string, string> = { ACTIVE: '#00c851', HIT_TP: '#f5c518', HIT_SL: '#ff4444', CLOSED: '#64748b' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>Manage Signals</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{signals.filter(s => s.status === 'ACTIVE').length} active signals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ New Signal'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Post New Signal</h3>
          <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Pair</label>
              <select style={{ ...inputStyle, background: '#111118' }} value={form.pair} onChange={e => setForm(f => ({ ...f, pair: e.target.value }))}>
                {PAIRS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Direction</label>
              <select style={{ ...inputStyle, background: '#111118' }} value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}>
                <option>BUY</option><option>SELL</option>
              </select>
            </div>
            {[['Entry', 'entry'], ['TP1', 'tp1'], ['TP2', 'tp2'], ['TP3', 'tp3'], ['Stop Loss', 'sl']].map(([label, field]) => (
              <div key={field}>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>{label}</label>
                <input style={inputStyle} type="number" step="any" placeholder="0.00000" value={form[field as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== 'tp2' && field !== 'tp3'} />
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Analysis Notes</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Add trade rationale..." />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#00c851,#009940)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Posting...' : '⚡ Post Signal'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {signals.map(s => (
          <div key={s.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{s.pair}</span>
                <span style={{ background: s.direction === 'BUY' ? 'rgba(0,200,81,0.15)' : 'rgba(255,68,68,0.15)', color: s.direction === 'BUY' ? '#00c851' : '#ff4444', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s.direction}</span>
                <span style={{ color: STATUS_COLORS[s.status] || '#64748b', fontSize: 12, fontWeight: 700 }}>{s.status}</span>
              </div>
              <span style={{ color: '#475569', fontSize: 11 }}>{new Date(s.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10, fontSize: 12 }}>
              {[['Entry', s.entry], ['TP1', s.tp1], ['SL', s.sl], ['Pips', s.pips ?? '—']].map(([l, v]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '5px 8px' }}>
                  <div style={{ color: '#475569', fontSize: 10 }}>{l}</div>
                  <div style={{ color: 'white', fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
            {s.status === 'ACTIVE' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { const p = prompt('Pips gained?'); updateStatus(s.id, 'HIT_TP', p ? +p : undefined) }} style={{ flex: 1, padding: '6px', borderRadius: 6, background: 'rgba(0,200,81,0.1)', border: '1px solid rgba(0,200,81,0.2)', color: '#00c851', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✅ TP Hit</button>
                <button onClick={() => { const p = prompt('Pips lost?'); updateStatus(s.id, 'HIT_SL', p ? +p : undefined) }} style={{ flex: 1, padding: '6px', borderRadius: 6, background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff6666', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>❌ SL Hit</button>
                <button onClick={() => updateStatus(s.id, 'CLOSED')} style={{ flex: 1, padding: '6px', borderRadius: 6, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.1)', color: '#64748b', cursor: 'pointer', fontSize: 12 }}>Close</button>
              </div>
            )}
          </div>
        ))}
        {signals.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>No signals yet.</div>}
      </div>
    </div>
  )
}
