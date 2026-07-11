import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import CopyButton from '@/components/CopyButton'

export default async function AffiliatePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      commissions: true,
      sales: { orderBy: { createdAt: 'desc' }, take: 5 },
      withdrawals: { orderBy: { createdAt: 'desc' }, take: 3 }
    }
  })
  if (!user) redirect('/login')

  const totalEarned = user.commissions.reduce((s, c) => s + c.amount, 0)
  const available = user.commissions.filter(c => !c.withdrawn).reduce((s, c) => s + c.amount, 0)
  const withdrawn = user.commissions.filter(c => c.withdrawn).reduce((s, c) => s + c.amount, 0)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const refLink = user.referralCode ? `${appUrl}/api/ref/${user.referralCode}` : null

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: '#10131a' }}>Affiliate Dashboard</h1>
        <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>50% commission on every sale</p>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Total Earned', value: formatCurrency(totalEarned), color: '#2563eb' },
            { label: 'Available', value: formatCurrency(available), color: '#16a34a' },
            { label: 'Withdrawn', value: formatCurrency(withdrawn), color: '#55606f' },
            { label: 'Total Sales', value: user.sales.length.toString(), color: '#10131a' }
          ].map(s => (
            <div key={s.label} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 12, padding: 14 }}>
              <div style={{ color: '#9aa3b2', fontSize: 11, marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: 22 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Referral link */}
        {refLink ? (
          <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ color: '#55606f', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>🔗 Your Referral Link</div>
            <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)', borderRadius: 8, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#7a8494', fontSize: 12, wordBreak: 'break-all' }}>{refLink}</span>
            </div>
            <CopyButton text={refLink} />
          </div>
        ) : (
          <div style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <p style={{ color: '#f59e0b', fontSize: 13 }}>⏳ Your referral link will be activated once your account is approved.</p>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <Link href="/affiliate/commissions" style={{ display: 'block', background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 12, padding: 14, textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>📊</div>
            <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13 }}>Commissions</div>
            <div style={{ color: '#9aa3b2', fontSize: 11 }}>{user.commissions.length} records</div>
          </Link>
          <Link href="/affiliate/withdraw" style={{ display: 'block', background: '#ffffff', border: '1px solid rgba(22,163,74,0.1)', borderRadius: 12, padding: 14, textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🏧</div>
            <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13 }}>Withdraw</div>
            <div style={{ color: '#16a34a', fontSize: 11 }}>{formatCurrency(available)} available</div>
          </Link>
        </div>

        {/* Recent sales */}
        {user.sales.length > 0 && (
          <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
            <div style={{ color: '#55606f', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Recent Sales</div>
            {user.sales.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(16,19,26,0.04)' }}>
                <div>
                  <div style={{ color: '#10131a', fontSize: 13 }}>{s.clientName}</div>
                  <div style={{ color: '#9aa3b2', fontSize: 11 }}>{formatDate(s.createdAt)}</div>
                </div>
                <div style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>{formatCurrency(s.amount * 0.5)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
