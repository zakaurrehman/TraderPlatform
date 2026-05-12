'use client'
import { useState, useEffect } from 'react'

type Request = { id: string; amount: number; status: string; note: string | null; createdAt: string; affiliate: { fullName: string; paymentMethod: string | null; email: string } }

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => { fetch('/api/admin/withdrawals').then(r => r.json()).then(setRequests) }, [])

  async function update(id: string, status: string) {
    const res = await fetch('/api/admin/withdrawals', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    const updated = await res.json()
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r))
  }

  const statusColors: Record<string, string> = { PENDING: '#f0b429', APPROVED: '#f5c518', PAID: '#00c851', REJECTED: '#ff4444' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Withdrawal Requests</h1>
      <p style={{ color: '#64748b', marginBottom: 20 }}>{requests.filter(r => r.status === 'PENDING').length} pending</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {requests.map(r => (
          <div key={r.id} style={{ background: '#111118', border: `1px solid ${r.status === 'PENDING' ? 'rgba(240,180,41,0.2)' : 'rgba(245,197,24,0.06)'}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{r.affiliate.fullName}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{r.affiliate.email}</div>
                <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>Payment: {r.affiliate.paymentMethod || 'Not specified'}</div>
                {r.note && <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4, background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6 }}>{r.note}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 22 }}>${r.amount.toFixed(2)}</div>
                <span style={{ color: statusColors[r.status] || '#94a3b8', fontWeight: 700, fontSize: 12 }}>{r.status}</span>
                <div style={{ color: '#334155', fontSize: 11, marginTop: 2 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            {r.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => update(r.id, 'APPROVED')} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', color: '#f5c518', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Approve</button>
                <button onClick={() => update(r.id, 'PAID')} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(0,200,81,0.1)', border: '1px solid rgba(0,200,81,0.2)', color: '#00c851', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Mark Paid</button>
                <button onClick={() => update(r.id, 'REJECTED')} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', color: '#ff6666', cursor: 'pointer', fontSize: 13 }}>Reject</button>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>No withdrawal requests.</div>}
      </div>
    </div>
  )
}
