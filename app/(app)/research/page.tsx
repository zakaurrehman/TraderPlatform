import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

const CATEGORIES = ['All', 'Forex', 'Gold', 'Crypto', 'Stocks', 'Indices', 'Crude Oil']

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const session = await getServerSession(authOptions)
  const params = await searchParams
  const cat = params.cat
  const userPlan = session?.user.plan || 'FREE'
  const isPremium = userPlan === 'PREMIUM'

  const posts = await prisma.researchPost.findMany({
    where: {
      published: true,
      ...(cat && cat !== 'All' ? { category: cat } : {})
    },
    include: { author: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' },
    take: 30
  })

  return (
    <div style={{ padding: '0 0 8px' }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h1 style={{ fontWeight: 800, fontSize: 20, color: '#10131a' }}>Market Research</h1>
          <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#2563eb', fontWeight: 700 }}>
            {userPlan}
          </div>
        </div>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <Link key={c} href={c === 'All' ? '/research' : `/research?cat=${c}`} style={{
              display: 'inline-block', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: (!cat && c === 'All') || cat === c ? 'rgba(37,99,235,0.15)' : 'rgba(16,19,26,0.05)',
              color: (!cat && c === 'All') || cat === c ? '#2563eb' : '#7a8494',
              border: `1px solid ${(!cat && c === 'All') || cat === c ? 'rgba(37,99,235,0.3)' : 'rgba(16,19,26,0.06)'}`,
              textDecoration: 'none', whiteSpace: 'nowrap'
            }}>{c}</Link>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div style={{ padding: '12px 16px' }}>
        {posts.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: '40px 0' }}>No posts yet.</div>}
        {posts.map(post => {
          const locked = post.isPremium && !isPremium
          return (
            <Link key={post.id} href={locked ? '/order' : `/research/${post.id}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 12 }}>
              <div style={{ background: '#ffffff', border: `1px solid ${locked ? 'rgba(16,19,26,0.06)' : 'rgba(37,99,235,0.08)'}`, borderRadius: 12, overflow: 'hidden', opacity: locked ? 0.75 : 1 }}>
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', filter: locked ? 'blur(2px)' : 'none' }} />}
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{post.category}</span>
                    {post.isPremium && <span style={{ background: 'rgba(168,85,247,0.15)', color: '#7c3aed', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>PREMIUM</span>}
                    {locked && <span style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>Locked</span>}
                  </div>
                  <h3 style={{ color: locked ? '#7a8494' : '#10131a', fontWeight: 700, fontSize: 15, lineHeight: 1.4, marginBottom: 6 }}>{post.title}</h3>
                  {!locked && <p style={{ color: '#7a8494', fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>{post.content.slice(0, 100)}...</p>}
                  {locked && (
                    <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 8 }}>
                      <p style={{ color: '#7c3aed', fontSize: 12, fontWeight: 600 }}>PREMIUM plan required · Tap to upgrade →</p>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9aa3b2', fontSize: 11 }}>by {post.author.fullName}</span>
                    <span style={{ color: '#9aa3b2', fontSize: 11 }}>{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
