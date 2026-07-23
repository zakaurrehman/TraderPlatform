'use client'
import { useState, useEffect } from 'react'

type Resource = { id: string; title: string; description: string; fileUrl: string; category: string; tier: string; downloads: number }

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '', category: 'Forex Basics', tier: 'FREE' })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetch('/api/resources').then(r => r.json()).then(setResources) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    if (editingId) {
      const res = await fetch('/api/resources', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) })
      const r = await res.json()
      setResources(prev => prev.map(x => x.id === editingId ? { ...x, ...r } : x))
      setEditingId(null)
    } else {
      const res = await fetch('/api/resources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const r = await res.json()
      setResources(prev => [r, ...prev])
    }
    setForm({ title: '', description: '', fileUrl: '', category: 'Forex Basics', tier: 'FREE' })
    setLoading(false)
  }

  function startEdit(r: Resource) {
    setEditingId(r.id)
    setForm({ title: r.title, description: r.description, fileUrl: r.fileUrl, category: r.category, tier: r.tier })
  }
  function cancelEdit() { setEditingId(null); setForm({ title: '', description: '', fileUrl: '', category: 'Forex Basics', tier: 'FREE' }) }
  async function del(r: Resource) {
    if (!confirm('Delete resource "' + r.title + '" permanently? This cannot be undone.')) return
    const res = await fetch('/api/resources', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id }) })
    if (res.ok) setResources(prev => prev.filter(x => x.id !== r.id))
    else alert('Could not delete. Please try again.')
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }
  const TIER_COLORS: Record<string, string> = { FREE: '#16a34a', BASIC: '#2563eb', PREMIUM: '#f59e0b' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Resource Library</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>{editingId ? 'Edit Resource' : 'Add Resource'}</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required /></div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>File URL (Google Drive / Dropbox)</label><input style={inputStyle} value={form.fileUrl} onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Category</label>
                <select style={{ ...inputStyle, background: '#ffffff' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['Forex Basics', 'ICT Concepts', 'Risk Management', 'COT Research', 'Chart Patterns', 'Psychology'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Tier</label>
                <select style={{ ...inputStyle, background: '#ffffff' }} value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}>
                  <option>FREE</option><option>BASIC</option><option>PREMIUM</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : editingId ? 'Save Changes' : 'Add Resource'}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ padding: '9px', borderRadius: 8, background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', color: '#55606f', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>}
          </form>
        </div>

        <div>
          {resources.map(r => (
            <div key={r.id} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.06)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                <span style={{ background: `${TIER_COLORS[r.tier]}22`, color: TIER_COLORS[r.tier], fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{r.tier}</span>
              </div>
              <div style={{ color: '#7a8494', fontSize: 12, marginBottom: 4 }}>{r.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#9aa3b2', fontSize: 11 }}>{r.category} · {r.downloads} downloads</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(r)} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(16,19,26,0.05)', border: 'none', color: '#55606f', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => del(r)} style={{ padding: '5px 10px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {resources.length === 0 && <p style={{ color: '#9aa3b2' }}>No resources yet.</p>}
        </div>
      </div>
    </div>
  )
}
