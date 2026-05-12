import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json([], { status: 403 })

  const requests = await prisma.withdrawalRequest.findMany({
    include: { affiliate: { select: { fullName: true, email: true, paymentMethod: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(requests)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, status } = await req.json()
  const request = await prisma.withdrawalRequest.update({ where: { id }, data: { status } })

  if (status === 'PAID') {
    const withdrawal = await prisma.withdrawalRequest.findUnique({ where: { id } })
    if (withdrawal) {
      const commissions = await prisma.commission.findMany({ where: { affiliateId: withdrawal.affiliateId, withdrawn: false } })
      let remaining = withdrawal.amount
      for (const c of commissions) {
        if (remaining <= 0) break
        await prisma.commission.update({ where: { id: c.id }, data: { withdrawn: true } })
        remaining -= c.amount
      }
      await prisma.notification.create({
        data: { userId: withdrawal.affiliateId, title: '✅ Withdrawal Processed', message: `Your withdrawal of $${withdrawal.amount.toFixed(2)} has been paid.` }
      })
    }
  }

  return NextResponse.json(request)
}
