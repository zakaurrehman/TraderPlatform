'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function WithdrawPage() {
  const [available, setAvailable] = useState(0)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requests, setRequests] = useState<{ id: string; amount: number; status: string; createdAt: string }[]>([])

  useEffect(() => {
    fetch('/api/withdrawals').then(r => r.json()).then(d => { setAvailable(d.available || 0); setRequests(d.requests || []) })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (parseFloat(amount) > available) return
    setLoading(true)
    await fetch('/api/withdrawals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: parseFloat(amount), note }) })
    setSuccess(true)
  }

  const statusColors: Record<string, string> = { PENDING: '#f0b429', APPROVED: '#f5c518', PAID: '#00c851', REJECTED: '#ff4444' }

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/affiliate" style={{ color: '#64748b', textDecoration: 'none', fontSize: 20 }}>←</Link>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Request Withdrawal</h1>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ background: '#111118', border: '1px solid rgba(0,200,81,0.15)', borderRadius: 14, padding: 16, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ color: '#64748b', fontSize: 13 }}>Available Balance</div>
          <div style={{ color: '#00c851', fontWeight: 900, fontSize: 36, margin: '4px 0' }}>${available.toFixed(2)}</div>
        </div>

        {!success ? (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Amount (USD)</label>
              <input className="input-field" type="number" step="0.01" max={available} value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Payment details / note</label>
              <textarea className="input-field" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. USDT TRC20: TXxx... or Bank: John Doe, Acct 1234" style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={loading || parseFloat(amount) > available} className="btn-primary" style={{ padding: '12px' }}>
              {loading ? 'Submitting...' : 'Request Withdrawal'}
            </button>
          </form>
        ) : (
          <div style={{ background: 'rgba(0,200,81,0.08)', border: '1px solid rgba(0,200,81,0.2)', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <p style={{ color: '#00c851', fontWeight: 700 }}>Request submitted! Admin will process within 24–48h.</p>
          </div>
        )}

        {requests.length > 0 && (
          <div>
            <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Previous Requests</div>
            {requests.map(r => (
              <div key={r.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.06)', borderRadius: 10, padding: '10px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 700 }}>${r.amount.toFixed(2)}</div>
                  <div style={{ color: '#475569', fontSize: 11 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <span style={{ color: statusColors[r.status] || '#94a3b8', fontWeight: 700, fontSize: 12 }}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
