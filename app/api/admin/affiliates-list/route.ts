import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json([], { status: 403 })

  const affiliates = await prisma.user.findMany({
    where: { role: 'AFFILIATE', status: 'APPROVED' },
    select: { id: true, fullName: true, username: true },
    orderBy: { fullName: 'asc' }
  })
  return NextResponse.json(affiliates)
}
