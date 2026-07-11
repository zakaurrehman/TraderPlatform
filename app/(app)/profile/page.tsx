import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ProfileActions from './ProfileActions'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      certificates: { include: { course: { select: { title: true, level: true } } } },
      commissions: { select: { amount: true, withdrawn: true } },
      sales: { select: { id: true } }
    }
  })
  if (!user) redirect('/login')

  const totalEarned = user.commissions.reduce((s, c) => s + c.amount, 0)
  const totalSales = user.sales.length
  const certs = user.certificates

  const planColors = { FREE: '#7a8494', BASIC: '#2563eb', PREMIUM: '#f59e0b' }
  const planColor = planColors[user.plan as keyof typeof planColors] || '#7a8494'

  return (
    <div style={{ padding: '0 0 20px' }}>
      {/* Header */}
      <div style={{ padding: '28px 16px 20px', borderBottom: '1px solid rgba(37,99,235,0.08)', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28, fontWeight: 800, color: '#fff' }}>
          {user.fullName[0]}
        </div>
        <h1 style={{ color: '#10131a', fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{user.fullName}</h1>
        <div style={{ color: '#7a8494', fontSize: 13, marginBottom: 8 }}>{user.studentId} · @{user.username}</div>
        <div style={{ display: 'inline-block', background: `${planColor}22`, border: `1px solid ${planColor}44`, color: planColor, fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 20 }}>
          {user.plan} PLAN
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Sales', value: totalSales },
            { label: 'Earned', value: `$${totalEarned.toFixed(0)}` },
            { label: 'Certs', value: certs.length }
          ].map(s => (
            <div key={s.label} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ color: '#2563eb', fontWeight: 800, fontSize: 20 }}>{s.value}</div>
              <div style={{ color: '#9aa3b2', fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Account info */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ color: '#55606f', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Account Details</div>
          {[
            { label: 'Email', value: user.email },
            { label: 'Phone', value: user.phone || '—' },
            { label: 'Country', value: user.country || '—' },
            { label: 'Payment', value: user.paymentMethod || '—' },
            { label: 'Member since', value: formatDate(user.createdAt) }
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(16,19,26,0.04)' }}>
              <span style={{ color: '#7a8494', fontSize: 13 }}>{label}</span>
              <span style={{ color: '#10131a', fontSize: 13 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Certificates */}
        {certs.length > 0 && (
          <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ color: '#55606f', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🏆 Certificates</div>
            {certs.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(16,19,26,0.04)' }}>
                <span style={{ fontSize: 18 }}>🎓</span>
                <div>
                  <div style={{ color: '#10131a', fontWeight: 600, fontSize: 13 }}>{c.course.title}</div>
                  <div style={{ color: '#7a8494', fontSize: 11 }}>{c.course.level} · {formatDate(c.issuedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ color: '#55606f', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Quick Links</div>
          {[
            { href: '/affiliate', label: '🔗 Affiliate Dashboard', sub: 'Referrals & commissions' },
            { href: '/calculator', label: '📊 Risk Calculator', sub: 'Position size tool' },
            { href: '/watchlist', label: '📈 Market Watchlist', sub: 'Live prices' },
            { href: '/brokers', label: '🏦 Broker Recommendations', sub: 'Start trading' }
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(16,19,26,0.04)', textDecoration: 'none' }}>
              <div>
                <div style={{ color: '#10131a', fontSize: 13 }}>{l.label}</div>
                <div style={{ color: '#9aa3b2', fontSize: 11 }}>{l.sub}</div>
              </div>
              <span style={{ color: '#aeb6c2' }}>›</span>
            </Link>
          ))}
        </div>

        {/* Upgrade prompt if free */}
        {user.plan === 'FREE' && (
          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(240,180,41,0.06))', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 14, padding: 16, marginBottom: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⭐</div>
            <div style={{ color: '#10131a', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Upgrade Your Plan</div>
            <p style={{ color: '#7a8494', fontSize: 13, marginBottom: 12 }}>Unlock premium research, signals, and courses.</p>
            <Link href="/order" style={{ display: 'inline-block', padding: '9px 24px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>View Plans</Link>
          </div>
        )}

        <ProfileActions />
      </div>
    </div>
  )
}
