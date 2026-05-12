import { prisma } from '@/lib/prisma'

export default async function BrokersPage() {
  const brokers = await prisma.broker.findMany({ where: { isActive: true }, orderBy: [{ isRecommended: 'desc' }, { rating: 'desc' }] })

  return (
    <div style={{ padding: '0 0 8px' }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(245,197,24,0.08)' }}>
        <h1 style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>Recommended Brokers</h1>
        <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Brokers personally vetted by Shafy</p>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <div style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <div style={{ color: '#f0b429', fontWeight: 700, fontSize: 13 }}>⚠️ Disclaimer</div>
          <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>These are affiliate broker links. Always do your own research. Trading involves risk and you may lose more than you invest.</p>
        </div>

        {brokers.length === 0 && <div style={{ textAlign: 'center', color: '#475569', padding: 40 }}>Broker recommendations coming soon.</div>}

        {brokers.map(broker => (
          <div key={broker.id} style={{ background: '#111118', border: `1px solid ${broker.isRecommended ? 'rgba(240,180,41,0.25)' : 'rgba(245,197,24,0.08)'}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
            {broker.isRecommended && (
              <div style={{ background: 'rgba(240,180,41,0.1)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 6, padding: '2px 8px', display: 'inline-block', marginBottom: 8 }}>
                <span style={{ color: '#f0b429', fontSize: 11, fontWeight: 700 }}>⭐ Shafy&apos;s Pick</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ color: 'white', fontWeight: 800, fontSize: 17 }}>{broker.name}</h3>
              <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <span style={{ color: '#f0b429', fontSize: 14 }}>★</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{broker.rating}</span>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{broker.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {broker.minDeposit && <span style={{ background: 'rgba(245,197,24,0.08)', color: '#94a3b8', fontSize: 11, padding: '3px 9px', borderRadius: 20 }}>Min: {broker.minDeposit}</span>}
              {broker.regulation && <span style={{ background: 'rgba(0,200,81,0.08)', color: '#00c851', fontSize: 11, padding: '3px 9px', borderRadius: 20 }}>✓ {broker.regulation}</span>}
            </div>
            <a href={broker.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Open Account →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
