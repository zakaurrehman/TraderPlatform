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

  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 20 }}>Research Posts</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>New Research Post</h3>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Title</label><input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
            <div>
              <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Category</label>
              <select style={{ ...inputStyle, background: '#ffffff' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Forex', 'Gold', 'Crypto', 'Stocks', 'Indices', 'Crude Oil'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Content / Analysis</label><textarea style={{ ...inputStyle, resize: 'vertical' }} rows={6} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required /></div>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 3 }}>Image URL (optional)</label><input style={inputStyle} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.isPremium} onChange={e => setForm(f => ({ ...f, isPremium: e.target.checked }))} />
              <label style={{ color: '#55606f', fontSize: 13 }}>Premium only</label>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{loading ? '...' : 'Publish Post'}</button>
          </form>
        </div>

        <div>
          {posts.map(p => (
            <div key={p.id} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.06)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>{p.category}</span>
                    {p.isPremium && <span style={{ background: 'rgba(240,180,41,0.1)', color: '#f59e0b', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>Premium</span>}
                    {!p.published && <span style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>Hidden</span>}
                  </div>
                  <div style={{ color: '#10131a', fontWeight: 700, fontSize: 14 }}>{p.title}</div>
                  <div style={{ color: '#9aa3b2', fontSize: 11 }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => toggle(p.id, 'published', !p.published)} style={{ padding: '5px 10px', borderRadius: 6, background: p.published ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)', border: 'none', color: p.published ? '#16a34a' : '#dc2626', cursor: 'pointer', fontSize: 11 }}>{p.published ? 'Published' : 'Hidden'}</button>
                <button onClick={() => toggle(p.id, 'isPremium', !p.isPremium)} style={{ padding: '5px 10px', borderRadius: 6, background: p.isPremium ? 'rgba(240,180,41,0.1)' : 'rgba(16,19,26,0.05)', border: 'none', color: p.isPremium ? '#f59e0b' : '#7a8494', cursor: 'pointer', fontSize: 11 }}>{p.isPremium ? '⭐ Premium' : 'Free'}</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p style={{ color: '#9aa3b2' }}>No posts yet.</p>}
        </div>
      </div>
    </div>
  )
}
