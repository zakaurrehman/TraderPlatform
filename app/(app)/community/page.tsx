import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'
import CommunityPostForm from './PostForm'

export default async function CommunityPage() {
  const posts = await prisma.communityPost.findMany({
    include: {
      author: { select: { fullName: true, studentId: true } },
      comments: { select: { id: true } },
      reactions: { select: { type: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 30
  })

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(37,99,235,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: '#10131a' }}>Community</h1>
        <p style={{ color: '#7a8494', fontSize: 13, marginTop: 2 }}>Share analysis & connect with traders</p>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <CommunityPostForm />

        {posts.map(post => {
          const likes = post.reactions.filter(r => r.type === 'LIKE').length
          const dislikes = post.reactions.filter(r => r.type === 'DISLIKE').length
          return (
            <Link key={post.id} href={`/community/${post.id}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 12 }}>
              <div style={{ background: '#ffffff', border: '1px solid rgba(37,99,235,0.08)', borderRadius: 12, padding: 14 }}>
                {post.imageUrl && <img src={post.imageUrl} alt="" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    {post.author.fullName[0]}
                  </div>
                  <div>
                    <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13 }}>{post.author.fullName}</div>
                    <div style={{ color: '#9aa3b2', fontSize: 11 }}>{post.author.studentId} · {timeAgo(post.createdAt)}</div>
                  </div>
                </div>
                <h3 style={{ color: '#10131a', fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 6 }}>{post.title}</h3>
                <p style={{ color: '#7a8494', fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{post.content.slice(0, 120)}{post.content.length > 120 ? '...' : ''}</p>
                <div style={{ display: 'flex', gap: 16, color: '#9aa3b2', fontSize: 12 }}>
                  <span>👍 {likes}</span>
                  <span>👎 {dislikes}</span>
                  <span>💬 {post.comments.length}</span>
                </div>
              </div>
            </Link>
          )
        })}
        {posts.length === 0 && <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 40 }}>No posts yet. Start the conversation!</div>}
      </div>
    </div>
  )
}
