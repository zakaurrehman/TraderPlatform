'use client'
import { useState, useEffect } from 'react'

type Affiliate = { id: string; fullName: string; username: string }
type Sale = { id: string; clientName: string; clientEmail: string; amount: number; createdAt: string; affiliate: { fullName: string } }

export default function AdminSalesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [form, setForm] = useState({ affiliateId: '', clientName: '', clientEmail: '', amount: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/admin/affiliates-list').then(r => r.json()).then(setAffiliates)
    fetch('/api/admin/sales').then(r => r.json()).then(setSales)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: +form.amount }) })
    const sale = await res.json()
    setSales(prev => [sale, ...prev])
    setForm({ affiliateId: '', clientName: '', clientEmail: '', amount: '', description: '' })
    setSuccess(true)
    setLoading(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '9px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Log a Sale</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>New Sale Entry</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Affiliate</label>
              <select style={{ ...inputStyle, background: '#ffffff' }} value={form.affiliateId} onChange={e => setForm(f => ({ ...f, affiliateId: e.target.value }))} required>
                <option value="">Select affiliate...</option>
                {affiliates.map(a => <option key={a.id} value={a.id}>{a.fullName} (@{a.username})</option>)}
              </select>
            </div>
            {[['Client Name', 'clientName', 'John Doe', 'text'], ['Client Email', 'clientEmail', 'client@email.com', 'email'], ['Sale Amount (USD)', 'amount', '103.00', 'number'], ['Description', 'description', 'Advanced Strategies package', 'text']].map(([label, field, ph, type]) => (
              <div key={field}>
                <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>{label}</label>
                <input style={inputStyle} type={type} placeholder={ph} value={form[field as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== 'description'} />
              </div>
            ))}
            {success && <div style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>Sale logged! Commission created.</div>}
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? 'Logging...' : 'Log Sale'}
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Recent Sales</h3>
          {sales.slice(0, 10).map(s => (
            <div key={s.id} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.06)', borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13 }}>{s.clientName}</div>
                  <div style={{ color: '#7a8494', fontSize: 11 }}>via {s.affiliate.fullName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#2563eb', fontWeight: 800 }}>${s.amount}</div>
                  <div style={{ color: '#16a34a', fontSize: 11 }}>+${(s.amount * 0.5).toFixed(2)} comm.</div>
                </div>
              </div>
            </div>
          ))}
          {sales.length === 0 && <p style={{ color: '#9aa3b2', fontSize: 13 }}>No sales yet.</p>}
        </div>
      </div>
    </div>
  )
}
