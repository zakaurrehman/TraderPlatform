'use client'
import { useState } from 'react'
import { StarPicker } from '@/components/StarRating'

export default function ReviewForm() {
  const [form, setForm] = useState({ clientName: '', email: '', rating: 5, content: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSuccess(true)
  }

  if (success) return (
    <div style={{ background: 'rgba(0,200,81,0.08)', border: '1px solid rgba(0,200,81,0.2)', borderRadius: 14, padding: 28, textAlign: 'center' }}>
      <div style={{ fontSize: 36 }}>✅</div>
      <p style={{ color: '#00c851', fontWeight: 700, marginTop: 8 }}>Review submitted! Pending approval.</p>
    </div>
  )

  return (
    <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, padding: 28 }}>
      <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Leave a Review</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 5 }}>Your Name</label>
            <input className="input-field" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} required placeholder="John Doe" />
          </div>
          <div>
            <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 5 }}>Email (optional)</label>
            <input className="input-field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 8 }}>Rating</label>
          <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 5 }}>Your Review</label>
          <textarea className="input-field" rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required placeholder="Share your experience..." style={{ resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
