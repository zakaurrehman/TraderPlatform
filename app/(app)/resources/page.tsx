import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const TIER_ORDER = { FREE: 0, BASIC: 1, PREMIUM: 2 }
const PLAN_TIER = { FREE: 0, BASIC: 1, PREMIUM: 2 }

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions)
  const userTier = PLAN_TIER[(session?.user.plan as keyof typeof PLAN_TIER) || 'FREE']

  const resources = await prisma.resource.findMany({ orderBy: [{ tier: 'asc' }, { createdAt: 'desc' }] })

  const categories = Array.from(new Set(resources.map(r => r.category)))

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Resource Library</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Trading guides, cheat sheets & more</p>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {categories.map(cat => {
          const catResources = resources.filter(r => r.category === cat)
          return (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{cat}</div>
              {catResources.map(resource => {
                const locked = TIER_ORDER[resource.tier] > userTier
                return (
                  <div key={resource.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 12, padding: 14, marginBottom: 8, opacity: locked ? 0.7 : 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                          <span style={{ background: resource.tier === 'FREE' ? 'rgba(0,200,81,0.1)' : resource.tier === 'BASIC' ? 'rgba(245,197,24,0.1)' : 'rgba(240,180,41,0.1)', color: resource.tier === 'FREE' ? '#00c851' : resource.tier === 'BASIC' ? '#f5c518' : '#f0b429', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>{resource.tier}</span>
                          {locked && <span style={{ fontSize: 12 }}>🔒</span>}
                        </div>
                        <h3 style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{resource.title}</h3>
                        <p style={{ color: '#64748b', fontSize: 12 }}>{resource.description}</p>
                        <p style={{ color: '#334155', fontSize: 11, marginTop: 4 }}>📥 {resource.downloads} downloads</p>
                      </div>
                    </div>
                    {!locked ? (
                      <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
                        📄 Download PDF
                      </a>
                    ) : (
                      <div style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: '#475569', fontSize: 13, display: 'inline-block' }}>
                        Upgrade to {resource.tier} to unlock
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
        {resources.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>Resources coming soon!</div>}
      </div>
    </div>
  )
}
