import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.researchPost.findUnique({ where: { id }, include: { author: { select: { fullName: true } } } })
  if (!post) notFound()

  return (
    <div style={{ padding: '0 0 20px' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <Link href="/research" style={{ color: '#7a8494', textDecoration: 'none', fontSize: 13 }}>← Research</Link>
      </div>

      {post.imageUrl && <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover', margin: '12px 0' }} />}

      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{post.category}</span>
          {post.isPremium && <span style={{ background: 'rgba(240,180,41,0.15)', color: '#f59e0b', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⭐ Premium</span>}
        </div>
        <h1 style={{ color: '#10131a', fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 10 }}>{post.title}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa3b2', fontSize: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(16,19,26,0.06)' }}>
          <span>by {post.author.fullName}</span>
          <span>{formatDateTime(post.createdAt)}</span>
        </div>
        <div style={{ color: '#55606f', fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{post.content}</div>
      </div>
    </div>
  )
}
