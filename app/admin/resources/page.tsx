'use client'
import { useState, useEffect } from 'react'

type Resource = { id: string; title: string; description: string; fileUrl: string; category: string; tier: string; downloads: number }

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '', category: 'Forex Basics', tier: 'FREE' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/resources').then(r => r.json()).then(setResources) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const r = await res.json()
    setResources(prev => [r, ...prev])
    setForm({ title: '', description: '', fileUrl: '', category: 'Forex Basics', tier: 'FREE' })
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }
  const TIER_COLORS: Record<string, string> = { FREE: '#00c851', BASIC: '#f5c518', PREMIUM: '#f0b429' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Resource Library</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Add Resource</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required /></div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>File URL (Google Drive / Dropbox)</label><input style={inputStyle} value={form.fileUrl} onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Category</label>
                <select style={{ ...inputStyle, background: '#0f0f15' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['Forex Basics', 'ICT Concepts', 'Risk Management', 'COT Research', 'Chart Patterns', 'Psychology'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Tier</label>
                <select style={{ ...inputStyle, background: '#0f0f15' }} value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}>
                  <option>FREE</option><option>BASIC</option><option>PREMIUM</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : 'Add Resource'}</button>
          </form>
        </div>

        <div>
          {resources.map(r => (
            <div key={r.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.06)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                <span style={{ background: `${TIER_COLORS[r.tier]}22`, color: TIER_COLORS[r.tier], fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{r.tier}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>{r.description}</div>
              <div style={{ color: '#475569', fontSize: 11 }}>{r.category} · {r.downloads} downloads</div>
            </div>
          ))}
          {resources.length === 0 && <p style={{ color: '#475569' }}>No resources yet.</p>}
        </div>
      </div>
    </div>
  )
}
