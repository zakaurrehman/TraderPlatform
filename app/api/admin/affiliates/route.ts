import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json([], { status: 403 })

  const affiliates = await prisma.user.findMany({
    where: { role: 'AFFILIATE' },
    include: {
      sales: { select: { id: true } },
      commissions: { select: { amount: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(affiliates.map(a => ({
    id: a.id,
    fullName: a.fullName,
    email: a.email,
    username: a.username,
    referralCode: a.referralCode,
    status: a.status,
    sales: a.sales.length,
    earned: a.commissions.reduce((s, c) => s + c.amount, 0),
    createdAt: a.createdAt
  })))
}
