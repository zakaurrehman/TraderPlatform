import { prisma } from '@/lib/prisma'
import { StarDisplay, StarPicker } from '@/components/StarRating'
import ReviewForm from './ReviewForm'

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({ where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', padding: '40px 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Trader Reviews</h1>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 40 }}>Real feedback from our community</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 48 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 14, padding: 20 }}>
              <StarDisplay rating={r.rating} />
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: '10px 0' }}>&quot;{r.content}&quot;</p>
              <div style={{ color: '#f5c518', fontWeight: 700, fontSize: 14 }}>{r.clientName}</div>
            </div>
          ))}
          {reviews.length === 0 && <div style={{ textAlign: 'center', color: '#475569', gridColumn: '1/-1', padding: 40 }}>No reviews yet. Be the first!</div>}
        </div>

        <ReviewForm />
      </div>
    </div>
  )
}
