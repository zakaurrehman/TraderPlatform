import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/mobile-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getAuthSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  const admin = searchParams.get('admin')

  if (admin) {
    const courses = await prisma.course.findMany({ include: { videos: { orderBy: { sortOrder: 'asc' } } }, orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ courses })
  }

  if (courseId) {
    const course = await prisma.course.findUnique({ where: { id: courseId }, include: { videos: { orderBy: { sortOrder: 'asc' } } } })
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const progress = await prisma.courseProgress.findMany({ where: { userId: session.user.id }, select: { videoId: true } })
    return NextResponse.json({ course, completed: progress.map(p => p.videoId) })
  }

  const courses = await prisma.course.findMany({ include: { videos: { select: { id: true } }, certificates: { where: { userId: session.user.id } } }, orderBy: { sortOrder: 'asc' } })
  // `completed` is additive for the mobile list view; web computes this
  // itself via Prisma and ignores the extra field.
  const progress = await prisma.courseProgress.findMany({ where: { userId: session.user.id }, select: { videoId: true } })
  return NextResponse.json({ courses, completed: progress.map(p => p.videoId) })
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession(req)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()

  if (body.type === 'course') {
    const course = await prisma.course.create({ data: { title: body.title, level: body.level, description: body.description, isPremium: body.isPremium } })
    return NextResponse.json(course, { status: 201 })
  }

  if (body.type === 'video') {
    const count = await prisma.video.count({ where: { courseId: body.courseId } })
    const video = await prisma.video.create({ data: { courseId: body.courseId, title: body.title, url: body.url, duration: body.duration || null, isPremium: body.isPremium, sortOrder: count } })
    return NextResponse.json(video, { status: 201 })
  }

  // Mark video complete
  const { videoId } = body
  const existing = await prisma.courseProgress.findUnique({ where: { userId_videoId: { userId: session.user.id, videoId } } })
  if (!existing) {
    await prisma.courseProgress.create({ data: { userId: session.user.id, videoId } })
    // Check if course complete and issue certificate
    const video = await prisma.video.findUnique({ where: { id: videoId }, select: { courseId: true } })
    if (video) {
      const course = await prisma.course.findUnique({ where: { id: video.courseId }, include: { videos: { select: { id: true } } } })
      if (course) {
        const done = await prisma.courseProgress.count({ where: { userId: session.user.id, videoId: { in: course.videos.map(v => v.id) } } })
        if (done >= course.videos.length) {
          await prisma.certificate.upsert({ where: { userId_courseId: { userId: session.user.id, courseId: course.id } }, update: {}, create: { userId: session.user.id, courseId: course.id } })
        }
      }
    }
  }
  return NextResponse.json({ ok: true })
}
