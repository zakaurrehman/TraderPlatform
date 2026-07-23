'use client'
import { useState, useEffect } from 'react'

type Session = { id: string; title: string; description: string | null; streamUrl: string | null; scheduledAt: string; isLive: boolean }

const toLocalDT = (iso: string) => { const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16) }

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [form, setForm] = useState({ title: '', description: '', streamUrl: '', scheduledAt: '' })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetch('/api/live').then(r => r.json()).then(setSessions) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    if (editingId) {
      const res = await fetch('/api/live', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) })
      const s = await res.json()
      setSessions(prev => prev.map(x => x.id === editingId ? { ...x, ...s } : x))
      setEditingId(null)
    } else {
      const res = await fetch('/api/live', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const s = await res.json()
      setSessions(prev => [s, ...prev])
    }
    setForm({ title: '', description: '', streamUrl: '', scheduledAt: '' })
    setLoading(false)
  }

  async function toggleLive(id: string, isLive: boolean) {
    await fetch('/api/live', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isLive }) })
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isLive } : s))
  }

  function startEdit(s: Session) {
    setEditingId(s.id)
    setForm({ title: s.title, description: s.description || '', streamUrl: s.streamUrl || '', scheduledAt: toLocalDT(s.scheduledAt) })
  }
  function cancelEdit() { setEditingId(null); setForm({ title: '', description: '', streamUrl: '', scheduledAt: '' }) }
  async function del(s: Session) {
    if (!confirm('Delete session "' + s.title + '" permanently? This cannot be undone.')) return
    const res = await fetch('/api/live', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id }) })
    if (res.ok) setSessions(prev => prev.filter(x => x.id !== s.id))
    else alert('Could not delete. Please try again.')
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '9px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Live Sessions</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>{editingId ? 'Edit Session' : 'Schedule Session'}</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Stream URL (YouTube/Zoom)</label><input style={inputStyle} value={form.streamUrl} onChange={e => setForm(f => ({ ...f, streamUrl: e.target.value }))} /></div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Date & Time</label><input style={inputStyle} type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} required /></div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : editingId ? 'Save Changes' : 'Schedule'}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ padding: '9px', borderRadius: 8, background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', color: '#55606f', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>}
          </form>
        </div>

        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>All Sessions</h3>
          {sessions.map(s => (
            <div key={s.id} style={{ background: '#ffffff', border: `1px solid ${s.isLive ? 'rgba(220,38,38,0.3)' : 'rgba(37,99,235,0.06)'}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h4 style={{ color: '#10131a', fontWeight: 700, fontSize: 14 }}>{s.title}</h4>
                  <div style={{ color: '#9aa3b2', fontSize: 11, marginTop: 2 }}>{new Date(s.scheduledAt).toLocaleString()}</div>
                </div>
                {s.isLive && <span style={{ background: 'rgba(220,38,38,0.15)', color: '#dc2626', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>🔴 LIVE</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleLive(s.id, !s.isLive)} style={{ padding: '6px 12px', borderRadius: 7, background: s.isLive ? 'rgba(220,38,38,0.1)' : 'rgba(22,163,74,0.1)', border: `1px solid ${s.isLive ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)'}`, color: s.isLive ? '#dc2626' : '#16a34a', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {s.isLive ? 'End Live' : 'Go Live'}
                </button>
                <button onClick={() => startEdit(s)} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(16,19,26,0.05)', border: 'none', color: '#55606f', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Edit</button>
                <button onClick={() => del(s)} style={{ padding: '5px 10px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
          {sessions.length === 0 && <p style={{ color: '#9aa3b2' }}>No sessions yet.</p>}
        </div>
      </div>
    </div>
  )
}
