import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'

export default async function AdminOverviewPage() {
  const [users, sales, commissions, withdrawals, reviews, signals, affiliates, pendingPayments] = await Promise.all([
    prisma.user.count({ where: { role: { not: 'ADMIN' } } }),
    prisma.sale.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.commission.aggregate({ _sum: { amount: true } }),
    prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }),
    prisma.review.count({ where: { status: 'PENDING' } }),
    prisma.signal.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'AFFILIATE', status: 'PENDING' } }),
    prisma.paymentRequest.count({ where: { status: 'PENDING' } })
  ])

  const cards = [
    { label: 'Total Users', value: users, icon: '👥', color: '#2563eb', href: '/admin/users' },
    { label: 'Active Signals', value: signals, icon: '⚡', color: '#16a34a', href: '/admin/signals' },
    { label: 'Total Sales', value: formatCurrency(sales._sum.amount || 0), icon: '💰', color: '#f59e0b', href: '/admin/sales' },
    { label: 'Total Commissions', value: formatCurrency(commissions._sum.amount || 0), icon: '💸', color: '#2563eb', href: '/admin/withdrawals' },
    { label: 'Pending Payments', value: pendingPayments, icon: '💳', color: '#2563eb', urgent: pendingPayments > 0, href: '/admin/payments' },
    { label: 'Pending Affiliates', value: affiliates, icon: '🔗', color: '#f59e0b', urgent: affiliates > 0, href: '/admin/affiliates' },
    { label: 'Pending Reviews', value: reviews, icon: '⭐', color: '#55606f', urgent: reviews > 0, href: '/admin/reviews' },
    { label: 'Pending Withdrawals', value: withdrawals, icon: '🏧', color: '#dc2626', urgent: withdrawals > 0, href: '/admin/withdrawals' },
    { label: 'Sale Count', value: sales._count, icon: '📊', color: '#55606f', href: '/admin/sales' }
  ]

  const recentSales = await prisma.sale.findMany({
    include: { affiliate: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' },
    take: 8
  })

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Admin Overview</h1>
      <p style={{ color: '#7a8494', marginBottom: 24 }}>Trade with Shafy platform dashboard</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {cards.map(c => (
          <Link key={c.label} href={c.href} className="admin-stat-card" style={{
            textDecoration: 'none', display: 'block',
            background: '#ffffff',
            border: `1px solid ${c.urgent ? 'rgba(255,100,100,0.3)' : 'rgba(37,99,235,0.08)'}`,
            borderRadius: 12, padding: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              {c.urgent && <span style={{ background: 'rgba(220,38,38,0.15)', color: '#dc2626', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>ACTION</span>}
            </div>
            <div style={{ color: c.color, fontWeight: 900, fontSize: 26 }}>{c.value}</div>
            <div style={{ color: '#7a8494', fontSize: 12, marginTop: 2 }}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 14, padding: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Recent Sales</h2>
        {recentSales.length === 0 && <p style={{ color: '#9aa3b2' }}>No sales yet.</p>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(16,19,26,0.06)' }}>
                {['Client', 'Affiliate', 'Amount', 'Commission', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#7a8494', fontSize: 12, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSales.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(16,19,26,0.03)' }}>
                  <td style={{ padding: '10px', color: '#10131a', fontSize: 13 }}>{s.clientName}</td>
                  <td style={{ padding: '10px', color: '#55606f', fontSize: 13 }}>{s.affiliate.fullName}</td>
                  <td style={{ padding: '10px', color: '#2563eb', fontSize: 13, fontWeight: 700 }}>{formatCurrency(s.amount)}</td>
                  <td style={{ padding: '10px', color: '#16a34a', fontSize: 13, fontWeight: 700 }}>{formatCurrency(s.amount * 0.5)}</td>
                  <td style={{ padding: '10px', color: '#9aa3b2', fontSize: 12 }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
