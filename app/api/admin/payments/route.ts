import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Map service name → Plan enum value
function serviceToPlan(service: string): 'FREE' | 'BASIC' | 'PREMIUM' {
  const s = service.toLowerCase()
  if (s.includes('mentorship') || s.includes('mastery') || s.includes('advanced trading')) return 'PREMIUM'
  if (s.includes('basic') || s.includes('signal')) return 'BASIC'
  return 'BASIC'
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json([], { status: 403 })
  const payments = await prisma.paymentRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(payments)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, status, rejectedNote } = await req.json()

  const payment = await prisma.paymentRequest.update({
    where: { id },
    data: { status, rejectedNote: rejectedNote || null }
  })

  if (status === 'CONFIRMED') {
    const newPlan = serviceToPlan(payment.service)

    // Upgrade user if they have an account with this email
    const existingUser = await prisma.user.findFirst({
      where: { email: payment.clientEmail, role: { not: 'ADMIN' } }
    })

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { plan: newPlan, status: 'APPROVED' }
      })
    }

    // Resolve affiliate from referral code
    let affiliateId: string | null = null
    if (payment.referralCode) {
      const affiliate = await prisma.user.findFirst({
        where: { referralCode: payment.referralCode }
      })
      if (affiliate) affiliateId = affiliate.id
    }

    // Create sale record
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    const sale = await prisma.sale.create({
      data: {
        clientName: payment.clientName,
        clientEmail: payment.clientEmail,
        amount: payment.amount,
        description: `${payment.service} — via ${(payment as unknown as { paymentMethod?: string }).paymentMethod ?? 'Unknown'}`,
        affiliateId: affiliateId ?? adminUser!.id
      }
    })

    // Create 50% commission for the affiliate
    if (affiliateId) {
      await prisma.commission.create({
        data: {
          affiliateId,
          saleId: sale.id,
          amount: payment.amount * 0.5
        }
      })

      // Notify the affiliate
      await prisma.notification.create({
        data: {
          userId: affiliateId,
          title: 'Commission Earned!',
          message: `You earned $${(payment.amount * 0.5).toFixed(2)} commission from ${payment.clientName}'s payment for ${payment.service}.`
        }
      })
    }
  }

  return NextResponse.json(payment)
}
