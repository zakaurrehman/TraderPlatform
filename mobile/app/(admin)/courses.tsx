import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/api/hooks'
import { apiFetch } from '@/api/client'
import { Screen, Loader, ErrorState, EmptyState, Field, Button, Badge, colors, font, spacing } from '@/components/ui'
import { Select } from '@/components/Select'
import { AdminRow } from '@/components/AdminRow'
import { NewItemForm } from '@/components/NewItemForm'

type Video = { id: string; title: string; url: string; duration?: string | null; isPremium: boolean }
type Course = { id: string; title: string; level: string; description: string; isPremium: boolean; videos: Video[] }
type Resp = { courses: Course[] }

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Master', 'COT Research']

export default function AdminCoursesScreen() {
  const qc = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useApi<Resp>('/api/classroom?admin=1')
  const courses = data?.courses ?? []
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('Beginner')
  const [description, setDescription] = useState('')
  const [premium, setPremium] = useState('false')
  const [vCourseId, setVCourseId] = useState('')
  const [vTitle, setVTitle] = useState('')
  const [vUrl, setVUrl] = useState('')
  const [vDuration, setVDuration] = useState('')
  const [vPremium, setVPremium] = useState('false')
  const [busy, setBusy] = useState(false)

  async function createCourse() {
    setBusy(true)
    try {
      await apiFetch('/api/classroom', {
        method: 'POST',
        body: { type: 'course', title, level, description, isPremium: premium === 'true' },
      })
      qc.invalidateQueries({ queryKey: ['/api/classroom?admin=1'] })
      qc.invalidateQueries({ queryKey: ['/api/classroom'] })
      setTitle(''); setDescription('')
    } finally {
      setBusy(false)
    }
  }

  async function createVideo() {
    if (!vCourseId) return
    setBusy(true)
    try {
      await apiFetch('/api/classroom', {
        method: 'POST',
        body: { type: 'video', courseId: vCourseId, title: vTitle, url: vUrl, duration: vDuration || null, isPremium: vPremium === 'true' },
      })
      qc.invalidateQueries({ queryKey: ['/api/classroom?admin=1'] })
      setVTitle(''); setVUrl(''); setVDuration('')
    } finally {
      setBusy(false)
    }
  }

  if (isLoading) return <Screen><Loader /></Screen>
  if (isError) return <Screen><ErrorState message="Could not load courses" onRetry={() => refetch()} /></Screen>

  return (
    <Screen scroll refreshing={isRefetching} onRefresh={refetch}>
      <View style={{ padding: spacing.lg }}>
        <NewItemForm label="+ New Course">
          <Field label="Title" value={title} onChangeText={setTitle} />
          <Select label="Level" value={level} options={LEVELS} onChange={setLevel} />
          <Field label="Description" multiline numberOfLines={3} style={{ minHeight: 80, textAlignVertical: 'top' }} value={description} onChangeText={setDescription} />
          <Select label="Premium?" value={premium} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={setPremium} />
          <Button title="Create Course" onPress={createCourse} loading={busy} />
        </NewItemForm>

        <NewItemForm label="+ New Video">
          <Select
            label="Course"
            value={vCourseId}
            placeholder="Select a course"
            options={courses.map((c) => ({ label: c.title, value: c.id }))}
            onChange={setVCourseId}
          />
          <Field label="Video Title" value={vTitle} onChangeText={setVTitle} />
          <Field label="Video URL (YouTube)" autoCapitalize="none" value={vUrl} onChangeText={setVUrl} />
          <Field label="Duration (e.g. 12:34)" value={vDuration} onChangeText={setVDuration} />
          <Select label="Premium?" value={vPremium} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} onChange={setVPremium} />
          <Button title="Add Video" onPress={createVideo} loading={busy} />
        </NewItemForm>

        {courses.length === 0 ? (
          <EmptyState icon="school-outline" title="No courses yet." />
        ) : (
          courses.map((c) => (
            <AdminRow
              key={c.id}
              title={c.title}
              subtitle={`${c.level} · ${c.videos.length} video${c.videos.length === 1 ? '' : 's'}`}
              badge={c.isPremium ? <Badge label="PREMIUM" color={colors.primary} /> : <Badge label="FREE" color={colors.green} />}
            >
              {c.videos.slice(0, 5).map((v) => (
                <Text key={v.id} style={{ color: colors.muted, fontSize: font.small }}>• {v.title}</Text>
              ))}
              {c.videos.length > 5 ? (
                <Text style={{ color: colors.muted2, fontSize: font.tiny }}>+{c.videos.length - 5} more</Text>
              ) : null}
            </AdminRow>
          ))
        )}
      </View>
    </Screen>
  )
}
