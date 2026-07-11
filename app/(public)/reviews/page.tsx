import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StarDisplay } from '@/components/StarRating'
import { Logo } from '@/components/brand/Logo'
import { Icon } from '@/components/brand/icons'
import ReviewForm from './ReviewForm'

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({ where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } })

  return (
    <div className="min-h-screen bg-canvas text-ink py-10 px-5">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex mb-5"><Logo size={34} href={null} /></Link>
          <span className="eyebrow">Testimonials</span>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold mt-4">Trader Reviews</h1>
          <p className="text-muted mt-2">Real feedback from our community</p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-14">
            {reviews.map(r => (
              <figure key={r.id} className="card card-hover p-5 flex flex-col">
                <Icon name="quote" size={26} className="text-primary opacity-30 mb-2" />
                <StarDisplay rating={r.rating} />
                <blockquote className="text-muted text-[13px] leading-[1.75] my-3 flex-1">&ldquo;{r.content}&rdquo;</blockquote>
                <figcaption className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0" style={{ background: 'var(--grad-primary)', color: '#ffffff' }}>
                    {r.clientName.charAt(0)}
                  </div>
                  <div className="text-primary font-semibold text-sm">{r.clientName}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="text-center text-dim py-16 mb-8">No reviews yet. Be the first to leave one!</div>
        )}

        <ReviewForm />
      </div>
    </div>
  )
}
