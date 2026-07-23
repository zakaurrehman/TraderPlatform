'use client'
import { useState, useEffect } from 'react'
import { Icon } from '@/components/brand/icons'

type Video = { id: string; title: string; url: string; duration: string | null; isPremium: boolean }
type Course = { id: string; title: string; level: string; description?: string; isPremium?: boolean; videos: Video[] }

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research']

export default function AdminVideosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showVideoForm, setShowVideoForm] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<string | null>(null)
  const [editingVideo, setEditingVideo] = useState<string | null>(null)
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

  async function saveCourse(id: string, e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/classroom', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'course', id, ...cForm }) })
    const data = await res.json()
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    setEditingCourse(null); setLoading(false)
  }

  async function deleteCourse(c: Course) {
    if (!confirm(`Delete course "${c.title}" permanently?\n\nThis removes its ${c.videos.length} video(s), all student progress and certificates for this course. This cannot be undone.`)) return
    const res = await fetch('/api/classroom', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'course', id: c.id }) })
    if (res.ok) setCourses(prev => prev.filter(x => x.id !== c.id))
    else alert('Could not delete the course. Please try again.')
  }

  async function addVideo(courseId: string, e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/classroom', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'video', courseId, ...vForm }) })
    const data = await res.json()
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, videos: [...c.videos, data] } : c))
    setVForm({ title: '', url: '', duration: '', isPremium: false })
    setShowVideoForm(null); setLoading(false)
  }

  async function saveVideo(courseId: string, id: string, e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/classroom', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'video', id, ...vForm }) })
    const data = await res.json()
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, videos: c.videos.map(v => v.id === id ? { ...v, ...data } : v) } : c))
    setEditingVideo(null); setLoading(false)
  }

  async function deleteVideo(courseId: string, v: Video) {
    if (!confirm(`Delete video "${v.title}"?\n\nStudent progress for this video is removed too. This cannot be undone.`)) return
    const res = await fetch('/api/classroom', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'video', id: v.id }) })
    if (res.ok) setCourses(prev => prev.map(c => c.id === courseId ? { ...c, videos: c.videos.filter(x => x.id !== v.id) } : c))
    else alert('Could not delete the video. Please try again.')
  }

  const inputStyle: React.CSSProperties = { background: 'rgba(16,19,26,0.05)', border: '1px solid rgba(16,19,26,0.1)', borderRadius: 8, color: '#10131a', padding: '8px 12px', width: '100%', outline: 'none', fontSize: 13 }
  const label: React.CSSProperties = { color: '#55606f', fontSize: 12, display: 'block', marginBottom: 4 }
  const smallBtn = (color: string, border: string, bg: string): React.CSSProperties => ({ padding: '5px 11px', borderRadius: 7, background: bg, border: `1px solid ${border}`, color, cursor: 'pointer', fontSize: 12, fontWeight: 600 })

  const courseFields = (
    <>
      <div><label style={label}>Title</label><input style={inputStyle} value={cForm.title} onChange={e => setCForm(f => ({ ...f, title: e.target.value }))} required /></div>
      <div>
        <label style={label}>Level</label>
        <select style={{ ...inputStyle, background: '#ffffff' }} value={cForm.level} onChange={e => setCForm(f => ({ ...f, level: e.target.value }))}>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div style={{ gridColumn: '1/-1' }}><label style={label}>Description</label><input style={inputStyle} value={cForm.description} onChange={e => setCForm(f => ({ ...f, description: e.target.value }))} required /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={cForm.isPremium} onChange={e => setCForm(f => ({ ...f, isPremium: e.target.checked }))} />
        <label style={{ color: '#55606f', fontSize: 13 }}>Premium course</label>
      </div>
    </>
  )

  const videoFields = (
    <>
      <div><label style={label}>Video Title</label><input style={inputStyle} value={vForm.title} onChange={e => setVForm(f => ({ ...f, title: e.target.value }))} required /></div>
      <div><label style={label}>YouTube URL</label><input style={inputStyle} value={vForm.url} onChange={e => setVForm(f => ({ ...f, url: e.target.value }))} required /></div>
      <div><label style={label}>Duration (e.g. 12:30)</label><input style={inputStyle} value={vForm.duration} onChange={e => setVForm(f => ({ ...f, duration: e.target.value }))} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={vForm.isPremium} onChange={e => setVForm(f => ({ ...f, isPremium: e.target.checked }))} />
        <label style={{ color: '#55606f', fontSize: 13 }}>Premium video</label>
      </div>
    </>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>Classroom Videos</h1>
          <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>{courses.length} courses</p>
        </div>
        <button onClick={() => { setShowCourseForm(!showCourseForm); setEditingCourse(null); setCForm({ title: '', level: 'Beginner', description: '', isPremium: false }) }} style={{ padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
          + New Course
        </button>
      </div>

      {showCourseForm && (
        <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Add Course</h3>
          <form onSubmit={addCourse} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {courseFields}
            <button type="submit" disabled={loading} style={{ padding: '9px', borderRadius: 8, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Add Course</button>
          </form>
        </div>
      )}

      {courses.map(course => (
        <div key={course.id} style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 10, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>{course.title}</h3>
                <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 11, padding: '1px 7px', borderRadius: 20 }}>{course.level}</span>
                {course.isPremium && <Icon name="star" size={12} style={{ color: '#f59e0b' }} />}
              </div>
              <div style={{ color: '#7a8494', fontSize: 12, marginTop: 2 }}>{course.videos.length} videos</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setShowVideoForm(showVideoForm === course.id ? null : course.id); setEditingVideo(null); setVForm({ title: '', url: '', duration: '', isPremium: false }) }} style={smallBtn('#2563eb', 'rgba(37,99,235,0.15)', 'rgba(37,99,235,0.08)')}>+ Add Video</button>
              <button onClick={() => {
                if (editingCourse === course.id) { setEditingCourse(null); return }
                setEditingCourse(course.id); setShowCourseForm(false)
                setCForm({ title: course.title, level: course.level, description: course.description || '', isPremium: !!course.isPremium })
              }} style={smallBtn('#55606f', 'rgba(16,19,26,0.12)', 'rgba(16,19,26,0.04)')}>Edit</button>
              <button onClick={() => deleteCourse(course)} style={smallBtn('#dc2626', 'rgba(220,38,38,0.25)', 'transparent')}>Delete</button>
            </div>
          </div>

          {editingCourse === course.id && (
            <form onSubmit={e => saveCourse(course.id, e)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12, background: 'rgba(16,19,26,0.03)', padding: 12, borderRadius: 10 }}>
              {courseFields}
              <button type="submit" disabled={loading} style={{ alignSelf: 'flex-end', padding: '8px', borderRadius: 7, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
            </form>
          )}

          {showVideoForm === course.id && (
            <form onSubmit={e => addVideo(course.id, e)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12, background: 'rgba(37,99,235,0.04)', padding: 12, borderRadius: 10 }}>
              {videoFields}
              <button type="submit" disabled={loading} style={{ alignSelf: 'flex-end', padding: '8px', borderRadius: 7, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Add</button>
            </form>
          )}

          {course.videos.map((v, i) => (
            <div key={v.id}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderTop: '1px solid rgba(16,19,26,0.04)', fontSize: 13 }}>
                <span style={{ color: '#9aa3b2', width: 20 }}>{i + 1}.</span>
                <span style={{ color: '#10131a', flex: 1 }}>{v.title}</span>
                {v.duration && <span style={{ color: '#9aa3b2', fontSize: 11 }}>{v.duration}</span>}
                {v.isPremium && <Icon name="star" size={12} style={{ color: '#f59e0b' }} />}
                <button onClick={() => {
                  if (editingVideo === v.id) { setEditingVideo(null); return }
                  setEditingVideo(v.id); setShowVideoForm(null)
                  setVForm({ title: v.title, url: v.url, duration: v.duration || '', isPremium: v.isPremium })
                }} style={smallBtn('#55606f', 'rgba(16,19,26,0.12)', 'rgba(16,19,26,0.04)')}>Edit</button>
                <button onClick={() => deleteVideo(course.id, v)} style={smallBtn('#dc2626', 'rgba(220,38,38,0.25)', 'transparent')}>Delete</button>
              </div>
              {editingVideo === v.id && (
                <form onSubmit={e => saveVideo(course.id, v.id, e)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '4px 0 12px', background: 'rgba(16,19,26,0.03)', padding: 12, borderRadius: 10 }}>
                  {videoFields}
                  <button type="submit" disabled={loading} style={{ alignSelf: 'flex-end', padding: '8px', borderRadius: 7, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
                </form>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
