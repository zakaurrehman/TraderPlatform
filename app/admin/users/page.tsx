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

  const statusColors: Record<string, string> = { PENDING: '#f59e0b', APPROVED: '#16a34a', REJECTED: '#dc2626' }
  const planColors: Record<string, string> = {
    FREE: '#7a8494',
    BASIC: '#2563eb',
    ADVANCED: '#6d28d9',
    MASTERY: '#16a34a',
    PREMIUM: '#2563eb',
    MENTORSHIP: '#ea580c',
  }
  const planLabels: Record<string, string> = {
    FREE: 'Free',
    BASIC: 'Basic Training ($30)',
    ADVANCED: 'Advanced Trading ($103)',
    MASTERY: 'Mastery Bundle ($124)',
    PREMIUM: 'Premium Signals ($51/mo)',
    MENTORSHIP: 'Personal Mentorship ($207)',
  }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Users</h1>
      <p style={{ color: '#7a8494', marginBottom: 20 }}>{users.length} total users</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['ALL', 'PENDING', 'APPROVED', 'AFFILIATE'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: filter === f ? 'rgba(37,99,235,0.15)' : 'rgba(16,19,26,0.05)', color: filter === f ? '#2563eb' : '#7a8494', cursor: 'pointer', fontWeight: filter === f ? 700 : 400, fontSize: 13 }}>{f}</button>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', borderRadius: 12, overflow: 'hidden' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(16,19,26,0.06)' }}>
              {['Name / ID', 'Email', 'Role', 'Plan', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: '#7a8494', fontSize: 12, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(16,19,26,0.03)' }}>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13 }}>{u.fullName}</div>
                  <div style={{ color: '#9aa3b2', fontSize: 11 }}>{u.studentId}</div>
                </td>
                <td style={{ padding: '10px 14px', color: '#55606f', fontSize: 12 }}>{u.email}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: u.role === 'ADMIN' ? 'rgba(220,38,38,0.1)' : 'rgba(37,99,235,0.08)', color: u.role === 'ADMIN' ? '#dc2626' : '#2563eb', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{u.role}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <select style={{ background: '#ffffff', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 6, color: planColors[u.plan] || 'white', padding: '3px 6px', fontSize: 12, cursor: 'pointer' }}
                    value={u.plan} onChange={e => updateUser(u.id, { plan: e.target.value })}>
                    {Object.entries(planLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ color: statusColors[u.status] || '#55606f', fontSize: 12, fontWeight: 700 }}>{u.status}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {u.status === 'PENDING' && (
                      <>
                        <button onClick={() => updateUser(u.id, { status: 'APPROVED' })} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', cursor: 'pointer', fontSize: 12 }}>Approve</button>
                        <button onClick={() => updateUser(u.id, { status: 'REJECTED' })} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626', cursor: 'pointer', fontSize: 12 }}>Reject</button>
                      </>
                    )}
                    {u.status === 'APPROVED' && <span style={{ color: '#16a34a', fontSize: 12 }}>✓ Active</span>}
                    {u.status === 'REJECTED' && <button onClick={() => updateUser(u.id, { status: 'APPROVED' })} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb', cursor: 'pointer', fontSize: 12 }}>Re-approve</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 32 }}>No users found.</div>}
      </div>
    </div>
  )
}
