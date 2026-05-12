'use client'
import { useState, useEffect } from 'react'

type Event = { id: string; name: string; currency: string; impact: string; eventTime: string; actual: string | null; forecast: string | null; previous: string | null }

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState({ name: '', currency: 'USD', impact: 'HIGH', eventTime: '', forecast: '', previous: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/calendar').then(r => r.json()).then(setEvents) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const ev = await res.json()
    setEvents(prev => [ev, ...prev])
    setForm({ name: '', currency: 'USD', impact: 'HIGH', eventTime: '', forecast: '', previous: '' })
    setLoading(false)
  }

  async function updateActual(id: string, actual: string) {
    await fetch('/api/calendar', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, actual }) })
    setEvents(prev => prev.map(e => e.id === id ? { ...e, actual } : e))
  }

  const IMPACT_COLORS: Record<string, string> = { HIGH: '#ff4444', MEDIUM: '#f0b429', LOW: '#00c851' }
  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Economic Calendar</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Add Event</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Event Name</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Non-Farm Payrolls" required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Currency</label>
                <select style={{ ...inputStyle, background: '#0f0f15' }} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                  {['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Impact</label>
                <select style={{ ...inputStyle, background: '#0f0f15' }} value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))}>
                  <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
                </select>
              </div>
            </div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Date & Time</label><input style={inputStyle} type="datetime-local" value={form.eventTime} onChange={e => setForm(f => ({ ...f, eventTime: e.target.value }))} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Forecast</label><input style={inputStyle} value={form.forecast} onChange={e => setForm(f => ({ ...f, forecast: e.target.value }))} placeholder="200K" /></div>
              <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 4 }}>Previous</label><input style={inputStyle} value={form.previous} onChange={e => setForm(f => ({ ...f, previous: e.target.value }))} placeholder="175K" /></div>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : 'Add Event'}</button>
          </form>
        </div>

        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Events</h3>
          {events.map(ev => (
            <div key={ev.id} style={{ background: '#111118', border: `1px solid rgba(245,197,24,0.06)`, borderLeft: `3px solid ${IMPACT_COLORS[ev.impact]}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                  <span style={{ background: `${IMPACT_COLORS[ev.impact]}22`, color: IMPACT_COLORS[ev.impact], fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, marginRight: 6 }}>{ev.impact}</span>
                  <span style={{ color: '#f5c518', fontSize: 11, fontWeight: 700 }}>{ev.currency}</span>
                </div>
                <span style={{ color: '#475569', fontSize: 11 }}>{new Date(ev.eventTime).toLocaleString()}</span>
              </div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{ev.name}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                {ev.forecast && <span style={{ color: '#94a3b8' }}>Fcst: {ev.forecast}</span>}
                {ev.previous && <span style={{ color: '#94a3b8' }}>Prev: {ev.previous}</span>}
                {ev.actual ? (
                  <span style={{ color: '#00c851', fontWeight: 700 }}>Actual: {ev.actual}</span>
                ) : (
                  <button onClick={() => { const a = prompt('Enter actual result:'); if (a) updateActual(ev.id, a) }} style={{ background: 'none', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 4, color: '#f5c518', fontSize: 11, cursor: 'pointer', padding: '1px 6px' }}>+ Add actual</button>
                )}
              </div>
            </div>
          ))}
          {events.length === 0 && <p style={{ color: '#475569' }}>No events yet.</p>}
        </div>
      </div>
    </div>
  )
}
