import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json([], { status: 403 })

  const sales = await prisma.sale.findMany({
    include: { affiliate: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(sales)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { affiliateId, clientName, clientEmail, amount, description } = await req.json()

  const sale = await prisma.sale.create({
    data: { affiliateId, clientName, clientEmail, amount, description },
    include: { affiliate: { select: { fullName: true } } }
  })

  await prisma.commission.create({
    data: { saleId: sale.id, affiliateId, amount: amount * 0.5 }
  })

  await prisma.notification.create({
    data: {
      userId: affiliateId,
      title: '💰 New Commission Earned!',
      message: `You earned $${(amount * 0.5).toFixed(2)} commission from a $${amount} sale.`
    }
  })

  return NextResponse.json(sale, { status: 201 })
}
