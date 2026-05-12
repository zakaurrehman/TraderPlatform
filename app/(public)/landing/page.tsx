import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StarDisplay } from '@/components/StarRating'
import CountdownTimer from '@/components/CountdownTimer'
import FAQSection from '@/components/FAQSection'

async function getData() {
  const [reviews, signals] = await Promise.all([
    prisma.review.findMany({ where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.signalStat.findMany({ orderBy: { month: 'desc' }, take: 3 })
  ])
  return { reviews, signals }
}

const FALLBACK_REVIEWS = [
  { id: 'f1', clientName: 'Ahmad K.', rating: 5, content: 'Shafy\'s ICT methodology changed the way I see the market. I went from losing consistently to hitting TP2 on most signals. The course content is world-class.' },
  { id: 'f2', clientName: 'Sara M.', rating: 5, content: 'The Premium Signals are incredible. Clear entry, TP and SL levels every time. I made back the subscription cost in the first week. Highly recommend.' },
  { id: 'f3', clientName: 'James O.', rating: 5, content: 'Best Forex mentor I\'ve found online. The community is active, the signals are accurate, and the 50% affiliate program is a great bonus.' },
]

export default async function LandingPage() {
  const { reviews, signals } = await getData()
  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS

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
      <style>{`.nav-link:hover { color: #f5c518 !important; }`}</style>

      {/* ── Navbar ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(245,197,24,0.1)', padding: '0 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>⚡ Trade with Shafy</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#94a3b8' }}>
              {[['About', '#about'], ['Signals', '#signals'], ['Pricing', '#pricing'], ['Reviews', '#reviews'], ['FAQ', '#faq']].map(([label, href]) => (
                <a key={label} href={href} className="nav-link" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>{label}</a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/login" style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(245,197,24,0.3)', color: '#f5c518', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Login</Link>
              <Link href="/register" style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #f5c518, #c9a000)', color: '#0a0a0f', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Register</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ padding: '90px 20px 70px', textAlign: 'center', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#f5c518', fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>PROFESSIONAL FOREX EDUCATION & SIGNALS</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-2px' }}>
          Trade Smarter.<br />
          <span style={{ background: 'linear-gradient(135deg, #f5c518, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Earn More.</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
          Join thousands of traders learning ICT &amp; Smart Money Concepts, receiving live Forex signals, and building consistent profits with Shafy&apos;s proven methodology.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          <Link href="#pricing" style={{ padding: '14px 32px', borderRadius: 10, background: 'linear-gradient(135deg, #f5c518, #c9a000)', color: '#0a0a0f', textDecoration: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 4px 20px rgba(245,197,24,0.3)' }}>View Plans →</Link>
          <Link href="/order" style={{ padding: '14px 32px', borderRadius: 10, border: '1px solid rgba(245,197,24,0.3)', color: '#f5c518', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Get Live Signals</Link>
        </div>
        {/* Trust line */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap', color: '#475569', fontSize: 13 }}>
          {['⭐ 4.9/5 Rating', '✅ 5,000+ Traders', '🔒 Secure Payments', '📱 Instant Access'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: 'rgba(245,197,24,0.05)', borderTop: '1px solid rgba(245,197,24,0.08)', borderBottom: '1px solid rgba(245,197,24,0.08)', padding: '28px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, textAlign: 'center' }}>
          {[
            { value: '80%+', label: 'Signal Win Rate' },
            { value: '5,000+', label: 'Active Traders' },
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

      {/* ── How It Works ── */}
      <section style={{ padding: '70px 20px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Start Trading in 3 Simple Steps</h2>
          <p style={{ color: '#64748b' }}>From registration to your first profitable trade in days, not months</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, position: 'relative' }}>
          {[
            { step: '01', icon: '🎯', title: 'Choose Your Plan', desc: 'Pick a course or signal plan that matches your current level — beginner, intermediate, or pro. Instant access after payment confirmation.' },
            { step: '02', icon: '📚', title: 'Learn & Receive Signals', desc: 'Access structured courses, live trading sessions, and daily BUY/SELL signals with precise Entry, TP1, TP2 and Stop Loss levels.' },
            { step: '03', icon: '💹', title: 'Trade & Earn Consistently', desc: 'Apply what you\'ve learned, follow the signals, manage your risk, and build a consistent record. Share your journey with our community.' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 40, fontWeight: 900, color: 'rgba(245,197,24,0.06)', letterSpacing: -2 }}>{s.step}</div>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ color: '#f5c518', fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 6 }}>STEP {s.step}</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 10, color: 'white' }}>{s.title}</div>
              <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Meet Shafy ── */}
      <section id="about" style={{ padding: '70px 20px', background: 'rgba(245,197,24,0.03)', borderTop: '1px solid rgba(245,197,24,0.07)', borderBottom: '1px solid rgba(245,197,24,0.07)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(200px, 320px) 1fr', gap: 48, alignItems: 'center' }}>
          {/* Avatar / Photo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 220, height: 220, borderRadius: '50%', margin: '0 auto 20px',
              boxShadow: '0 0 0 6px rgba(245,197,24,0.2), 0 8px 40px rgba(245,197,24,0.3)',
              overflow: 'hidden', flexShrink: 0
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/shafy.jpeg" alt="Shafqat Rafique" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 22 }}>Shafqat Rafique</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Professional Forex Trader & Mentor</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              {['ICT Concepts', 'Smart Money', 'XAU/USD'].map(tag => (
                <span key={tag} style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#f5c518', fontWeight: 700 }}>{tag}</span>
              ))}
            </div>
          </div>
          {/* Bio */}
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>MEET YOUR MENTOR</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>Trading is a Skill.<br />I&apos;ll Help You Master It.</h2>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              With years of full-time Forex trading experience, Shafy has developed a methodology rooted in <strong style={{ color: '#f5c518' }}>ICT (Inner Circle Trader) concepts</strong> and <strong style={{ color: '#f5c518' }}>Smart Money trading</strong> — tracking institutional order flow, liquidity sweeps, and market structure to predict high-probability moves.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
              After years of research and refining his edge, Shafy now shares his exact strategy, live signals, and weekly sessions with a growing community of 5,000+ traders worldwide — from complete beginners to funded prop traders.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { value: '8+', label: 'Years Trading' },
                { value: '80%+', label: 'Signal Accuracy' },
                { value: '5K+', label: 'Students Taught' },
              ].map(s => (
                <div key={s.label} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 22 }}>{s.value}</div>
                  <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Signal Performance ── */}
      <section id="signals" style={{ padding: '70px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>LIVE PERFORMANCE</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Verified Signal Performance</h2>
          <p style={{ color: '#64748b' }}>Transparent monthly results — no cherry-picking</p>
        </div>

        {signals.length > 0 ? (
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
        ) : (
          /* Placeholder performance table when no DB data */
          <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '12px 20px', background: 'rgba(245,197,24,0.06)', borderBottom: '1px solid rgba(245,197,24,0.08)' }}>
              {['Month', 'Signals', 'Wins', 'Win Rate', 'Pips'].map(h => <div key={h} style={{ color: '#f5c518', fontSize: 12, fontWeight: 700 }}>{h}</div>)}
            </div>
            {[
              ['Apr 2025', '38', '32', '84%', '+487'],
              ['Mar 2025', '41', '34', '83%', '+512'],
              ['Feb 2025', '35', '29', '83%', '+441'],
            ].map(([month, sigs, wins, wr, pips]) => (
              <div key={month} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ color: '#94a3b8', fontSize: 13 }}>{month}</div>
                <div style={{ color: 'white', fontSize: 13 }}>{sigs}</div>
                <div style={{ color: '#00c851', fontSize: 13 }}>{wins}</div>
                <div style={{ color: '#f5c518', fontWeight: 700, fontSize: 13 }}>{wr}</div>
                <div style={{ color: '#00c851', fontWeight: 700, fontSize: 13 }}>{pips}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Sample Signal ── */}
      <section style={{ padding: '0 20px 70px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>WHAT YOU RECEIVE</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>This Is What a Signal Looks Like</h2>
          <p style={{ color: '#64748b' }}>Every signal includes full trade details — no guesswork</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 800, margin: '0 auto' }}>
          {/* BUY Signal */}
          <div style={{ background: '#111118', border: '1px solid rgba(0,200,81,0.2)', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,200,81,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <div style={{ color: '#00c851', fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>● LIVE SIGNAL</div>
                <div style={{ color: 'white', fontWeight: 900, fontSize: 22, marginTop: 2 }}>XAU/USD</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #00c851, #009940)', color: 'white', fontWeight: 900, fontSize: 16, padding: '8px 20px', borderRadius: 10 }}>BUY</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Entry', value: '2,345.50', color: 'white' },
                { label: 'Take Profit 1', value: '2,358.00  +125 pips', color: '#00c851' },
                { label: 'Take Profit 2', value: '2,372.00  +265 pips', color: '#00c851' },
                { label: 'Stop Loss', value: '2,335.00  -105 pips', color: '#ff6666' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 13 }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 700, fontSize: 13 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(0,200,81,0.06)', border: '1px solid rgba(0,200,81,0.12)', borderRadius: 8, color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>
              📊 Rationale: BOS on H4, OB retest at 2,345, LQ sweep above 2,370 expected. Risk 1% of account.
            </div>
          </div>
          {/* Features of signals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
            {[
              { icon: '⚡', title: 'Instant Delivery', desc: 'Signals sent to platform + Telegram the moment they are issued' },
              { icon: '🎯', title: 'Full Analysis', desc: 'Every signal includes rationale — you learn WHY, not just what' },
              { icon: '📉', title: 'Risk Management', desc: 'SL and position sizing guidance included with every signal' },
              { icon: '📊', title: 'Win Rate Tracked', desc: 'Every signal result recorded publicly. Full transparency.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 12, padding: '14px 16px' }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{f.title}</div>
                  <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pairs We Trade ── */}
      <section style={{ padding: '0 20px 70px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8' }}>Pairs We Trade</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          {[
            { pair: 'XAU/USD', flag: '🥇', hot: true },
            { pair: 'EUR/USD', flag: '🇪🇺' },
            { pair: 'GBP/USD', flag: '🇬🇧' },
            { pair: 'USD/JPY', flag: '🇯🇵' },
            { pair: 'GBP/JPY', flag: '🇬🇧' },
            { pair: 'USD/CHF', flag: '🇨🇭' },
            { pair: 'AUD/USD', flag: '🇦🇺' },
            { pair: 'USD/CAD', flag: '🇨🇦' },
          ].map(({ pair, flag, hot }) => (
            <div key={pair} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
              background: hot ? 'rgba(245,197,24,0.1)' : '#111118',
              border: hot ? '1px solid rgba(245,197,24,0.3)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, fontSize: 14, fontWeight: 700,
              color: hot ? '#f5c518' : '#94a3b8'
            }}>
              <span>{flag}</span>
              <span>{pair}</span>
              {hot && <span style={{ fontSize: 10, background: '#f5c518', color: '#0a0a0f', borderRadius: 6, padding: '1px 6px', fontWeight: 800 }}>HOT</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '70px 20px', background: 'rgba(245,197,24,0.02)', borderTop: '1px solid rgba(245,197,24,0.07)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>PRICING PLANS</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Choose Your Plan</h2>
            <p style={{ color: '#64748b', marginBottom: 16 }}>From beginner fundamentals to personal mentorship</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <CountdownTimer />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
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
                      display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10,
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
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ padding: '70px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>WHY CHOOSE US</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Why Trade with Shafy?</h2>
            <p style={{ color: '#64748b' }}>Everything you need to become a consistently profitable trader</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { icon: '⚡', title: 'Real-Time Signals', desc: 'Live BUY/SELL signals with exact Entry, TP1, TP2 and SL levels delivered instantly to platform + Telegram.' },
              { icon: '📚', title: 'ICT & SMC Courses', desc: 'Step-by-step curriculum from Beginner to Master covering ICT concepts, order blocks, FVGs and market structure.' },
              { icon: '📊', title: 'Proven Track Record', desc: 'Full signal history with transparent win rates, pip counts and monthly performance. Nothing hidden.' },
              { icon: '🌍', title: 'Economic Calendar', desc: 'Never miss a high-impact event. NFP, FOMC, CPI alerts built right into the platform.' },
              { icon: '🤝', title: '50% Affiliate Commission', desc: 'Refer friends and earn 50% commission on every sale they make. No cap, no minimum, withdraw anytime.' },
              { icon: '🏆', title: 'Community & Leaderboard', desc: 'Learn alongside other traders, share analysis, post charts and compete on the monthly leaderboard.' }
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

      {/* ── Testimonials ── */}
      <section id="reviews" style={{ padding: '70px 20px', background: 'rgba(245,197,24,0.02)', borderTop: '1px solid rgba(245,197,24,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>TESTIMONIALS</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>What Traders Are Saying</h2>
            <p style={{ color: '#64748b' }}>Real feedback from our community of 5,000+ traders</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {displayReviews.map((r: { id: string; clientName: string; rating: number; content: string }) => (
              <div key={r.id} style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.08)', borderRadius: 14, padding: 22, position: 'relative' }}>
                <div style={{ color: '#f5c518', fontSize: 28, lineHeight: 1, marginBottom: 10, opacity: 0.4 }}>&ldquo;</div>
                <StarDisplay rating={r.rating} />
                <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, margin: '10px 0 14px' }}>&ldquo;{r.content}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#f5c518,#c9a000)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#0a0a0f', flexShrink: 0 }}>
                    {r.clientName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#f5c518' }}>{r.clientName}</div>
                    <div style={{ color: '#475569', fontSize: 11 }}>Verified Trader</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/reviews" style={{ color: '#f5c518', textDecoration: 'none', fontSize: 14, fontWeight: 600, border: '1px solid rgba(245,197,24,0.2)', padding: '10px 24px', borderRadius: 8 }}>Read All Reviews →</Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '70px 20px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#f5c518', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Frequently Asked Questions</h2>
          <p style={{ color: '#64748b' }}>Everything you need to know before joining</p>
        </div>
        <FAQSection />
      </section>

      {/* ── Affiliate CTA ── */}
      <section style={{ padding: '70px 20px', background: 'linear-gradient(135deg, rgba(245,197,24,0.08), rgba(0,200,81,0.05))', borderTop: '1px solid rgba(245,197,24,0.1)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Earn While You Learn</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
            Refer traders to Trade with Shafy and earn <strong style={{ color: '#00c851' }}>50% commission</strong> on every subscription. No limit. No minimum. Withdraw anytime.
          </p>
          <Link href="/register" style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 10, background: 'linear-gradient(135deg, #00c851, #009940)', color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 4px 20px rgba(0,200,81,0.3)' }}>Become an Affiliate →</Link>
        </div>
      </section>

      {/* ── Risk Disclaimer ── */}
      <section style={{ padding: '24px 20px', background: '#07070c', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#334155', fontSize: 11, lineHeight: 1.7 }}>
            <strong style={{ color: '#475569' }}>Risk Disclaimer:</strong> Trading Forex and financial markets involves significant risk of loss and is not suitable for all investors. Past performance of signals is not indicative of future results. You should never invest money that you cannot afford to lose. Trade with Shafy provides educational content and signals for informational purposes only. We are not financial advisors. Please consult a licensed financial professional before making any investment decisions.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#07070c', borderTop: '1px solid rgba(245,197,24,0.08)', padding: '48px 20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, marginBottom: 40 }}>
            <div>
              <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 18, marginBottom: 10 }}>⚡ Trade with Shafy</div>
              <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>Professional Forex education, live signals, and a thriving community of traders worldwide.</p>
              {/* Social links */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'WhatsApp', icon: '💬', href: 'https://whatsapp.com/channel/0029Vb1eRV4BPzjT2Y9X6Y0K' },
                  { label: 'Telegram', icon: '✈️', href: '#' },
                  { label: 'Instagram', icon: '📸', href: '#' },
                  { label: 'YouTube', icon: '▶️', href: '#' },
                ].map(s => (
                  <a key={s.label} href={s.href} title={s.label} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>{s.icon}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 14 }}>Platform</div>
              {[['Research', '/research'], ['Live Signals', '/signals'], ['Classroom', '/classroom'], ['Community', '/community'], ['Calculator', '/calculator']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: '#475569', textDecoration: 'none', fontSize: 13, marginBottom: 8 }}>{l}</Link>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 14 }}>Get Started</div>
              {[['Register as Affiliate', '/register'], ['Login', '/login'], ['Order a Plan', '/order'], ['Leave a Review', '/reviews']].map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', color: '#475569', textDecoration: 'none', fontSize: 13, marginBottom: 8 }}>{l}</Link>
              ))}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, marginBottom: 14 }}>Contact</div>
              <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7 }}>
                Have questions?<br />
                Reach out via Telegram or email us at<br />
                <span style={{ color: '#94a3b8' }}>shafqatrafique45978@gmail.com</span>
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: '#334155', fontSize: 12 }}>© {new Date().getFullYear()} Trade with Shafy. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[['Privacy Policy', '#'], ['Terms of Service', '#']].map(([l, h]) => (
                <a key={l} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
