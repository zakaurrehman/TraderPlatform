import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.communityPost.findMany({
    include: { author: { select: { fullName: true, studentId: true } }, comments: { select: { id: true } }, reactions: { select: { type: true } } },
    orderBy: { createdAt: 'desc' },
    take: 30
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content } = await req.json()
  const post = await prisma.communityPost.create({
    data: { title, content, authorId: session.user.id },
    include: { author: { select: { fullName: true, studentId: true } } }
  })
  return NextResponse.json(post, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, type } = await req.json()
  const existing = await prisma.postReaction.findUnique({ where: { postId_userId: { postId, userId: session.user.id } } })

  if (existing) {
    if (existing.type === type) {
      await prisma.postReaction.delete({ where: { id: existing.id } })
    } else {
      await prisma.postReaction.update({ where: { id: existing.id }, data: { type } })
    }
  } else {
    await prisma.postReaction.create({ data: { postId, userId: session.user.id, type } })
  }
  return NextResponse.json({ ok: true })
}
