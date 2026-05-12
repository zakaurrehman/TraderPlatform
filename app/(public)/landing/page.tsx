import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StarDisplay } from '@/components/StarRating'

async function getData() {
  const [reviews, signals] = await Promise.all([
    prisma.review.findMany({ where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.signalStat.findMany({ orderBy: { month: 'desc' }, take: 3 })
  ])
  return { reviews, signals }
}

export default async function LandingPage() {
  const { reviews, signals } = await getData()

  type ServiceItem = {
    name: string; price: string; period: string; desc: string; features: string[]
    color: string; border: string; originalPrice?: string; badge?: string; highlight?: boolean; disabled?: boolean
  }

  const services: ServiceItem[] = [
    {
      name: 'Basic Training', originalPrice: '$37.70', price: '$30', period: 'one-time',
      desc: 'Start your Forex journey with solid fundamentals',
      features: ['Forex fundamentals course', 'Chart reading basics', 'Risk management guide', 'Community access', 'Email support'],
      color: '#111118', border: '1px solid rgba(255,255,255,0.07)'
    },
    {
      name: 'Advanced Trading Strategies', originalPrice: '$128.70', price: '$103', period: 'one-time',
      desc: 'Master proven strategies used by professional traders',
      features: ['All Basic features', 'Advanced technical analysis', 'Entry & exit strategies', 'Weekly live sessions', 'Priority support', 'Strategy playbooks'],
      badge: 'Most Popular', highlight: true,
      color: 'linear-gradient(145deg, #f5c518, #e0a800)', border: 'none'
    },
    {
      name: 'Mastery Bundle', originalPrice: '$154.70', price: '$124', period: 'one-time',
      desc: 'The complete path to consistent profitability',
      features: ['All Advanced features', 'Full course library access', 'Exclusive masterclasses', 'Trade review sessions', 'Lifetime updates', '1-on-1 onboarding call'],
      badge: 'Best Value', color: '#111118', border: '1px solid rgba(245,197,24,0.2)'
    },
    {
      name: 'Premium Signals', originalPrice: '$63.70', price: '$51', period: 'per month',
      desc: 'Daily professional trade signals with full analysis',
      features: ['Daily forex signals', 'XAU/USD & major pairs', 'Entry, TP & SL included', 'Telegram delivery', 'Win rate tracking'],
      color: '#111118', border: '1px solid rgba(255,255,255,0.07)'
    },
    {
      name: 'Personal Mentorship', originalPrice: '$258.70', price: '$207', period: 'one-time',
      desc: 'Direct 1-on-1 coaching with Shafy himself',
      features: ['All Mastery Bundle features', '4 private mentorship calls', 'Personalized trade plan', 'Psychology coaching', 'Direct mentor access', 'Portfolio review'],
      color: '#111118', border: '1px solid rgba(255,255,255,0.07)'
    },
    {
      name: 'Trading Bot', price: 'TBA', period: 'coming soon',
      desc: 'Automated signal execution on your account',
      features: ['Automated trade execution', 'Custom strategy config', 'Risk management built-in', 'Performance analytics', '24/7 market monitoring'],
      color: '#111118', border: '1px solid rgba(255,255,255,0.05)', disabled: true
    }
  ]

  return (
    <div style={{ background: '#0a0a0f', color: '#e2e8f0', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(245,197,24,0.1)', padding: '0 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>
            ⚡ Trade with Shafy
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login" style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(245,197,24,0.3)', color: '#f5c518', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Login</Link>
            <Link href="/register" style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #f5c518, #c9a000)', color: '#0a0a0f', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#f5c518', fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>PROFESSIONAL FOREX EDUCATION & SIGNALS</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-2px' }}>
          Trade Smarter.<br />
          <span style={{ background: 'linear-gradient(135deg, #f5c518, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earn More.</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
          Join thousands of traders learning ICT concepts, receiving live Forex signals, and building consistent profits with Shafy&apos;s proven methodology.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ padding: '14px 32px', borderRadius: 10, background: 'linear-gradient(135deg, #f5c518, #c9a000)', color: '#0a0a0f', textDecoration: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 4px 20px rgba(245,197,24,0.3)' }}>Start Learning Free →</Link>
          <Link href="/order" style={{ padding: '14px 32px', borderRadius: 10, border: '1px solid rgba(245,197,24,0.3)', color: '#f5c518', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Get Live Signals</Link>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'rgba(245,197,24,0.05)', borderTop: '1px solid rgba(245,197,24,0.08)', borderBottom: '1px solid rgba(245,197,24,0.08)', padding: '28px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, textAlign: 'center' }}>
          {[
            { value: '80%+', label: 'Win Rate' },
            { value: '5000+', label: 'Active Traders' },
            { value: '50%', label: 'Affiliate Commission' },
            { value: '24/7', label: 'Signal Coverage' }
          ].map(s => (
            <div key={s.label}>
              <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 28 }}>{s.value}</div>
              <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Signal Performance */}
      {signals.length > 0 && (
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Live Signal Performance</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 36 }}>Real results from our trading signals</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {signals.map(s => (
              <div key={s.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>{s.month}</div>
                  <div style={{ color: '#f5c518', fontWeight: 800, fontSize: 18 }}>{s.winRate}% WR</div>
                </div>
                <div style={{ background: 'rgba(245,197,24,0.08)', borderRadius: 8, height: 8, marginBottom: 16 }}>
                  <div style={{ background: 'linear-gradient(90deg,#f5c518,#00ff88)', height: '100%', borderRadius: 8, width: `${s.winRate}%` }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'rgba(0,200,81,0.08)', border: '1px solid rgba(0,200,81,0.15)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ color: '#64748b', fontSize: 11 }}>Pips Gained</div>
                    <div style={{ color: '#00c851', fontWeight: 800, fontSize: 20 }}>+{s.pipsGained}</div>
                  </div>
                  <div style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ color: '#64748b', fontSize: 11 }}>Total Signals</div>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>{s.totalSignals}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section style={{ padding: '60px 20px', maxWidth: 1140, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Choose Your Plan</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 8 }}>From beginner fundamentals to personal mentorship</p>
        <p style={{ textAlign: 'center', color: '#f5c518', fontSize: 13, fontWeight: 700, marginBottom: 36 }}>🔥 Limited time — 20% off all plans</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {services.map(svc => {
            const isHighlight = !!svc.highlight
            const textColor = isHighlight ? '#0a0a0f' : '#f0f0f0'
            const subColor = isHighlight ? 'rgba(0,0,0,0.6)' : '#64748b'
            const featureColor = isHighlight ? 'rgba(0,0,0,0.7)' : '#94a3b8'
            const checkColor = isHighlight ? '#0a0a0f' : '#f5c518'
            return (
              <div key={svc.name} style={{
                background: svc.color, border: svc.border, borderRadius: 18,
                padding: '28px 24px', position: 'relative',
                opacity: svc.disabled ? 0.65 : 1,
                boxShadow: isHighlight ? '0 8px 40px rgba(245,197,24,0.35)' : '0 2px 12px rgba(0,0,0,0.3)',
                transform: isHighlight ? 'scale(1.03)' : 'scale(1)',
                zIndex: isHighlight ? 1 : 0
              }}>
                {svc.badge && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: isHighlight ? '#0a0a0f' : 'linear-gradient(135deg,#f5c518,#c9a000)',
                    color: isHighlight ? '#f5c518' : '#0a0a0f',
                    fontSize: 11, fontWeight: 800, padding: '5px 16px', borderRadius: 20,
                    whiteSpace: 'nowrap', letterSpacing: 0.5
                  }}>{svc.badge}</div>
                )}
                {/* Discount row */}
                {svc.originalPrice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: subColor, fontSize: 13, textDecoration: 'line-through' }}>{svc.originalPrice}</span>
                    <span style={{ background: isHighlight ? 'rgba(0,0,0,0.25)' : 'rgba(245,197,24,0.15)', color: isHighlight ? '#0a0a0f' : '#f5c518', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>20% OFF</span>
                  </div>
                )}
                <div style={{ color: textColor, fontWeight: 800, fontSize: 20, marginBottom: 2 }}>{svc.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                  {svc.price === 'TBA' ? (
                    <span style={{ color: textColor, fontWeight: 900, fontSize: 34 }}>TBA</span>
                  ) : (
                    <>
                      <span style={{ color: textColor, fontWeight: 900, fontSize: 34 }}>${svc.price.replace('$', '')}</span>
                      <span style={{ color: subColor, fontSize: 13 }}>/{svc.period}</span>
                    </>
                  )}
                </div>
                <div style={{ color: subColor, fontSize: 13, marginBottom: 18, lineHeight: 1.5 }}>{svc.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 22 }}>
                  {svc.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, color: featureColor, fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: checkColor, fontWeight: 700, fontSize: 14 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                {!svc.disabled ? (
                  <Link href="/order" style={{
                    display: 'block', textAlign: 'center', padding: '12px',
                    borderRadius: 10,
                    background: isHighlight ? '#0a0a0f' : 'linear-gradient(135deg,#f5c518,#c9a000)',
                    color: isHighlight ? '#f5c518' : '#0a0a0f',
                    textDecoration: 'none', fontWeight: 800, fontSize: 15,
                    border: isHighlight ? '2px solid rgba(0,0,0,0.2)' : 'none'
                  }}>Get Started</Link>
                ) : (
                  <div style={{ textAlign: 'center', padding: '12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', color: '#475569', fontSize: 14 }}>Coming Soon</div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '60px 20px', background: 'rgba(245,197,24,0.03)', borderTop: '1px solid rgba(245,197,24,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Why Trade with Shafy?</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 40 }}>Everything you need to become a consistently profitable trader</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { icon: '⚡', title: 'Real-Time Signals', desc: 'Live BUY/SELL signals with exact Entry, TP1, TP2 and SL levels delivered instantly.' },
              { icon: '📚', title: 'Structured Courses', desc: 'Step-by-step curriculum from Beginner to Master including COT research methodology.' },
              { icon: '📊', title: 'Proven Track Record', desc: 'Full signal history with transparent win rates, pip counts and monthly performance.' },
              { icon: '🌍', title: 'Economic Calendar', desc: 'Never miss a high-impact event. NFP, FOMC, CPI alerts built right into the platform.' },
              { icon: '🤝', title: '50% Affiliate Commission', desc: 'Refer friends and earn 50% commission on every sale they make. No cap.' },
              { icon: '🏆', title: 'Community & Leaderboard', desc: 'Learn alongside other traders, share analysis, and compete on the monthly leaderboard.' }
            ].map(f => (
              <div key={f.title} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Trader Reviews</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 36 }}>What our community says</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 14, padding: 20 }}>
                <StarDisplay rating={r.rating} />
                <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: '12px 0' }}>&quot;{r.content}&quot;</p>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#f5c518' }}>{r.clientName}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Affiliate CTA */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(0,200,81,0.05))', borderTop: '1px solid rgba(245,197,24,0.1)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Earn While You Learn</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
            Refer traders to Trade with Shafy and earn <strong style={{ color: '#00c851' }}>50% commission</strong> on every subscription. No limit. No minimum. Withdraw anytime.
          </p>
          <Link href="/register" style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 10, background: 'linear-gradient(135deg, #00c851, #009940)', color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 4px 20px rgba(0,200,81,0.3)' }}>Become an Affiliate →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#07070c', borderTop: '1px solid rgba(245,197,24,0.08)', padding: '40px 20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 18, marginBottom: 10 }}>⚡ Trade with Shafy</div>
            <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.6 }}>Professional Forex education, live signals, and a thriving community of traders.</p>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: 12 }}>Platform</div>
            {[['Research', '/research'], ['Signals', '/signals'], ['Classroom', '/classroom'], ['Community', '/community']].map(([l, h]) => (
              <Link key={l} href={h} style={{ display: 'block', color: '#475569', textDecoration: 'none', fontSize: 13, marginBottom: 6 }}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: 12 }}>Affiliate</div>
            {[['Register', '/register'], ['Login', '/login'], ['Order a Plan', '/order'], ['Leave a Review', '/reviews']].map(([l, h]) => (
              <Link key={l} href={h} style={{ display: 'block', color: '#475569', textDecoration: 'none', fontSize: 13, marginBottom: 6 }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, textAlign: 'center', color: '#334155', fontSize: 12 }}>
          © {new Date().getFullYear()} Trade with Shafy. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
