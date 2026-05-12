'use client'
import { useState, useEffect } from 'react'

type Broker = { id: string; name: string; description: string; rating: number; link: string; isRecommended: boolean; isActive: boolean; minDeposit: string | null; regulation: string | null }

export default function AdminBrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [form, setForm] = useState({ name: '', description: '', rating: '4.5', link: '', minDeposit: '', regulation: '', isRecommended: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/brokers').then(r => r.json()).then(setBrokers) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/brokers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, rating: +form.rating }) })
    const b = await res.json()
    setBrokers(prev => [b, ...prev])
    setForm({ name: '', description: '', rating: '4.5', link: '', minDeposit: '', regulation: '', isRecommended: false })
    setLoading(false)
  }

  async function toggle(id: string, field: 'isActive' | 'isRecommended', value: boolean) {
    await fetch('/api/brokers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, [field]: value }) })
    setBrokers(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b))
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Broker Recommendations</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Add Broker</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['Name', 'name', 'Exness', 'text'], ['Affiliate Link', 'link', 'https://...', 'url'], ['Min Deposit', 'minDeposit', '$10', 'text'], ['Regulation', 'regulation', 'FCA, CySEC', 'text'], ['Rating (1-5)', 'rating', '4.5', 'number']].map(([label, field, ph, type]) => (
              <div key={field}>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>{label}</label>
                <input style={inputStyle} type={type} step="0.1" min="1" max="5" placeholder={ph} value={form[field as keyof typeof form] as string} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== 'minDeposit' && field !== 'regulation'} />
              </div>
            ))}
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Description</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.isRecommended} onChange={e => setForm(f => ({ ...f, isRecommended: e.target.checked }))} />
              <label style={{ color: '#94a3b8', fontSize: 13 }}>⭐ Shafy&apos;s Pick</label>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : 'Add Broker'}</button>
          </form>
        </div>

        <div>
          {brokers.map(b => (
            <div key={b.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 12, padding: 14, marginBottom: 10, opacity: b.isActive ? 1 : 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{b.name}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggle(b.id, 'isRecommended', !b.isRecommended)} style={{ padding: '4px 8px', borderRadius: 6, background: b.isRecommended ? 'rgba(240,180,41,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', color: b.isRecommended ? '#f0b429' : '#64748b', cursor: 'pointer', fontSize: 11 }}>⭐ Pick</button>
                  <button onClick={() => toggle(b.id, 'isActive', !b.isActive)} style={{ padding: '4px 8px', borderRadius: 6, background: b.isActive ? 'rgba(0,200,81,0.1)' : 'rgba(255,68,68,0.08)', border: 'none', color: b.isActive ? '#00c851' : '#ff6666', cursor: 'pointer', fontSize: 11 }}>{b.isActive ? 'Active' : 'Hidden'}</button>
                </div>
              </div>
              <div style={{ color: '#64748b', fontSize: 12 }}>{b.description}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: '#475569' }}>
                {b.minDeposit && <span>Min: {b.minDeposit}</span>}
                {b.regulation && <span>✓ {b.regulation}</span>}
                <span>★ {b.rating}</span>
              </div>
            </div>
          ))}
          {brokers.length === 0 && <p style={{ color: '#475569' }}>No brokers yet.</p>}
        </div>
      </div>
    </div>
  )
}
