'use client'
import { useState, useEffect } from 'react'

type Post = { id: string; title: string; category: string; isPremium: boolean; published: boolean; createdAt: string; author: { fullName: string } }

export default function AdminResearchPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [form, setForm] = useState({ title: '', category: 'Forex', content: '', imageUrl: '', isPremium: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/research?admin=1').then(r => r.json()).then(setPosts) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const post = await res.json()
    setPosts(prev => [post, ...prev])
    setForm({ title: '', category: 'Forex', content: '', imageUrl: '', isPremium: false })
    setLoading(false)
  }

  async function toggle(id: string, field: 'published' | 'isPremium', value: boolean) {
    await fetch('/api/research', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, [field]: value }) })
    setPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Research Posts</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>New Research Post</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Category</label>
              <select style={{ ...inputStyle, background: '#0f0f15' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Forex', 'Gold', 'Crypto', 'Stocks', 'Indices', 'Crude Oil'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Content / Analysis</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={6} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required /></div>
            <div><label style={{ color: '#94a3b8', fontSize: 12, display: 'block', marginBottom: 3 }}>Image URL (optional)</label><input style={inputStyle} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.isPremium} onChange={e => setForm(f => ({ ...f, isPremium: e.target.checked }))} />
              <label style={{ color: '#94a3b8', fontSize: 13 }}>Premium only</label>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : 'Publish Post'}</button>
          </form>
        </div>

        <div>
          {posts.map(p => (
            <div key={p.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.06)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <span style={{ background: 'rgba(245,197,24,0.1)', color: '#f5c518', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>{p.category}</span>
                    {p.isPremium && <span style={{ background: 'rgba(240,180,41,0.1)', color: '#f0b429', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>Premium</span>}
                    {!p.published && <span style={{ background: 'rgba(255,68,68,0.1)', color: '#ff6666', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>Hidden</span>}
                  </div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{p.title}</div>
                  <div style={{ color: '#475569', fontSize: 11 }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => toggle(p.id, 'published', !p.published)} style={{ padding: '5px 10px', borderRadius: 6, background: p.published ? 'rgba(0,200,81,0.1)' : 'rgba(255,68,68,0.08)', border: 'none', color: p.published ? '#00c851' : '#ff6666', cursor: 'pointer', fontSize: 11 }}>{p.published ? 'Published' : 'Hidden'}</button>
                <button onClick={() => toggle(p.id, 'isPremium', !p.isPremium)} style={{ padding: '5px 10px', borderRadius: 6, background: p.isPremium ? 'rgba(240,180,41,0.1)' : 'rgba(255,255,255,0.05)', border: 'none', color: p.isPremium ? '#f0b429' : '#64748b', cursor: 'pointer', fontSize: 11 }}>{p.isPremium ? '⭐ Premium' : 'Free'}</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p style={{ color: '#475569' }}>No posts yet.</p>}
        </div>
      </div>
    </div>
  )
}
