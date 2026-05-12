import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function CommissionsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const commissions = await prisma.commission.findMany({
    where: { affiliateId: session.user.id },
    include: { sale: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/affiliate" style={{ color: '#64748b', textDecoration: 'none', fontSize: 20 }}>←</Link>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Commissions</h1>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {commissions.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>No commissions yet. Share your referral link to start earning!</div>}
        {commissions.map(c => (
          <div key={c.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 12, padding: 14, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{c.sale.clientName}</div>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>Sale: {formatCurrency(c.sale.amount)}</div>
                <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{formatDate(c.createdAt)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#00c851', fontWeight: 800, fontSize: 18 }}>{formatCurrency(c.amount)}</div>
                <span style={{ background: c.withdrawn ? 'rgba(148,163,184,0.1)' : 'rgba(0,200,81,0.1)', color: c.withdrawn ? '#64748b' : '#00c851', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{c.withdrawn ? 'Paid Out' : 'Available'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
