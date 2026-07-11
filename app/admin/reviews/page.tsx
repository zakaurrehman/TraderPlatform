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

  const statusColors: Record<string, string> = { PENDING: '#f59e0b', APPROVED: '#16a34a', REJECTED: '#dc2626' }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Reviews</h1>
      <p style={{ color: '#7a8494', marginBottom: 20 }}>{reviews.filter(r => r.status === 'PENDING').length} pending approval</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
        {reviews.map(r => (
          <div key={r.id} style={{ background: '#ffffff', border: `1px solid ${r.status === 'PENDING' ? 'rgba(240,180,41,0.2)' : 'rgba(37,99,235,0.06)'}`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= r.rating ? '#f59e0b' : '#aeb6c2', fontSize: 16 }}>★</span>)}
            </div>
            <p style={{ color: '#55606f', fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>&quot;{r.content}&quot;</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13 }}>{r.clientName}</div>
                {r.email && <div style={{ color: '#9aa3b2', fontSize: 11 }}>{r.email}</div>}
              </div>
              <span style={{ color: statusColors[r.status], fontWeight: 700, fontSize: 12 }}>{r.status}</span>
            </div>
            {r.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => update(r.id, 'APPROVED')} style={{ flex: 1, padding: '7px', borderRadius: 7, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', color: '#16a34a', cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>✓ Approve</button>
                <button onClick={() => update(r.id, 'REJECTED')} style={{ flex: 1, padding: '7px', borderRadius: 7, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626', cursor: 'pointer', fontSize: 12 }}>✗ Reject</button>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 40 }}>No reviews yet.</div>}
      </div>
    </div>
  )
}
