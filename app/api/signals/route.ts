import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all')

  if (all) {
    const session = await getServerSession(authOptions)
    if (session?.user.role !== 'ADMIN') return NextResponse.json([], { status: 403 })
    const signals = await prisma.signal.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(signals)
  }

  const signals = await prisma.signal.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(signals)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { pair, direction, entry, tp1, tp2, tp3, sl, notes } = await req.json()
  const signal = await prisma.signal.create({ data: { pair, direction, entry, tp1, tp2, tp3, sl, notes } })
  return NextResponse.json(signal, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, status, pips } = await req.json()
  const signal = await prisma.signal.update({
    where: { id },
    data: { status, pips, closedAt: status !== 'ACTIVE' ? new Date() : null }
  })
  return NextResponse.json(signal)
}
