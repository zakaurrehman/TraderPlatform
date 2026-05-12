import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin
  const existing = await prisma.user.findUnique({ where: { username: 'admin' } })
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 12)
    await prisma.user.create({
      data: {
        fullName: 'Shafy Admin',
        email: 'admin@tradewithshafy.com',
        username: 'admin',
        password: hashed,
        role: 'ADMIN',
        status: 'APPROVED',
        plan: 'PREMIUM',
        studentId: 'MFT00001'
      }
    })
    console.log('✅ Admin created — username: admin, password: admin123')
  }

  // Sample signal stats
  const months = [
    { month: 'May 2026', winRate: 82, totalSignals: 34, pipsGained: 2850, pipsLost: 380 },
    { month: 'Apr 2026', winRate: 78, totalSignals: 41, pipsGained: 3200, pipsLost: 520 },
    { month: 'Mar 2026', winRate: 85, totalSignals: 29, pipsGained: 2100, pipsLost: 280 }
  ]

  for (const m of months) {
    const existing = await prisma.signalStat.findFirst({ where: { month: m.month } })
    if (!existing) {
      await prisma.signalStat.create({ data: m })
    }
  }
  console.log('✅ Signal stats seeded')

  // Sample signal
  const existingSignal = await prisma.signal.findFirst()
  if (!existingSignal) {
    await prisma.signal.create({
      data: { pair: 'XAU/USD', direction: 'BUY', entry: 2385.00, tp1: 2395.00, tp2: 2408.00, sl: 2370.00, notes: 'Strong demand zone. DXY weakening. Target 2395-2408.', status: 'ACTIVE' }
    })
    await prisma.signal.create({
      data: { pair: 'GBP/USD', direction: 'SELL', entry: 1.26850, tp1: 1.26200, tp2: 1.25500, sl: 1.27400, notes: 'Bearish OB rejection. H4 liquidity sweep complete.', status: 'ACTIVE' }
    })
    console.log('✅ Sample signals seeded')
  }

  // Sample review
  const existingReview = await prisma.review.findFirst()
  if (!existingReview) {
    await prisma.review.createMany({
      data: [
        { clientName: 'Ahmed K.', rating: 5, content: 'Shafy\'s signals are incredibly accurate. Made back my subscription in the first week!', status: 'APPROVED' },
        { clientName: 'Maria L.', rating: 5, content: 'The ICT concepts taught here transformed my trading. 80%+ win rate this month.', status: 'APPROVED' },
        { clientName: 'James T.', rating: 4, content: 'Great community and educational content. The live sessions are very insightful.', status: 'APPROVED' }
      ]
    })
    console.log('✅ Sample reviews seeded')
  }

  console.log('Seeding complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
