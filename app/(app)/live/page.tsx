import { Icon } from '@/components/brand/icons'
import { prisma } from '@/lib/prisma'
import { formatDateTime } from '@/lib/utils'

export default async function LivePage() {
  const now = new Date()
  const [liveSessions, upcoming] = await Promise.all([
    prisma.liveSession.findMany({ where: { isLive: true }, orderBy: { scheduledAt: 'desc' } }),
    prisma.liveSession.findMany({ where: { isLive: false, scheduledAt: { gte: now } }, orderBy: { scheduledAt: 'asc' }, take: 10 })
  ])

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: '#10131a' }}>Live Sessions</h1>
        <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>Watch Shafy trade live and ask questions</p>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Currently Live */}
        {liveSessions.map(session => (
          <div key={session.id} style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(220,38,38,0.06))', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ background: '#dc2626', borderRadius: '50%', width: 10, height: 10, animation: 'pulse-glow 1.5s infinite' }} />
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>LIVE NOW</span>
            </div>
            <h2 style={{ color: '#10131a', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{session.title}</h2>
            {session.description && <p style={{ color: '#55606f', fontSize: 13, marginBottom: 12 }}>{session.description}</p>}
            {session.streamUrl && (
              <a href={session.streamUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 8, background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                Watch Live
              </a>
            )}
          </div>
        ))}

        {liveSessions.length === 0 && (
          <div style={{ background: '#ffffff', border: '1px solid rgba(16,19,26,0.06)', borderRadius: 14, padding: 24, textAlign: 'center', marginBottom: 14 }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}><Icon name="activity" size={36} style={{ color: '#9aa3b2' }} /></div>
            <p style={{ color: '#7a8494', fontSize: 14 }}>No live session right now.</p>
            <p style={{ color: '#aeb6c2', fontSize: 12, marginTop: 4 }}>Check upcoming sessions below.</p>
          </div>
        )}

        {/* Upcoming */}
        <div style={{ color: '#55606f', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Upcoming Sessions</div>
        {upcoming.length === 0 && <div style={{ color: '#9aa3b2', fontSize: 13 }}>No upcoming sessions scheduled.</div>}
        {upcoming.map(session => {
          const diff = session.scheduledAt.getTime() - now.getTime()
          const days = Math.floor(diff / 86400000)
          const hours = Math.floor((diff % 86400000) / 3600000)
          const mins = Math.floor((diff % 3600000) / 60000)
          const countdown = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

          return (
            <div key={session.id} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <h3 style={{ color: '#10131a', fontWeight: 700, fontSize: 15 }}>{session.title}</h3>
                <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, flexShrink: 0, marginLeft: 8 }}>⏰ {countdown}</span>
              </div>
              {session.description && <p style={{ color: '#7a8494', fontSize: 12, marginBottom: 6 }}>{session.description}</p>}
              <div style={{ color: '#9aa3b2', fontSize: 11 }}>{formatDateTime(session.scheduledAt)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
