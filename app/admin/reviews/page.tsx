'use client'
import { useState, useEffect } from 'react'

type Review = { id: string; clientName: string; email: string | null; rating: number; content: string; status: string; createdAt: string }

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => { fetch('/api/reviews?all=1').then(r => r.json()).then(setReviews) }, [])

  async function update(id: string, status: string) {
    await fetch('/api/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const statusColors: Record<string, string> = { PENDING: '#f0b429', APPROVED: '#00c851', REJECTED: '#ff4444' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Reviews</h1>
      <p style={{ color: '#64748b', marginBottom: 20 }}>{reviews.filter(r => r.status === 'PENDING').length} pending approval</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {reviews.map(r => (
          <div key={r.id} style={{ background: '#111118', border: `1px solid ${r.status === 'PENDING' ? 'rgba(240,180,41,0.2)' : 'rgba(245,197,24,0.06)'}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= r.rating ? '#f0b429' : '#334155', fontSize: 16 }}>★</span>)}
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>&quot;{r.content}&quot;</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{r.clientName}</div>
                {r.email && <div style={{ color: '#475569', fontSize: 11 }}>{r.email}</div>}
              </div>
              <span style={{ color: statusColors[r.status], fontWeight: 700, fontSize: 12 }}>{r.status}</span>
            </div>
            {r.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => update(r.id, 'APPROVED')} style={{ flex: 1, padding: '7px', borderRadius: 7, background: 'rgba(0,200,81,0.1)', border: '1px solid rgba(0,200,81,0.2)', color: '#00c851', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>✓ Approve</button>
                <button onClick={() => update(r.id, 'REJECTED')} style={{ flex: 1, padding: '7px', borderRadius: 7, background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', color: '#ff6666', cursor: 'pointer', fontSize: 12 }}>✗ Reject</button>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>No reviews yet.</div>}
      </div>
    </div>
  )
}
