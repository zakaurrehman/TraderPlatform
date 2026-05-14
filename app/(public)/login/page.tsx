'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { ...form, redirect: false })
    if (res?.error) {
      setError('Invalid credentials or account pending approval.')
      setLoading(false)
      return
    }
    const session = await fetch('/api/auth/session').then(r => r.json())
    if (session?.user?.role === 'ADMIN') router.push('/admin')
    else router.push('/research')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/Trade with Shafy Png.png" alt="Trade with Shafy" style={{ height: 52, width: 'auto', objectFit: 'contain', marginBottom: 4, display: 'block', margin: '0 auto 4px' }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Sign in to your account</p>
        </div>

        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Username</label>
              <input className="input-field" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="Enter username" required />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 6 }}>Password</label>
              <input className="input-field" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Enter password" required />
            </div>
            {error && <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ff6666', fontSize: 13 }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 4, width: '100%', padding: '12px', fontSize: 15 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: 13, marginTop: 20 }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: 600 }}>Register as Affiliate</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ color: '#475569', fontSize: 13, textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
