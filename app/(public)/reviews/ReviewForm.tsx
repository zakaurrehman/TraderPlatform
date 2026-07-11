'use client'
import { useState } from 'react'
import { StarPicker } from '@/components/StarRating'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/brand/icons'

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
    <div className="card p-8 text-center max-w-[560px] mx-auto" style={{ background: 'var(--success-tint)', borderColor: 'rgba(52,211,153,0.24)' }}>
      <Icon name="checkCircle" size={40} className="text-success mx-auto" />
      <p className="text-success font-semibold mt-3">Review submitted! Pending approval.</p>
    </div>
  )

  return (
    <div className="card p-7 max-w-[560px] mx-auto">
      <h2 className="font-bold text-xl mb-5">Leave a Review</h2>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="field-label">Your Name</label>
            <input className="field" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} required placeholder="John Doe" />
          </div>
          <div>
            <label className="field-label">Email <span className="text-dim font-normal">(optional)</span></label>
            <input className="field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label className="field-label">Rating</label>
          <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
        </div>
        <div>
          <label className="field-label">Your Review</label>
          <textarea className="field" rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required placeholder="Share your experience…" />
        </div>
        <Button type="submit" loading={loading} className="self-start">{loading ? 'Submitting…' : 'Submit Review'}</Button>
      </form>
    </div>
  )
}
