import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/mobile-auth'
import { prisma } from '@/lib/prisma'
import { pushToAll } from '@/lib/push'

export async function GET() {
  const sessions = await prisma.liveSession.findMany({ orderBy: { scheduledAt: 'desc' } })
  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession(req)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { title, description, streamUrl, scheduledAt } = await req.json()
  const ls = await prisma.liveSession.create({ data: { title, description: description || null, streamUrl: streamUrl || null, scheduledAt: new Date(scheduledAt) } })
  return NextResponse.json(ls, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getAuthSession(req)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, isLive } = await req.json()
  const ls = await prisma.liveSession.update({ where: { id }, data: { isLive } })

  if (isLive) {
    await pushToAll({
      title: '🔴 LIVE NOW',
      body: ls.title,
      data: { type: 'live', sessionId: ls.id, link: '/live' },
    })
  }

  return NextResponse.json(ls)
}
