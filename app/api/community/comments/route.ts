import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, content } = await req.json()
  const comment = await prisma.communityComment.create({
    data: { postId, content, authorId: session.user.id },
    include: { author: { select: { fullName: true, studentId: true } } }
  })

  return NextResponse.json({
    comment: {
      id: comment.id,
      content: comment.content,
      authorName: comment.author.fullName,
      studentId: comment.author.studentId,
      createdAt: comment.createdAt.toISOString()
    }
  }, { status: 201 })
}
