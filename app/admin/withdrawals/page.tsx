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

  const statusColors: Record<string, string> = { PENDING: '#f59e0b', APPROVED: '#2563eb', PAID: '#16a34a', REJECTED: '#dc2626' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Withdrawal Requests</h1>
      <p style={{ color: '#7a8494', marginBottom: 20 }}>{requests.filter(r => r.status === 'PENDING').length} pending</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {requests.map(r => (
          <div key={r.id} style={{ background: '#ffffff', border: `1px solid ${r.status === 'PENDING' ? 'rgba(240,180,41,0.2)' : 'rgba(37,99,235,0.06)'}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ color: '#10131a', fontWeight: 700, fontSize: 15 }}>{r.affiliate.fullName}</div>
                <div style={{ color: '#7a8494', fontSize: 12 }}>{r.affiliate.email}</div>
                <div style={{ color: '#9aa3b2', fontSize: 11, marginTop: 2 }}>Payment: {r.affiliate.paymentMethod || 'Not specified'}</div>
                {r.note && <div style={{ color: '#55606f', fontSize: 12, marginTop: 4, background: 'rgba(16,19,26,0.04)', padding: '6px 10px', borderRadius: 6 }}>{r.note}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#2563eb', fontWeight: 900, fontSize: 22 }}>${r.amount.toFixed(2)}</div>
                <span style={{ color: statusColors[r.status] || '#55606f', fontWeight: 700, fontSize: 12 }}>{r.status}</span>
                <div style={{ color: '#aeb6c2', fontSize: 11, marginTop: 2 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            {r.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => update(r.id, 'APPROVED')} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563eb', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Approve</button>
                <button onClick={() => update(r.id, 'PAID')} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Mark Paid</button>
                <button onClick={() => update(r.id, 'REJECTED')} style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>Reject</button>
              </div>
            )}
          </div>
        ))}
        {requests.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 40 }}>No withdrawal requests.</div>}
      </div>
    </div>
  )
}
