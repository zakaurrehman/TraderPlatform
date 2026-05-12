'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/lib/utils'

type Comment = { id: string; content: string; authorName: string; studentId: string; createdAt: string }

export default function CommentSection({ postId, comments: initial }: { postId: string, comments: Comment[] }) {
  const router = useRouter()
  const [comments, setComments] = useState(initial)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/community/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId, content }) })
    const data = await res.json()
    if (res.ok && data.comment) {
      setComments(prev => [...prev, data.comment])
      setContent('')
    }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>💬 {comments.length} Comment{comments.length !== 1 ? 's' : ''}</div>

      {comments.map(c => (
        <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(245,197,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5c518', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {c.authorName[0]}
          </div>
          <div style={{ flex: 1, background: '#111118', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>{c.authorName}</span>
              <span style={{ color: '#334155', fontSize: 11 }}>{c.studentId}</span>
              <span style={{ color: '#334155', fontSize: 11, marginLeft: 'auto' }}>{timeAgo(c.createdAt)}</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>{c.content}</p>
          </div>
        </div>
      ))}

      <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input className="input-field" placeholder="Add a comment..." value={content} onChange={e => setContent(e.target.value)} required style={{ flex: 1 }} />
        <button type="submit" disabled={loading} style={{ padding: '10px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
          {loading ? '...' : 'Post'}
        </button>
      </form>
    </div>
  )
}
