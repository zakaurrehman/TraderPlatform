import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'

const IMPACT_COLORS = { HIGH: '#ff4444', MEDIUM: '#f0b429', LOW: '#00c851' }
const IMPACT_BG = { HIGH: 'rgba(255,68,68,0.1)', MEDIUM: 'rgba(240,180,41,0.1)', LOW: 'rgba(0,200,81,0.08)' }

export default async function CalendarPage() {
  const now = new Date()
  const events = await prisma.economicEvent.findMany({
    where: { eventTime: { gte: new Date(now.getTime() - 7 * 86400000) } },
    orderBy: { eventTime: 'asc' },
    take: 50
  })

  const upcoming = events.filter(e => e.eventTime >= now)
  const past = events.filter(e => e.eventTime < now).reverse()

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Economic Calendar</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>High-impact Forex events</p>
      </div>

      {/* Legend */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 12, borderBottom: '1px solid rgba(245,197,24,0.06)' }}>
        {Object.entries(IMPACT_COLORS).map(([k, c]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            <span style={{ color: '#64748b', fontSize: 11 }}>{k}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px' }}>
        {upcoming.length > 0 && (
          <>
            <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Upcoming</div>
            {upcoming.map(ev => (
              <EventRow key={ev.id} event={ev} />
            ))}
          </>
        )}

        {past.length > 0 && (
          <>
            <div style={{ color: '#475569', fontWeight: 700, fontSize: 13, margin: '16px 0 8px' }}>Past (7 days)</div>
            {past.map(ev => (
              <EventRow key={ev.id} event={ev} past />
            ))}
          </>
        )}

        {events.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>No events scheduled. Admin will add them soon.</div>}
      </div>
    </div>
  )
}

function EventRow({ event, past }: { event: { id: string; name: string; currency: string; impact: 'HIGH' | 'MEDIUM' | 'LOW'; eventTime: Date; actual?: string | null; forecast?: string | null; previous?: string | null }, past?: boolean }) {
  const color = IMPACT_COLORS[event.impact]
  const bg = IMPACT_BG[event.impact]
  return (
    <div style={{ background: past ? 'rgba(255,255,255,0.02)' : '#111118', border: `1px solid ${past ? 'rgba(255,255,255,0.04)' : 'rgba(245,197,24,0.08)'}`, borderLeft: `3px solid ${color}`, borderRadius: 10, padding: '10px 14px', marginBottom: 8, opacity: past ? 0.7 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20, marginRight: 6 }}>{event.impact}</span>
          <span style={{ background: 'rgba(255,255,255,0.06)', color: '#f5c518', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>{event.currency}</span>
        </div>
        <span style={{ color: '#475569', fontSize: 11 }}>{formatDateTime(event.eventTime)}</span>
      </div>
      <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: past ? 4 : 0 }}>{event.name}</div>
      {past && (
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          {event.actual && <span style={{ color: '#00c851', fontSize: 12 }}>Actual: <strong>{event.actual}</strong></span>}
          {event.forecast && <span style={{ color: '#94a3b8', fontSize: 12 }}>Forecast: {event.forecast}</span>}
          {event.previous && <span style={{ color: '#475569', fontSize: 12 }}>Prev: {event.previous}</span>}
        </div>
      )}
    </div>
  )
}
