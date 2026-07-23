'use client'
import { useState, useEffect } from 'react'

type Event = { id: string; name: string; currency: string; impact: string; eventTime: string; actual: string | null; forecast: string | null; previous: string | null }

const toLocalDT = (iso: string) => { const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16) }

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState({ name: '', currency: 'USD', impact: 'HIGH', eventTime: '', forecast: '', previous: '' })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetch('/api/calendar').then(r => r.json()).then(setEvents) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    if (editingId) {
      const res = await fetch('/api/calendar', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) })
      const ev = await res.json()
      setEvents(prev => prev.map(x => x.id === editingId ? { ...x, ...ev } : x))
      setEditingId(null)
    } else {
      const res = await fetch('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const ev = await res.json()
      setEvents(prev => [ev, ...prev])
    }
    setForm({ name: '', currency: 'USD', impact: 'HIGH', eventTime: '', forecast: '', previous: '' })
    setLoading(false)
  }

  async function updateActual(id: string, actual: string) {
    await fetch('/api/calendar', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, actual }) })
    setEvents(prev => prev.map(e => e.id === id ? { ...e, actual } : e))
  }

  function startEdit(ev: Event) {
    setEditingId(ev.id)
    setForm({ name: ev.name, currency: ev.currency, impact: ev.impact, eventTime: toLocalDT(ev.eventTime), forecast: ev.forecast || '', previous: ev.previous || '' })
  }
  function cancelEdit() { setEditingId(null); setForm({ name: '', currency: 'USD', impact: 'HIGH', eventTime: '', forecast: '', previous: '' }) }
  async function del(ev: Event) {
    if (!confirm('Delete event "' + ev.name + '" permanently? This cannot be undone.')) return
    const res = await fetch('/api/calendar', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ev.id }) })
    if (res.ok) setEvents(prev => prev.filter(x => x.id !== ev.id))
    else alert('Could not delete. Please try again.')
  }

  const IMPACT_COLORS: Record<string, string> = { HIGH: '#dc2626', MEDIUM: '#f59e0b', LOW: '#16a34a' }
  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Economic Calendar</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>{editingId ? 'Edit Event' : 'Add Event'}</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Event Name</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Non-Farm Payrolls" required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Currency</label>
                <select style={{ ...inputStyle, background: '#ffffff' }} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                  {['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Impact</label>
                <select style={{ ...inputStyle, background: '#ffffff' }} value={form.impact} onChange={e => setForm(f => ({ ...f, impact: e.target.value }))}>
                  <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
                </select>
              </div>
            </div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Date & Time</label><input style={inputStyle} type="datetime-local" value={form.eventTime} onChange={e => setForm(f => ({ ...f, eventTime: e.target.value }))} required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Forecast</label><input style={inputStyle} value={form.forecast} onChange={e => setForm(f => ({ ...f, forecast: e.target.value }))} placeholder="200K" /></div>
              <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Previous</label><input style={inputStyle} value={form.previous} onChange={e => setForm(f => ({ ...f, previous: e.target.value }))} placeholder="175K" /></div>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : editingId ? 'Save Changes' : 'Add Event'}</button>
            {editingId && <button type="button" onClick={cancelEdit} style={{ padding: '9px', borderRadius: 8, background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', color: '#55606f', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>}
          </form>
        </div>

        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Events</h3>
          {events.map(ev => (
            <div key={ev.id} style={{ background: '#ffffff', border: `1px solid rgba(37,99,235,0.06)`, borderLeft: `3px solid ${IMPACT_COLORS[ev.impact]}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                  <span style={{ background: `${IMPACT_COLORS[ev.impact]}22`, color: IMPACT_COLORS[ev.impact], fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, marginRight: 6 }}>{ev.impact}</span>
                  <span style={{ color: '#2563eb', fontSize: 11, fontWeight: 700 }}>{ev.currency}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: '#9aa3b2', fontSize: 11 }}>{new Date(ev.eventTime).toLocaleString()}</span>
                  <button onClick={() => startEdit(ev)} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(16,19,26,0.05)', border: 'none', color: '#55606f', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Edit</button>
                  <button onClick={() => del(ev)} style={{ padding: '5px 10px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>Delete</button>
                </div>
              </div>
              <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{ev.name}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                {ev.forecast && <span style={{ color: '#55606f' }}>Fcst: {ev.forecast}</span>}
                {ev.previous && <span style={{ color: '#55606f' }}>Prev: {ev.previous}</span>}
                {ev.actual ? (
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>Actual: {ev.actual}</span>
                ) : (
                  <button onClick={() => { const a = prompt('Enter actual result:'); if (a) updateActual(ev.id, a) }} style={{ background: 'none', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 4, color: '#2563eb', fontSize: 11, cursor: 'pointer', padding: '1px 6px' }}>+ Add actual</button>
                )}
              </div>
            </div>
          ))}
          {events.length === 0 && <p style={{ color: '#9aa3b2' }}>No events yet.</p>}
        </div>
      </div>
    </div>
  )
}
