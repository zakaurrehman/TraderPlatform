import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const brokers = await prisma.broker.findMany({ where: { isActive: true }, orderBy: [{ isRecommended: 'desc' }, { rating: 'desc' }] })
  return NextResponse.json(brokers)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { name, description, rating, link, minDeposit, regulation, isRecommended } = await req.json()
  const broker = await prisma.broker.create({ data: { name, description, rating, link, minDeposit: minDeposit || null, regulation: regulation || null, isRecommended } })
  return NextResponse.json(broker, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...data } = await req.json()
  const broker = await prisma.broker.update({ where: { id }, data })
  return NextResponse.json(broker)
}
