import { prisma } from '@/lib/prisma'
import SignalCard from '@/components/SignalCard'
import Link from 'next/link'

export default async function SignalsPage() {
  const [activeSignals, stats] = await Promise.all([
    prisma.signal.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } }),
    prisma.signalStat.findFirst({ orderBy: { month: 'desc' } })
  ])

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Live Signals</h1>
          <Link href="/signals/history" style={{ color: '#f5c518', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>History →</Link>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c851', boxShadow: '0 0 8px #00c851', marginTop: 2 }} />
          <span style={{ color: '#00c851', fontSize: 13, fontWeight: 700 }}>{activeSignals.length} Active Signal{activeSignals.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Stats banner */}
      {stats && (
        <div style={{ margin: '12px 16px', background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(0,200,81,0.06))', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 12, padding: '12px 16px' }}>
          <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>This Month — {stats.month}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
            <div>
              <div style={{ color: '#f5c518', fontWeight: 800, fontSize: 20 }}>{stats.winRate}%</div>
              <div style={{ color: '#475569', fontSize: 10 }}>Win Rate</div>
            </div>
            <div>
              <div style={{ color: '#00c851', fontWeight: 800, fontSize: 20 }}>+{stats.pipsGained}</div>
              <div style={{ color: '#475569', fontSize: 10 }}>Pips</div>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>{stats.totalSignals}</div>
              <div style={{ color: '#475569', fontSize: 10 }}>Signals</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '4px 16px' }}>
        {activeSignals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p style={{ color: '#475569', fontSize: 14 }}>No active signals right now.</p>
            <p style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>Check back soon or view signal history.</p>
          </div>
        ) : (
          activeSignals.map(s => <SignalCard key={s.id} signal={s} />)
        )}
      </div>
    </div>
  )
}
