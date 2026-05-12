import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { formatDateTime, timeAgo } from '@/lib/utils'
import CommentSection from './CommentSection'

export default async function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const userId = session?.user.id!

  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: {
      author: { select: { fullName: true, studentId: true } },
      comments: { include: { author: { select: { fullName: true, studentId: true } } }, orderBy: { createdAt: 'asc' } },
      reactions: true
    }
  })
  if (!post) notFound()

  const userReaction = post.reactions.find(r => r.userId === userId)
  const likes = post.reactions.filter(r => r.type === 'LIKE').length
  const dislikes = post.reactions.filter(r => r.type === 'DISLIKE').length

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <Link href="/community" style={{ color: '#64748b', textDecoration: 'none', fontSize: 13 }}>← Community</Link>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,197,24,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5c518', fontWeight: 800, fontSize: 14 }}>
              {post.author.fullName[0]}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700 }}>{post.author.fullName}</div>
              <div style={{ color: '#475569', fontSize: 11 }}>{post.author.studentId} · {formatDateTime(post.createdAt)}</div>
            </div>
          </div>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 10 }}>{post.title}</h1>
          {post.imageUrl && <img src={post.imageUrl} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 10 }} />}
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{post.content}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <ReactionButtons postId={post.id} likes={likes} dislikes={dislikes} userReaction={userReaction?.type} />
          </div>
        </div>

        <CommentSection postId={post.id} comments={post.comments.map(c => ({ id: c.id, content: c.content, authorName: c.author.fullName, studentId: c.author.studentId, createdAt: c.createdAt.toISOString() }))} />
      </div>
    </div>
  )
}

function ReactionButtons({ postId, likes, dislikes, userReaction }: { postId: string, likes: number, dislikes: number, userReaction?: string }) {
  return (
    <>
      <form action={async () => { 'use server'; await fetch('/api/community', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId, type: 'LIKE' }) }) }}>
        <button style={{ background: userReaction === 'LIKE' ? 'rgba(0,200,81,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${userReaction === 'LIKE' ? 'rgba(0,200,81,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '6px 12px', color: userReaction === 'LIKE' ? '#00c851' : '#64748b', cursor: 'pointer', fontSize: 13 }}>
          👍 {likes}
        </button>
      </form>
      <form action={async () => { 'use server'; await fetch('/api/community', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId, type: 'DISLIKE' }) }) }}>
        <button style={{ background: userReaction === 'DISLIKE' ? 'rgba(255,68,68,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${userReaction === 'DISLIKE' ? 'rgba(255,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '6px 12px', color: userReaction === 'DISLIKE' ? '#ff6666' : '#64748b', cursor: 'pointer', fontSize: 13 }}>
          👎 {dislikes}
        </button>
      </form>
    </>
  )
}
