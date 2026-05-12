'use client'
import { useState, useEffect } from 'react'

type Affiliate = { id: string; fullName: string; email: string; username: string; referralCode: string | null; status: string; sales: number; earned: number; createdAt: string }

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])

  useEffect(() => { fetch('/api/admin/affiliates').then(r => r.json()).then(setAffiliates) }, [])

  async function approve(id: string) {
    await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'APPROVED', role: 'AFFILIATE' }) })
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
  }

  const statusColors: Record<string, string> = { PENDING: '#f0b429', APPROVED: '#00c851', REJECTED: '#ff4444' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Affiliates</h1>
      <p style={{ color: '#64748b', marginBottom: 20 }}>{affiliates.filter(a => a.status === 'PENDING').length} pending approval</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111118', borderRadius: 12, overflow: 'hidden' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Name', 'Email', 'Ref Code', 'Sales', 'Earned', 'Status', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {affiliates.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{a.fullName}</div>
                  <div style={{ color: '#475569', fontSize: 11 }}>@{a.username}</div>
                </td>
                <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: 12 }}>{a.email}</td>
                <td style={{ padding: '10px 14px', color: '#f5c518', fontSize: 12, fontFamily: 'monospace' }}>{a.referralCode || '—'}</td>
                <td style={{ padding: '10px 14px', color: 'white', fontSize: 13 }}>{a.sales}</td>
                <td style={{ padding: '10px 14px', color: '#00c851', fontWeight: 700, fontSize: 13 }}>${a.earned.toFixed(2)}</td>
                <td style={{ padding: '10px 14px' }}><span style={{ color: statusColors[a.status], fontWeight: 700, fontSize: 12 }}>{a.status}</span></td>
                <td style={{ padding: '10px 14px' }}>
                  {a.status === 'PENDING' && (
                    <button onClick={() => approve(a.id)} style={{ padding: '5px 12px', borderRadius: 7, background: 'rgba(0,200,81,0.1)', border: '1px solid rgba(0,200,81,0.2)', color: '#00c851', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {affiliates.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 32 }}>No affiliates yet.</div>}
      </div>
    </div>
  )
}
