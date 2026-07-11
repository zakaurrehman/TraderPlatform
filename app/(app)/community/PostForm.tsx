'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CommunityPostForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setForm({ title: '', content: '' })
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', color: '#7a8494', cursor: 'pointer', textAlign: 'left', marginBottom: 12, fontSize: 14 }}>
      Share your analysis or question...
    </button>
  )

  return (
    <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input className="input-field" placeholder="Title / Pair (e.g. EUR/USD Analysis)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        <textarea className="input-field" placeholder="Share your thoughts, analysis or questions..." rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required style={{ resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => setOpen(false)} style={{ flex: 1, padding: '9px', borderRadius: 8, background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.08)', color: '#7a8494', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ flex: 2, padding: '9px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
