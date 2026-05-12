import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const admin = searchParams.get('admin')
  const session = await getServerSession(authOptions)

  const posts = await prisma.researchPost.findMany({
    where: admin && session?.user.role === 'ADMIN' ? {} : { published: true },
    include: { author: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { title, category, content, imageUrl, isPremium } = await req.json()
  const post = await prisma.researchPost.create({
    data: { title, category, content, imageUrl: imageUrl || null, isPremium, authorId: session.user.id },
    include: { author: { select: { fullName: true } } }
  })
  return NextResponse.json(post, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id, published, isPremium } = await req.json()
  const post = await prisma.researchPost.update({ where: { id }, data: { published, isPremium } })
  return NextResponse.json(post)
}
