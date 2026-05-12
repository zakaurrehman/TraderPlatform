'use client'
import { useState, useEffect } from 'react'

type Session = { id: string; title: string; description: string | null; streamUrl: string | null; scheduledAt: string; isLive: boolean }

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [form, setForm] = useState({ title: '', description: '', streamUrl: '', scheduledAt: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/live').then(r => r.json()).then(setSessions) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/live', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const s = await res.json()
    setSessions(prev => [s, ...prev])
    setForm({ title: '', description: '', streamUrl: '', scheduledAt: '' })
    setLoading(false)
  }

  async function toggleLive(id: string, isLive: boolean) {
    await fetch('/api/live', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isLive }) })
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isLive } : s))
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '9px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Live Sessions</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Schedule Session</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Stream URL (YouTube/Zoom)</label><input style={inputStyle} value={form.streamUrl} onChange={e => setForm(f => ({ ...f, streamUrl: e.target.value }))} /></div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Date & Time</label><input style={inputStyle} type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} required /></div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : 'Schedule'}</button>
          </form>
        </div>

        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>All Sessions</h3>
          {sessions.map(s => (
            <div key={s.id} style={{ background: '#111118', border: `1px solid ${s.isLive ? 'rgba(255,68,68,0.3)' : 'rgba(245,197,24,0.06)'}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h4 style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{s.title}</h4>
                  <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{new Date(s.scheduledAt).toLocaleString()}</div>
                </div>
                {s.isLive && <span style={{ background: 'rgba(255,68,68,0.15)', color: '#ff6666', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>🔴 LIVE</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleLive(s.id, !s.isLive)} style={{ padding: '6px 12px', borderRadius: 7, background: s.isLive ? 'rgba(255,68,68,0.1)' : 'rgba(0,200,81,0.1)', border: `1px solid ${s.isLive ? 'rgba(255,68,68,0.2)' : 'rgba(0,200,81,0.2)'}`, color: s.isLive ? '#ff6666' : '#00c851', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  {s.isLive ? '⏹ End Live' : '▶ Go Live'}
                </button>
              </div>
            </div>
          ))}
          {sessions.length === 0 && <p style={{ color: '#475569' }}>No sessions yet.</p>}
        </div>
      </div>
    </div>
  )
}
