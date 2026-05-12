import { prisma } from '@/lib/prisma'
import SignalCard from '@/components/SignalCard'
import Link from 'next/link'

export default async function SignalHistoryPage() {
  const [closed, stats] = await Promise.all([
    prisma.signal.findMany({ where: { status: { in: ['HIT_TP', 'HIT_SL', 'CLOSED'] } }, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.signalStat.findMany({ orderBy: { month: 'desc' }, take: 6 })
  ])

  const tp = closed.filter(s => s.status === 'HIT_TP').length
  const sl = closed.filter(s => s.status === 'HIT_SL').length
  const wr = closed.length > 0 ? Math.round((tp / closed.length) * 100) : 0

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/signals" style={{ color: '#64748b', textDecoration: 'none', fontSize: 20 }}>←</Link>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Signal History</h1>
      </div>

      {/* Overall stats */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10 }}>Overall Performance</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, textAlign: 'center' }}>
            <div style={{ background: 'rgba(245,197,24,0.06)', borderRadius: 8, padding: '10px 6px' }}>
              <div style={{ color: '#f5c518', fontWeight: 800, fontSize: 24 }}>{wr}%</div>
              <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>Win Rate</div>
            </div>
            <div style={{ background: 'rgba(0,200,81,0.06)', borderRadius: 8, padding: '10px 6px' }}>
              <div style={{ color: '#00c851', fontWeight: 800, fontSize: 24 }}>{tp}</div>
              <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>TP Hits</div>
            </div>
            <div style={{ background: 'rgba(255,68,68,0.06)', borderRadius: 8, padding: '10px 6px' }}>
              <div style={{ color: '#ff4444', fontWeight: 800, fontSize: 24 }}>{sl}</div>
              <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>SL Hits</div>
            </div>
          </div>
        </div>

        {/* Monthly stats */}
        {stats.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Monthly Breakdown</div>
            {stats.map(s => (
              <div key={s.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.06)', borderRadius: 10, padding: '10px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{s.month}</div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{s.totalSignals} signals</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f5c518', fontWeight: 800, fontSize: 16 }}>{s.winRate}%</div>
                  <div style={{ color: '#00c851', fontSize: 12 }}>+{s.pipsGained} pips</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Closed Signals</div>
        {closed.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 32 }}>No closed signals yet.</div>}
        {closed.map(s => <SignalCard key={s.id} signal={s} />)}
      </div>
    </div>
  )
}
