'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Video = { id: string; title: string; url: string; duration: string | null; sortOrder: number; isPremium: boolean }
type Course = { id: string; title: string; level: string; description: string; videos: Video[] }

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const [courseId, setCourseId] = useState('')
  const [course, setCourse] = useState<Course | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(p => setCourseId(p.courseId))
  }, [params])

  useEffect(() => {
    if (!courseId) return
    fetch(`/api/classroom?courseId=${courseId}`)
      .then(r => r.json())
      .then(data => { setCourse(data.course); setCompleted(new Set(data.completed)); setActiveVideo(data.course?.videos[0] || null); setLoading(false) })
  }, [courseId])

  async function markComplete(videoId: string) {
    await fetch('/api/classroom', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoId }) })
    setCompleted(prev => new Set(Array.from(prev).concat(videoId)))
  }

  if (loading) return <div style={{ padding: 24, color: '#7a8494', textAlign: 'center' }}>Loading...</div>
  if (!course) return <div style={{ padding: 24, color: '#dc2626', textAlign: 'center' }}>Course not found.</div>

  const total = course.videos.length
  const done = course.videos.filter(v => completed.has(v.id)).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  function getEmbedUrl(url: string) {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?\s]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`
    return url
  }

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <Link href="/classroom" style={{ color: '#7a8494', textDecoration: 'none', fontSize: 13, display: 'block', marginBottom: 8 }}>← Classroom</Link>
        <h1 style={{ fontWeight: 800, fontSize: 18, color: '#10131a', marginBottom: 4 }}>{course.title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#7a8494', fontSize: 12 }}>{done}/{total} complete</span>
          <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 13 }}>{pct}%</span>
        </div>
        <div style={{ background: 'rgba(16,19,26,0.05)', borderRadius: 4, height: 4, marginTop: 6 }}>
          <div style={{ background: 'linear-gradient(90deg,#2563eb,#22c55e)', height: '100%', borderRadius: 4, width: `${pct}%` }} />
        </div>
      </div>

      {/* Video player */}
      {activeVideo && (
        <div>
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
            <iframe src={getEmbedUrl(activeVideo.url)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          </div>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(37,99,235,0.06)' }}>
            <h2 style={{ color: '#10131a', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{activeVideo.title}</h2>
            {!completed.has(activeVideo.id) && (
              <button onClick={() => markComplete(activeVideo.id)} style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                ✓ Mark Complete
              </button>
            )}
            {completed.has(activeVideo.id) && <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13 }}>✅ Completed</span>}
          </div>
        </div>
      )}

      {/* Video list */}
      <div style={{ padding: '8px 16px' }}>
        {course.videos.map((v, i) => (
          <button key={v.id} onClick={() => setActiveVideo(v)} style={{
            width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, border: 'none', marginBottom: 6, cursor: 'pointer',
            background: activeVideo?.id === v.id ? 'rgba(37,99,235,0.12)' : 'rgba(16,19,26,0.04)',
            borderLeft: `3px solid ${completed.has(v.id) ? '#16a34a' : activeVideo?.id === v.id ? '#2563eb' : 'transparent'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#9aa3b2', fontSize: 12, width: 18 }}>{i + 1}.</span>
                <div>
                  <div style={{ color: '#10131a', fontSize: 13, fontWeight: completed.has(v.id) ? 600 : 400 }}>{v.title}</div>
                  {v.duration && <div style={{ color: '#9aa3b2', fontSize: 11 }}>{v.duration}</div>}
                </div>
              </div>
              {completed.has(v.id) && <span style={{ color: '#16a34a', fontSize: 14 }}>✓</span>}
            </div>
          </button>
        ))}
      </div>

      {pct === 100 && (
        <div style={{ margin: '12px 16px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🏆</div>
          <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 16 }}>Course Complete!</div>
          <div style={{ color: '#7a8494', fontSize: 12, marginTop: 4 }}>Your certificate has been issued.</div>
        </div>
      )}
    </div>
  )
}
