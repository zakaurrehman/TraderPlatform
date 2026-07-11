import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research']

export default async function ClassroomPage() {
  const session = await getServerSession(authOptions)
  const isPremium = session?.user.plan === 'PREMIUM'
  const userId = session?.user.id!

  const courses = await prisma.course.findMany({
    include: {
      videos: { select: { id: true } },
      certificates: { where: { userId } }
    },
    orderBy: { sortOrder: 'asc' }
  })

  const progressData = await prisma.courseProgress.findMany({
    where: { userId },
    select: { videoId: true }
  })
  const completedVideos = new Set(progressData.map(p => p.videoId))

  const sorted = [...courses].sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level))

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: '#10131a' }}>Classroom</h1>
        <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>Master Forex from Beginner to Expert</p>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {sorted.map(course => {
          const total = course.videos.length
          const done = course.videos.filter(v => completedVideos.has(v.id)).length
          const pct = total > 0 ? Math.round((done / total) * 100) : 0
          const locked = course.isPremium && !isPremium
          const certified = course.certificates.length > 0

          return (
            <Link key={course.id} href={locked ? '/order' : `/classroom/${course.id}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 12 }}>
              <div style={{ background: '#ffffff', border: `1px solid ${locked ? 'rgba(168,85,247,0.15)' : 'rgba(37,99,235,0.1)'}`, borderRadius: 14, padding: 16, opacity: locked ? 0.75 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{course.level}</span>
                      {course.isPremium && <span style={{ background: 'rgba(168,85,247,0.15)', color: '#7c3aed', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>PREMIUM</span>}
                      {locked && <span style={{ background: 'rgba(168,85,247,0.1)', color: '#7c3aed', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>Upgrade to unlock</span>}
                      {certified && <span style={{ background: 'rgba(22,163,74,0.15)', color: '#16a34a', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>Certified</span>}
                    </div>
                    <h3 style={{ color: locked ? '#7a8494' : '#10131a', fontWeight: 700, fontSize: 16 }}>{course.title}</h3>
                    <p style={{ color: '#9aa3b2', fontSize: 12, marginTop: 2 }}>{course.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ color: '#2563eb', fontWeight: 800, fontSize: 20 }}>{pct}%</div>
                    <div style={{ color: '#9aa3b2', fontSize: 10 }}>{done}/{total}</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(16,19,26,0.05)', borderRadius: 4, height: 4 }}>
                  <div style={{ background: 'linear-gradient(90deg, #2563eb, #22c55e)', height: '100%', borderRadius: 4, width: `${pct}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            </Link>
          )
        })}
        {sorted.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 40 }}>No courses yet. Check back soon!</div>}
      </div>
    </div>
  )
}
