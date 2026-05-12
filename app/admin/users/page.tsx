'use client'
import { useState, useEffect } from 'react'

type User = { id: string; fullName: string; email: string; username: string; role: string; plan: string; status: string; studentId: string; createdAt: string }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'AFFILIATE'>('ALL')

  useEffect(() => { fetch('/api/admin/users').then(r => r.json()).then(setUsers) }, [])

  async function updateUser(id: string, updates: Partial<User>) {
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) })
    const updated = await res.json()
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u))
  }

  const filtered = users.filter(u => {
    if (filter === 'ALL') return true
    if (filter === 'PENDING') return u.status === 'PENDING'
    if (filter === 'APPROVED') return u.status === 'APPROVED'
    if (filter === 'AFFILIATE') return u.role === 'AFFILIATE'
    return true
  })

  const statusColors: Record<string, string> = { PENDING: '#f0b429', APPROVED: '#00c851', REJECTED: '#ff4444' }
  const planColors: Record<string, string> = { FREE: '#64748b', BASIC: '#f5c518', PREMIUM: '#f0b429' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Users</h1>
      <p style={{ color: '#64748b', marginBottom: 20 }}>{users.length} total users</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['ALL', 'PENDING', 'APPROVED', 'AFFILIATE'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: filter === f ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.05)', color: filter === f ? '#f5c518' : '#64748b', cursor: 'pointer', fontWeight: filter === f ? 700 : 400, fontSize: 13 }}>{f}</button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111118', borderRadius: 12, overflow: 'hidden' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Name / ID', 'Email', 'Role', 'Plan', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontSize: 12, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{u.fullName}</div>
                  <div style={{ color: '#475569', fontSize: 11 }}>{u.studentId}</div>
                </td>
                <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: 12 }}>{u.email}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: u.role === 'ADMIN' ? 'rgba(255,68,68,0.1)' : 'rgba(245,197,24,0.08)', color: u.role === 'ADMIN' ? '#ff6666' : '#f5c518', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{u.role}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <select style={{ background: '#0f0f15', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: planColors[u.plan] || 'white', padding: '3px 6px', fontSize: 12, cursor: 'pointer' }}
                    value={u.plan} onChange={e => updateUser(u.id, { plan: e.target.value })}>
                    <option value="FREE">FREE</option>
                    <option value="BASIC">BASIC</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ color: statusColors[u.status] || '#94a3b8', fontSize: 12, fontWeight: 700 }}>{u.status}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {u.status === 'PENDING' && (
                      <>
                        <button onClick={() => updateUser(u.id, { status: 'APPROVED' })} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(0,200,81,0.1)', border: '1px solid rgba(0,200,81,0.2)', color: '#00c851', cursor: 'pointer', fontSize: 12 }}>Approve</button>
                        <button onClick={() => updateUser(u.id, { status: 'REJECTED' })} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', color: '#ff6666', cursor: 'pointer', fontSize: 12 }}>Reject</button>
                      </>
                    )}
                    {u.status === 'APPROVED' && <span style={{ color: '#00c851', fontSize: 12 }}>✓ Active</span>}
                    {u.status === 'REJECTED' && <button onClick={() => updateUser(u.id, { status: 'APPROVED' })} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', color: '#f5c518', cursor: 'pointer', fontSize: 12 }}>Re-approve</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 32 }}>No users found.</div>}
      </div>
    </div>
  )
}
