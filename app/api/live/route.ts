import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sessions = await prisma.liveSession.findMany({ orderBy: { scheduledAt: 'desc' } })
  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { title, description, streamUrl, scheduledAt } = await req.json()
  const ls = await prisma.liveSession.create({ data: { title, description: description || null, streamUrl: streamUrl || null, scheduledAt: new Date(scheduledAt) } })
  return NextResponse.json(ls, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, isLive } = await req.json()
  const ls = await prisma.liveSession.update({ where: { id }, data: { isLive } })
  return NextResponse.json(ls)
}
