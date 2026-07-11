'use client'
import { useState, useEffect } from 'react'

type Course = { id: string; title: string; level: string; videos: { id: string; title: string; url: string; duration: string | null; isPremium: boolean }[] }

export default function AdminVideosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showVideoForm, setShowVideoForm] = useState<string | null>(null)
  const [cForm, setCForm] = useState({ title: '', level: 'Beginner', description: '', isPremium: false })
  const [vForm, setVForm] = useState({ title: '', url: '', duration: '', isPremium: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch('/api/classroom?admin=1').then(r => r.json()).then(d => setCourses(d.courses || [])) }, [])

  async function addCourse(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/classroom', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'course', ...cForm }) })
    const data = await res.json()
    setCourses(prev => [...prev, { ...data, videos: [] }])
    setCForm({ title: '', level: 'Beginner', description: '', isPremium: false })
    setShowCourseForm(false); setLoading(false)
  }

  async function addVideo(courseId: string, e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/classroom', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'video', courseId, ...vForm }) })
    const data = await res.json()
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, videos: [...c.videos, data] } : c))
    setVForm({ title: '', url: '', duration: '', isPremium: false })
    setShowVideoForm(null); setLoading(false)
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>Classroom Videos</h1>
          <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>{courses.length} courses</p>
        </div>
        <button onClick={() => setShowCourseForm(!showCourseForm)} style={{ padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          + New Course
        </button>
      </div>

      {showCourseForm && (
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Add Course</h3>
          <form onSubmit={addCourse} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Title</label><input style={inputStyle} value={cForm.title} onChange={e => setCForm(f => ({ ...f, title: e.target.value }))} required /></div>
            <div>
              <label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Level</label>
              <select style={{ ...inputStyle, background: '#ffffff' }} value={cForm.level} onChange={e => setCForm(f => ({ ...f, level: e.target.value }))}>
                {['Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}><label style={{ color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }}>Description</label><input style={inputStyle} value={cForm.description} onChange={e => setCForm(f => ({ ...f, description: e.target.value }))} required /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={cForm.isPremium} onChange={e => setCForm(f => ({ ...f, isPremium: e.target.checked }))} />
              <label style={{ color: '#55606f', fontSize: 13 }}>Premium course</label>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '9px', borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Add Course</button>
          </form>
        </div>
      )}

      {courses.map(course => (
        <div key={course.id} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>{course.title}</h3>
                <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 11, padding: '1px 7px', borderRadius: 20 }}>{course.level}</span>
              </div>
              <div style={{ color: '#7a8494', fontSize: 12, marginTop: 2 }}>{course.videos.length} videos</div>
            </div>
            <button onClick={() => setShowVideoForm(showVideoForm === course.id ? null : course.id)} style={{ padding: '6px 12px', borderRadius: 7, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb', cursor: 'pointer', fontSize: 12 }}>+ Add Video</button>
          </div>

          {showVideoForm === course.id && (
            <form onSubmit={e => addVideo(course.id, e)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12, background: 'rgba(37,99,235,0.04)', padding: 12, borderRadius: 10 }}>
              <div><label style={{ color: '#55606f', fontSize: 11, display: 'block', marginBottom: 3 }}>Video Title</label><input style={inputStyle} value={vForm.title} onChange={e => setVForm(f => ({ ...f, title: e.target.value }))} required /></div>
              <div><label style={{ color: '#55606f', fontSize: 11, display: 'block', marginBottom: 3 }}>YouTube URL</label><input style={inputStyle} value={vForm.url} onChange={e => setVForm(f => ({ ...f, url: e.target.value }))} required /></div>
              <div><label style={{ color: '#55606f', fontSize: 11, display: 'block', marginBottom: 3 }}>Duration (e.g. 12:30)</label><input style={inputStyle} value={vForm.duration} onChange={e => setVForm(f => ({ ...f, duration: e.target.value }))} /></div>
              <button type="submit" disabled={loading} style={{ alignSelf: 'flex-end', padding: '8px', borderRadius: 7, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Add</button>
            </form>
          )}

          {course.videos.map((v, i) => (
            <div key={v.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderTop: '1px solid rgba(16,19,26,0.04)', fontSize: 13 }}>
              <span style={{ color: '#9aa3b2', width: 20 }}>{i + 1}.</span>
              <span style={{ color: '#10131a', flex: 1 }}>{v.title}</span>
              {v.duration && <span style={{ color: '#9aa3b2', fontSize: 11 }}>{v.duration}</span>}
              {v.isPremium && <span style={{ color: '#f59e0b', fontSize: 11 }}>⭐</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
