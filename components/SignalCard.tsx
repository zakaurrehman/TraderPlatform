import { formatDateTime } from '@/lib/utils'

type Signal = {
  id: string
  pair: string
  direction: 'BUY' | 'SELL'
  entry: number
  tp1: number
  tp2?: number | null
  tp3?: number | null
  sl: number
  status: 'ACTIVE' | 'HIT_TP' | 'HIT_SL' | 'CLOSED'
  pips?: number | null
  notes?: string | null
  createdAt: Date | string
}

function StatusBadge({ status, pips }: { status: Signal['status'], pips?: number | null }) {
  const map = {
    ACTIVE: { label: '🟢 Active', color: '#00c851', bg: 'rgba(0,200,81,0.12)' },
    HIT_TP: { label: '✅ TP Hit', color: '#f5c518', bg: 'rgba(245,197,24,0.12)' },
    HIT_SL: { label: '❌ SL Hit', color: '#ff4444', bg: 'rgba(255,68,68,0.12)' },
    CLOSED: { label: '⬜ Closed', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' }
  }
  const s = map[status]
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, border: `1px solid ${s.color}22` }}>
      {s.label}{pips != null ? ` +${pips}p` : ''}
    </span>
  )
}

export default function SignalCard({ signal }: { signal: Signal }) {
  const isBuy = signal.direction === 'BUY'
  return (
    <div style={{
      background: '#111118', border: '1px solid rgba(245,197,24,0.1)',
      borderRadius: 12, padding: 14, marginBottom: 10
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>{signal.pair}</span>
          <span className={isBuy ? 'buy-badge' : 'sell-badge'}>{signal.direction}</span>
        </div>
        <StatusBadge status={signal.status} pips={signal.pips} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
        {[
          { label: 'Entry', value: signal.entry.toFixed(5) },
          { label: 'TP1', value: signal.tp1.toFixed(5) },
          { label: 'SL', value: signal.sl.toFixed(5) }
        ].map(({ label, value }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 8px' }}>
            <div style={{ color: '#64748b', fontSize: 10, marginBottom: 2 }}>{label}</div>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      {(signal.tp2 || signal.tp3) && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {signal.tp2 && (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 8px' }}>
              <div style={{ color: '#64748b', fontSize: 10 }}>TP2</div>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{signal.tp2.toFixed(5)}</div>
            </div>
          )}
          {signal.tp3 && (
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 8px' }}>
              <div style={{ color: '#64748b', fontSize: 10 }}>TP3</div>
              <div style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{signal.tp3.toFixed(5)}</div>
            </div>
          )}
        </div>
      )}

      {signal.notes && <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>{signal.notes}</p>}
      <div style={{ color: '#475569', fontSize: 11 }}>{formatDateTime(signal.createdAt)}</div>
    </div>
  )
}
