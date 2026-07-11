import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { StarDisplay } from '@/components/StarRating'
import CountdownTimer from '@/components/CountdownTimer'
import FAQSection from '@/components/FAQSection'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Reveal from '@/components/ui/Reveal'
import Counter from '@/components/ui/Counter'
import { Button } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/brand/icons'

async function getData() {
  const [reviews, signals] = await Promise.all([
    prisma.review.findMany({ where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.signalStat.findMany({ orderBy: { month: 'desc' }, take: 3 }),
  ])
  return { reviews, signals }
}

const FALLBACK_REVIEWS = [
  { id: 'f1', clientName: 'Ahmad K.', rating: 5, content: 'Shafy\'s ICT methodology changed the way I see the market. I went from losing consistently to hitting TP2 on most signals. The course content is world-class.' },
  { id: 'f2', clientName: 'Sara M.', rating: 5, content: 'The Premium Signals are incredible. Clear entry, TP and SL levels every time. I made back the subscription cost in the first week. Highly recommend.' },
  { id: 'f3', clientName: 'James O.', rating: 5, content: 'Best Forex mentor I\'ve found online. The community is active, the signals are accurate, and the 50% affiliate program is a great bonus.' },
]

/* ── Local presentational helpers ─────────────────────────────────────────── */
function SectionHeading({ eyebrow, title, subtitle, center = true }: { eyebrow: string; title: React.ReactNode; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? 'text-center max-w-2xl mx-auto' : ''}>
      <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
      <Reveal delay={60}><h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-ink">{title}</h2></Reveal>
      {subtitle && <Reveal delay={120}><p className="mt-3 text-muted text-[15px] leading-relaxed">{subtitle}</p></Reveal>}
    </div>
  )
}

function IconTile({ name, tone = 'primary' }: { name: IconName; tone?: 'primary' | 'green' }) {
  const isPrimary = tone === 'primary'
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{
        background: isPrimary ? 'var(--primary-tint)' : 'var(--success-tint)',
        border: `1px solid ${isPrimary ? 'var(--primary-line)' : 'rgba(22,163,74,0.24)'}`,
        color: isPrimary ? 'var(--color-primary)' : 'var(--color-success)',
      }}
    >
      <Icon name={name} size={22} />
    </div>
  )
}

export default async function LandingPage() {
  const { reviews, signals } = await getData()
  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS

  type ServiceItem = {
    name: string; price: string; period: string; desc: string; features: string[]
    originalPrice?: string; badge?: string; highlight?: boolean; disabled?: boolean; monthly?: boolean
  }

  const services: ServiceItem[] = [
    { name: 'Basic Training', originalPrice: '$37.70', price: '$30', period: 'one-time', desc: 'Start your Forex journey with solid fundamentals', features: ['Forex fundamentals course', 'Chart reading basics', 'Risk management guide', 'Community access', 'Email support'] },
    { name: 'Advanced Trading Strategies', originalPrice: '$128.70', price: '$103', period: 'one-time', desc: 'Master proven strategies used by professional traders', features: ['All Basic features', 'Advanced technical analysis', 'Entry & exit strategies', 'Weekly live sessions', 'Priority support', 'Strategy playbooks'], badge: 'Most Popular', highlight: true },
    { name: 'Mastery Bundle', originalPrice: '$154.70', price: '$124', period: 'one-time', desc: 'The complete path to consistent profitability', features: ['All Advanced features', 'Full course library access', 'Exclusive masterclasses', 'Trade review sessions', 'Lifetime updates', '1-on-1 onboarding call'], badge: 'Best Value' },
    { name: 'Premium Signals', originalPrice: '$63.70', price: '$51', period: 'per month', desc: 'Daily professional trade signals with full analysis', features: ['Daily forex signals', 'XAU/USD & major pairs', 'Entry, TP & SL included', 'Telegram delivery', 'Win rate tracking'] },
    { name: 'Personal Mentorship', originalPrice: '$258.70', price: '$207', period: 'one-time', desc: 'Direct 1-on-1 coaching with Shafy himself', features: ['All Mastery Bundle features', '4 private mentorship calls', 'Personalized trade plan', 'Psychology coaching', 'Direct mentor access', 'Portfolio review'] },
    { name: 'Trading Bot', price: 'TBA', period: 'coming soon', desc: 'Automated signal execution on your account', features: ['Automated trade execution', 'Custom strategy config', 'Risk management built-in', 'Performance analytics', '24/7 market monitoring'], disabled: true },
  ]

  const pairs = [
    { pair: 'XAU/USD', flag: '🥇', hot: true }, { pair: 'EUR/USD', flag: '🇪🇺' }, { pair: 'GBP/USD', flag: '🇬🇧' },
    { pair: 'USD/JPY', flag: '🇯🇵' }, { pair: 'GBP/JPY', flag: '🇬🇧' }, { pair: 'USD/CHF', flag: '🇨🇭' },
    { pair: 'AUD/USD', flag: '🇦🇺' }, { pair: 'USD/CAD', flag: '🇨🇦' },
  ]

  return (
    <div className="bg-canvas text-ink min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="relative isolate overflow-hidden">
        {/* background decoration */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-60 mask-fade-b" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full blur-3xl animate-float-slow"
               style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.16), transparent 62%)' }} />
          <div className="absolute top-24 -left-24 w-[380px] h-[380px] rounded-full blur-3xl animate-float"
               style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.08), transparent 65%)' }} />
        </div>

        <div className="container-x pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <Reveal>
            <span className="eyebrow">
              <span className="w-1.5 h-1.5 rounded-full bg-primary live-dot" /> Professional Forex Education &amp; Signals
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 mx-auto max-w-4xl text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight">
              Trade Smarter.<br />
              <span className="text-gradient">Earn With Confidence.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 mx-auto max-w-2xl text-muted text-[clamp(1rem,2.2vw,1.2rem)] leading-relaxed">
              Join thousands of traders learning ICT &amp; Smart Money Concepts, receiving live Forex signals, and building
              consistent profits with Shafy&apos;s proven methodology.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="#pricing" size="lg" iconRight="arrowRight">View Plans</Button>
              <Button href="/order" size="lg" variant="outline" icon="activity">Get Live Signals</Button>
            </div>
          </Reveal>

          {/* store badges */}
          <Reveal delay={280}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="https://apps.apple.com/us/app/trade-with-shafy/id6772309277" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2.5 px-5 h-[52px] rounded-xl bg-black border border-line-strong hover:border-white/30 transition-colors">
                <Icon name="apple" size={24} className="text-white" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-muted">Download on the</span>
                  <span className="block text-[17px] font-semibold text-white">App Store</span>
                </span>
              </a>
              <span className="inline-flex items-center gap-2.5 px-5 h-[52px] rounded-xl bg-surface border border-line opacity-60 cursor-not-allowed">
                <Icon name="play" size={22} className="text-dim" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-dim">Coming soon to</span>
                  <span className="block text-[17px] font-semibold text-muted">Google Play</span>
                </span>
              </span>
            </div>
          </Reveal>

          {/* trust chips */}
          <Reveal delay={340}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-dim text-[13px]">
              {[
                { icon: 'star' as IconName, label: '4.9/5 Rating' },
                { icon: 'users' as IconName, label: '5,000+ Traders' },
                { icon: 'lock' as IconName, label: 'Secure Payments' },
                { icon: 'phone' as IconName, label: 'Instant Access' },
              ].map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1.5">
                  <Icon name={t.icon} size={15} className="text-primary" /> {t.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* pairs ticker */}
        <div className="ticker relative border-y border-line py-4 mask-fade-edges" style={{ background: 'rgba(16,19,26,0.02)' }}>
          <div className="ticker-track gap-3 pr-3">
            {[...pairs, ...pairs].map((p, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold shrink-0"
                    style={p.hot
                      ? { background: 'var(--primary-tint)', borderColor: 'var(--primary-line)', color: 'var(--color-primary)' }
                      : { background: 'var(--color-surface)', borderColor: 'var(--color-line)', color: 'var(--color-muted)' }}>
                <span>{p.flag}</span>{p.pair}
                {p.hot && <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded" style={{ background: 'var(--color-primary)', color: '#ffffff' }}>HOT</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="border-b border-line" style={{ background: 'rgba(37,99,235,0.03)' }}>
        <div className="container-x py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { node: <><Counter to={80} suffix="%+" /></>, label: 'Signal Win Rate' },
              { node: <><Counter to={5000} suffix="+" /></>, label: 'Active Traders' },
              { node: <><Counter to={50} suffix="%" /></>, label: 'Affiliate Commission' },
              { node: <>24/7</>, label: 'Signal Coverage' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div>
                  <div className="text-gradient font-extrabold text-[clamp(1.6rem,4vw,2.1rem)] font-display">{s.node}</div>
                  <div className="text-dim text-[13px] mt-1">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="container-x py-20 md:py-24">
        <SectionHeading eyebrow="How It Works" title="Start Trading in 3 Simple Steps" subtitle="From registration to your first profitable trade in days, not months" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { step: '01', icon: 'target' as IconName, title: 'Choose Your Plan', desc: 'Pick a course or signal plan that matches your level — beginner, intermediate, or pro. Instant access after payment confirmation.' },
            { step: '02', icon: 'bookOpen' as IconName, title: 'Learn & Receive Signals', desc: 'Access structured courses, live trading sessions, and daily BUY/SELL signals with precise Entry, TP1, TP2 and Stop Loss levels.' },
            { step: '03', icon: 'trendingUp' as IconName, title: 'Trade & Earn Consistently', desc: 'Apply what you\'ve learned, follow the signals, manage your risk, and build a consistent record with our community.' },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 90}>
              <div className="card card-hover relative h-full p-7 overflow-hidden">
                <span className="absolute top-4 right-5 font-display font-extrabold text-6xl leading-none" style={{ color: 'rgba(37,99,235,0.07)' }}>{s.step}</span>
                <IconTile name={s.icon} />
                <div className="text-primary text-[11px] font-bold tracking-widest mt-5 mb-2">STEP {s.step}</div>
                <h3 className="text-ink font-semibold text-lg mb-2.5">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ MEET SHAFY ══ */}
      <section id="about" className="border-y border-line" style={{ background: 'rgba(37,99,235,0.02)' }}>
        <div className="container-x py-20 md:py-24">
          <div className="grid gap-12 md:gap-16 items-center md:grid-cols-[minmax(220px,320px)_1fr]">
            <Reveal className="text-center">
              <div className="relative mx-auto w-[220px] h-[220px]">
                <div aria-hidden className="absolute inset-0 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.35), transparent 70%)' }} />
                <div className="relative w-full h-full rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 5px rgba(37,99,235,0.22), var(--shadow-lift)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/shafy.jpeg" alt="Shafqat Rafique" loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ objectPosition: 'top' }} />
                </div>
              </div>
              <div className="text-primary font-bold text-xl font-display mt-5">Shafqat Rafique</div>
              <div className="text-dim text-[13px] mt-1">Professional Forex Trader &amp; Mentor</div>
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {['ICT Concepts', 'Smart Money', 'XAU/USD'].map((t) => (
                  <span key={t} className="pill" style={{ background: 'var(--primary-tint)', border: '1px solid var(--primary-line)', color: 'var(--color-primary)' }}>{t}</span>
                ))}
              </div>
            </Reveal>

            <div className="text-center md:text-left">
              <Reveal><span className="eyebrow">Meet Your Mentor</span></Reveal>
              <Reveal delay={70}>
                <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-ink leading-tight">Trading is a Skill.<br />I&apos;ll Help You Master It.</h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-5 text-muted text-[15px] leading-[1.8] text-left">
                  With years of full-time Forex trading experience, Shafy has developed a methodology rooted in{' '}
                  <strong className="text-primary font-semibold">ICT (Inner Circle Trader) concepts</strong> and{' '}
                  <strong className="text-primary font-semibold">Smart Money trading</strong> — tracking institutional order flow, liquidity sweeps,
                  and market structure to predict high-probability moves.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-4 text-muted text-[15px] leading-[1.8] text-left">
                  After years of research and refining his edge, Shafy now shares his exact strategy, live signals, and weekly sessions with a
                  growing community of 5,000+ traders worldwide — from complete beginners to funded prop traders.
                </p>
              </Reveal>
              <Reveal delay={260}>
                <div className="mt-7 grid grid-cols-3 gap-3">
                  {[{ value: '8+', label: 'Years Trading' }, { value: '80%+', label: 'Signal Accuracy' }, { value: '5K+', label: 'Students Taught' }].map((s) => (
                    <div key={s.label} className="card2 text-center py-4">
                      <div className="text-gradient font-extrabold text-xl font-display">{s.value}</div>
                      <div className="text-dim text-xs mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIGNAL PERFORMANCE ══ */}
      <section id="signals" className="container-x py-20 md:py-24">
        <SectionHeading eyebrow="Live Performance" title="Verified Signal Performance" subtitle="Transparent monthly results — no cherry-picking" />
        <div className="mt-12">
          {signals.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {signals.map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <div className="card card-hover p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted text-sm">{s.month}</span>
                      <span className="text-primary font-bold text-lg tabular">{s.winRate}% WR</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-5" style={{ background: 'var(--primary-tint)' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.winRate}%`, background: 'var(--grad-primary)' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg px-3 py-2.5" style={{ background: 'var(--success-tint)', border: '1px solid rgba(22,163,74,0.18)' }}>
                        <div className="text-dim text-[11px]">Pips Gained</div>
                        <div className="text-success font-bold text-xl tabular">+{s.pipsGained}</div>
                      </div>
                      <div className="rounded-lg px-3 py-2.5" style={{ background: 'rgba(16,19,26,0.045)', border: '1px solid var(--color-line)' }}>
                        <div className="text-dim text-[11px]">Total Signals</div>
                        <div className="text-ink font-bold text-xl tabular">{s.totalSignals}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="overflow-x-auto">
                <div className="card p-0 overflow-hidden min-w-[460px]">
                  <div className="grid grid-cols-5 px-6 py-3.5 text-primary text-xs font-bold" style={{ background: 'var(--primary-tint)', borderBottom: '1px solid var(--primary-line)' }}>
                    {['Month', 'Signals', 'Wins', 'Win Rate', 'Pips'].map((h) => <div key={h}>{h}</div>)}
                  </div>
                  {[['Apr 2025', '38', '32', '84%', '+487'], ['Mar 2025', '41', '34', '83%', '+512'], ['Feb 2025', '35', '29', '83%', '+441']].map(([m, sg, w, wr, p]) => (
                    <div key={m} className="grid grid-cols-5 px-6 py-3.5 text-sm border-b border-line last:border-0">
                      <div className="text-muted">{m}</div>
                      <div className="text-ink tabular">{sg}</div>
                      <div className="text-success tabular">{w}</div>
                      <div className="text-primary font-bold tabular">{wr}</div>
                      <div className="text-success font-bold tabular">{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ══ SAMPLE SIGNAL ══ */}
      <section className="container-x pb-20 md:pb-24">
        <SectionHeading eyebrow="What You Receive" title="This Is What a Signal Looks Like" subtitle="Every signal includes full trade details — no guesswork" />
        <div className="mt-12 grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto items-center">
          <Reveal>
            <div className="card p-6 glow-green" style={{ borderColor: 'rgba(22,163,74,0.24)' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-success text-[11px] font-bold tracking-widest inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" /> LIVE SIGNAL
                  </div>
                  <div className="text-ink font-extrabold text-2xl mt-1 font-display">XAU/USD</div>
                </div>
                <span className="buy-badge text-base px-5 py-2">BUY</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Entry', value: '2,345.50', color: 'text-ink' },
                  { label: 'Take Profit 1', value: '2,358.00  ·  +125 pips', color: 'text-success' },
                  { label: 'Take Profit 2', value: '2,372.00  ·  +265 pips', color: 'text-success' },
                  { label: 'Stop Loss', value: '2,335.00  ·  −105 pips', color: 'text-danger' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between px-3.5 py-2.5 rounded-lg" style={{ background: 'rgba(16,19,26,0.045)' }}>
                    <span className="text-dim text-[13px]">{r.label}</span>
                    <span className={`${r.color} font-semibold text-[13px] tabular`}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2.5 px-3.5 py-3 rounded-lg text-muted text-xs leading-relaxed" style={{ background: 'var(--success-tint)', border: '1px solid rgba(22,163,74,0.16)' }}>
                <Icon name="chart" size={16} className="text-success shrink-0 mt-0.5" />
                <span>Rationale: BOS on H4, OB retest at 2,345, LQ sweep above 2,370 expected. Risk 1% of account.</span>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-3.5">
            {[
              { icon: 'bolt' as IconName, title: 'Instant Delivery', desc: 'Signals sent to platform + Telegram the moment they are issued' },
              { icon: 'target' as IconName, title: 'Full Analysis', desc: 'Every signal includes rationale — you learn WHY, not just what' },
              { icon: 'shield' as IconName, title: 'Risk Management', desc: 'SL and position sizing guidance included with every signal' },
              { icon: 'activity' as IconName, title: 'Win Rate Tracked', desc: 'Every signal result recorded publicly. Full transparency.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="card card-hover flex gap-4 items-start p-4">
                  <IconTile name={f.icon} />
                  <div>
                    <div className="text-ink font-semibold text-[15px] mb-1">{f.title}</div>
                    <div className="text-muted text-[13px] leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="border-t border-line" style={{ background: 'rgba(37,99,235,0.02)' }}>
        <div className="container-x py-20 md:py-24">
          <SectionHeading eyebrow="Pricing Plans" title="Choose Your Plan" subtitle="From beginner fundamentals to personal mentorship" />
          <Reveal delay={150}><div className="flex justify-center mt-6"><CountdownTimer /></div></Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, i) => {
              const featured = !!svc.highlight
              return (
                <Reveal key={svc.name} delay={(i % 3) * 80}>
                  <div
                    className="relative h-full rounded-2xl p-7 card-hover"
                    style={
                      featured
                        ? { background: 'linear-gradient(var(--color-surface),var(--color-surface)) padding-box, var(--grad-primary) border-box', border: '1.5px solid transparent', boxShadow: 'var(--shadow-primary)' }
                        : { background: 'var(--color-surface)', border: '1px solid var(--color-line)', opacity: svc.disabled ? 0.68 : 1 }
                    }
                  >
                    {svc.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full whitespace-nowrap"
                           style={featured ? { background: 'var(--grad-primary)', color: '#ffffff' } : { background: 'var(--color-surface-3)', color: 'var(--color-primary)', border: '1px solid var(--primary-line)' }}>
                        {svc.badge}
                      </div>
                    )}
                    {svc.originalPrice && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-dim text-[13px] line-through">{svc.originalPrice}</span>
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md" style={{ background: 'var(--primary-tint)', color: 'var(--color-primary)' }}>20% OFF</span>
                      </div>
                    )}
                    <h3 className="text-ink font-bold text-xl">{svc.name}</h3>
                    <div className="flex items-baseline gap-1.5 mt-2 mb-2">
                      {svc.price === 'TBA'
                        ? <span className="text-ink font-extrabold text-4xl font-display">TBA</span>
                        : <><span className="text-ink font-extrabold text-4xl font-display tabular">${svc.price.replace('$', '')}</span><span className="text-dim text-[13px]">/{svc.period}</span></>}
                    </div>
                    <p className="text-muted text-[13px] leading-relaxed mb-5">{svc.desc}</p>
                    <ul className="space-y-2.5 mb-7">
                      {svc.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-muted text-[13px]">
                          <Icon name="check" size={16} className="text-primary shrink-0 mt-0.5" /> {f}
                        </li>
                      ))}
                    </ul>
                    {!svc.disabled
                      ? <Button href="/order" variant={featured ? 'primary' : 'secondary'} block>Get Started</Button>
                      : <div className="btn btn-secondary btn-block" aria-disabled="true" style={{ opacity: 0.7 }}>Coming Soon</div>}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══ */}
      <section className="container-x py-20 md:py-24">
        <SectionHeading eyebrow="Why Choose Us" title="Why Trade with Shafy?" subtitle="Everything you need to become a consistently profitable trader" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: 'bolt' as IconName, title: 'Real-Time Signals', desc: 'Live BUY/SELL signals with exact Entry, TP1, TP2 and SL levels delivered instantly to platform + Telegram.' },
            { icon: 'graduation' as IconName, title: 'ICT & SMC Courses', desc: 'Step-by-step curriculum from Beginner to Master covering ICT concepts, order blocks, FVGs and market structure.' },
            { icon: 'chart' as IconName, title: 'Proven Track Record', desc: 'Full signal history with transparent win rates, pip counts and monthly performance. Nothing hidden.' },
            { icon: 'calendar' as IconName, title: 'Economic Calendar', desc: 'Never miss a high-impact event. NFP, FOMC, CPI alerts built right into the platform.' },
            { icon: 'gift' as IconName, title: '50% Affiliate Commission', desc: 'Refer friends and earn 50% commission on every sale they make. No cap, no minimum, withdraw anytime.' },
            { icon: 'trophy' as IconName, title: 'Community & Leaderboard', desc: 'Learn alongside other traders, share analysis, post charts and compete on the monthly leaderboard.' },
          ].map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="card card-hover h-full p-6">
                <IconTile name={f.icon} />
                <h3 className="text-ink font-semibold text-[15px] mt-4 mb-2">{f.title}</h3>
                <p className="text-muted text-[13px] leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section id="reviews" className="border-y border-line" style={{ background: 'rgba(37,99,235,0.02)' }}>
        <div className="container-x py-20 md:py-24">
          <SectionHeading eyebrow="Testimonials" title="What Traders Are Saying" subtitle="Real feedback from our community of 5,000+ traders" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayReviews.map((r: { id: string; clientName: string; rating: number; content: string }, i: number) => (
              <Reveal key={r.id} delay={(i % 3) * 80}>
                <figure className="card card-hover h-full p-6 flex flex-col">
                  <Icon name="quote" size={30} className="text-primary opacity-30 mb-3" />
                  <StarDisplay rating={r.rating} />
                  <blockquote className="text-muted text-[13px] leading-[1.8] my-4 flex-1">&ldquo;{r.content}&rdquo;</blockquote>
                  <figcaption className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0" style={{ background: 'var(--grad-primary)', color: '#ffffff' }}>
                      {r.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-primary font-semibold text-sm">{r.clientName}</div>
                      <div className="text-dim text-[11px] inline-flex items-center gap-1"><Icon name="checkCircle" size={12} className="text-success" /> Verified Trader</div>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button href="/reviews" variant="outline" iconRight="arrowRight">Read All Reviews</Button>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="container-tight py-20 md:py-24">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Everything you need to know before joining" />
        <div className="mt-12"><FAQSection /></div>
      </section>

      {/* ══ AFFILIATE CTA ══ */}
      <section className="relative overflow-hidden border-t border-line">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(22,163,74,0.05))' }} />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.12), transparent 65%)' }} />
        </div>
        <div className="container-tight py-20 md:py-24 text-center">
          <Reveal>
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--success-tint)', border: '1px solid rgba(22,163,74,0.24)', color: 'var(--color-success)' }}>
              <Icon name="gift" size={30} />
            </div>
          </Reveal>
          <Reveal delay={80}><h2 className="mt-6 text-[clamp(2rem,5vw,3rem)] font-extrabold text-ink">Earn While You Learn</h2></Reveal>
          <Reveal delay={140}>
            <p className="mt-4 text-muted text-[16px] leading-relaxed max-w-xl mx-auto">
              Refer traders to Trade with Shafy and earn <strong className="text-success font-semibold">50% commission</strong> on every subscription.
              No limit. No minimum. Withdraw anytime.
            </p>
          </Reveal>
          <Reveal delay={200}><div className="mt-8"><Button href="/register" variant="success" size="lg" iconRight="arrowRight">Become an Affiliate</Button></div></Reveal>
        </div>
      </section>

      {/* ══ RISK DISCLAIMER ══ */}
      <section className="bg-canvas-2 border-t border-line">
        <div className="container-x py-6 text-center">
          <p className="text-faint text-[11px] leading-relaxed max-w-4xl mx-auto">
            <strong className="text-dim">Risk Disclaimer:</strong> Trading Forex and financial markets involves significant risk of loss and is not suitable for all
            investors. Past performance of signals is not indicative of future results. You should never invest money that you cannot afford to lose. Trade with Shafy
            provides educational content and signals for informational purposes only. We are not financial advisors. Please consult a licensed financial professional
            before making any investment decisions.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
