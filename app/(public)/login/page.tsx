'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/brand/icons'

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
    <div className="min-h-screen bg-canvas flex items-center justify-center p-5 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40 mask-fade-b" />
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl -z-10"
           style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 65%)' }} />

      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex"><Logo size={40} href={null} /></Link>
          <p className="text-dim text-sm mt-4">Sign in to your account</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="field-label">Username</label>
              <input className="field" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="Enter username" required autoComplete="username" />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input className="field" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Enter password" required autoComplete="current-password" />
            </div>
            {error && (
              <div className="flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-danger text-[13px]" style={{ background: 'var(--danger-tint)', border: '1px solid rgba(248,113,113,0.28)' }}>
                <Icon name="shield" size={16} className="shrink-0 mt-0.5" /> {error}
              </div>
            )}
            <Button type="submit" loading={loading} block size="lg" className="mt-1">
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-dim text-[13px] mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="link-primary">Register as Affiliate</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-dim hover:text-muted text-[13px] inline-flex items-center gap-1 transition-colors">
            <Icon name="arrowRight" size={14} className="rotate-180" /> Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
