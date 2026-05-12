import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const resources = await prisma.resource.findMany({ orderBy: [{ tier: 'asc' }, { createdAt: 'desc' }] })
  return NextResponse.json(resources)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { title, description, fileUrl, category, tier } = await req.json()
  const resource = await prisma.resource.create({ data: { title, description, fileUrl, category, tier } })
  return NextResponse.json(resource, { status: 201 })
}
