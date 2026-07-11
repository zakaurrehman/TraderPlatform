import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { timeAgo } from '@/lib/utils'

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id!

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: '#10131a' }}>Notifications</h1>
        <div style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>{notifications.filter(n => !n.read).length} unread</div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {notifications.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 40 }}>No notifications yet.</div>}
        {notifications.map(n => (
          <div key={n.id} style={{ background: n.read ? 'rgba(16,19,26,0.02)' : '#ffffff', border: `1px solid ${n.read ? 'rgba(16,19,26,0.04)' : 'rgba(37,99,235,0.12)'}`, borderRadius: 12, padding: 14, marginBottom: 8, borderLeft: n.read ? undefined : '3px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div style={{ color: '#10131a', fontWeight: n.read ? 400 : 700, fontSize: 14 }}>{n.title}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, marginLeft: 8 }}>
                {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />}
                <span style={{ color: '#9aa3b2', fontSize: 11 }}>{timeAgo(n.createdAt)}</span>
              </div>
            </div>
            <p style={{ color: '#7a8494', fontSize: 13 }}>{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
