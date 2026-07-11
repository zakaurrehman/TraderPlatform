import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions, Platform } from 'react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { Screen, colors, font, spacing, radius } from '@/components/ui'

const LOGO = require('../../assets/logo.png')
const SHAFY = require('../../assets/shafy.jpeg')

// ────────────────────────────────────────────────────────────────────────────
// All marketing copy is ported verbatim from the web /landing page
// so the brand voice stays consistent. Reviews fall back to the same
// three static testimonials the web uses when the DB is empty.
// ────────────────────────────────────────────────────────────────────────────

const TRUST = [
  '⭐ 4.9/5 Rating',
  '✅ 5,000+ Traders',
  '🔒 Secure Payments',
  '📱 Instant Access',
]

const STATS = [
  { value: '80%+', label: 'Signal Win Rate' },
  { value: '5,000+', label: 'Active Traders' },
  { value: '50%', label: 'Affiliate Commission' },
  { value: '24/7', label: 'Signal Coverage' },
]

const STEPS = [
  { step: '01', icon: '🎯', title: 'Choose Your Plan', desc: 'Pick a course or signal plan that matches your level — beginner, intermediate, or pro.' },
  { step: '02', icon: '📚', title: 'Learn & Receive Signals', desc: 'Structured courses, live sessions, and daily BUY/SELL signals with precise Entry, TP and SL levels.' },
  { step: '03', icon: '💹', title: 'Trade Consistently', desc: 'Apply what you have learned, follow the signals, manage risk, and build consistent results.' },
]

const FEATURES = [
  { icon: '⚡', title: 'Real-Time Signals', desc: 'Live BUY/SELL signals with exact Entry, TP1, TP2 and SL — delivered instantly.' },
  { icon: '📚', title: 'ICT & SMC Courses', desc: 'From beginner to master: order blocks, FVGs, market structure, smart money concepts.' },
  { icon: '📊', title: 'Proven Track Record', desc: 'Full signal history with transparent win rates and pip counts. Nothing hidden.' },
  { icon: '🌍', title: 'Economic Calendar', desc: 'NFP, FOMC, CPI alerts built into the platform.' },
  { icon: '🤝', title: '50% Affiliate Commission', desc: 'Refer friends and earn 50% on every sale they make. No cap, no minimum.' },
  { icon: '🏆', title: 'Active Community', desc: 'Learn alongside other traders, share analysis, compete on the leaderboard.' },
]

const PAIRS = [
  { pair: 'XAU/USD', flag: '🥇', hot: true },
  { pair: 'EUR/USD', flag: '🇪🇺' },
  { pair: 'GBP/USD', flag: '🇬🇧' },
  { pair: 'USD/JPY', flag: '🇯🇵' },
  { pair: 'GBP/JPY', flag: '🇬🇧' },
  { pair: 'USD/CHF', flag: '🇨🇭' },
  { pair: 'AUD/USD', flag: '🇦🇺' },
  { pair: 'USD/CAD', flag: '🇨🇦' },
]

type Plan = {
  name: string
  originalPrice?: string
  price: string
  period: string
  desc: string
  features: string[]
  badge?: string
  highlight?: boolean
  disabled?: boolean
}

const PLANS: Plan[] = [
  { name: 'Basic Training', originalPrice: '$37.70', price: '$30', period: 'one-time', desc: 'Start your Forex journey with solid fundamentals', features: ['Forex fundamentals course', 'Chart reading basics', 'Risk management guide', 'Community access', 'Email support'] },
  { name: 'Advanced Strategies', originalPrice: '$128.70', price: '$103', period: 'one-time', desc: 'Master proven strategies used by pro traders', features: ['All Basic features', 'Advanced technical analysis', 'Entry & exit strategies', 'Weekly live sessions', 'Priority support'], badge: 'Most Popular', highlight: true },
  { name: 'Mastery Bundle', originalPrice: '$154.70', price: '$124', period: 'one-time', desc: 'The complete path to consistent profitability', features: ['All Advanced features', 'Full course library access', 'Exclusive masterclasses', 'Trade review sessions', 'Lifetime updates'], badge: 'Best Value' },
  { name: 'Premium Signals', originalPrice: '$63.70', price: '$51', period: 'per month', desc: 'Daily professional trade signals with full analysis', features: ['Daily forex signals', 'XAU/USD & major pairs', 'Entry, TP & SL included', 'Telegram delivery', 'Win rate tracking'] },
  { name: 'Personal Mentorship', originalPrice: '$258.70', price: '$207', period: 'one-time', desc: 'Direct 1-on-1 coaching with Shafy himself', features: ['All Mastery features', '4 private mentorship calls', 'Personalized trade plan', 'Psychology coaching', 'Portfolio review'] },
  { name: 'Trading Bot', price: 'TBA', period: 'coming soon', desc: 'Automated signal execution on your account', features: ['Automated trade execution', 'Custom strategy config', 'Risk management built-in', 'Performance analytics'], disabled: true },
]

const REVIEWS = [
  { id: 'r1', name: 'Ahmad K.', rating: 5, content: "Shafy's ICT methodology changed the way I see the market. I went from losing consistently to hitting TP2 on most signals." },
  { id: 'r2', name: 'Sara M.', rating: 5, content: 'The Premium Signals are incredible. Clear entry, TP and SL every time. Made back the cost in the first week.' },
  { id: 'r3', name: 'James O.', rating: 5, content: 'Best Forex mentor I have found online. Community is active, signals are accurate, 50% affiliate program is a great bonus.' },
]

const FAQ = [
  { q: 'How do the signals work?', a: 'You get clear BUY/SELL signals daily with exact Entry, TP1, TP2 and SL levels plus a short rationale, delivered to the app and Telegram.' },
  { q: 'How quickly do I get access?', a: 'Within 24 hours of payment confirmation. Most users are unlocked within an hour.' },
  { q: 'What is the affiliate program?', a: 'Refer a friend with your unique code and earn 50% commission on every sale they make. No cap, no minimum, withdraw anytime.' },
  { q: 'Do I need experience?', a: 'No. Basic Training is built for total beginners and walks you through fundamentals, chart reading and risk management.' },
  { q: 'What is your refund policy?', a: 'Contact support within 7 days if you are not satisfied. Refunds are handled case-by-case once content access is reviewed.' },
]

const SOCIALS: { label: string; icon: keyof typeof Ionicons.glyphMap; url: string }[] = [
  { label: 'Instagram', icon: 'logo-instagram', url: 'https://www.instagram.com/shafqatrafiquee' },
  { label: 'WhatsApp', icon: 'logo-whatsapp', url: 'https://whatsapp.com/channel/0029Vb1eRV4BPzjT2Y9X6Y0K' },
  { label: 'YouTube', icon: 'logo-youtube', url: 'https://www.youtube.com/' },
  { label: 'Telegram', icon: 'paper-plane-outline', url: 'https://t.me/' },
]

export default function LandingScreen() {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const compact = width < 380

  return (
    <Screen edges={['top']}>
      {/* Sticky top bar */}
      <View style={styles.topbar}>
        <Image source={LOGO} style={styles.topLogo} contentFit="contain" />
        <View style={styles.topButtons}>
          <Pressable style={styles.outlineBtnSm} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.outlineBtnSmText}>Login</Text>
          </Pressable>
          <Pressable style={styles.primaryBtnSm} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.primaryBtnSmText}>Register</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroChip}>
            <Text style={styles.heroChipText}>PROFESSIONAL FOREX EDUCATION & SIGNALS</Text>
          </View>
          <Text style={styles.heroTitle}>
            Trade Smarter.{'\n'}
            <Text style={styles.heroTitleAccent}>Earn More.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Join thousands of traders learning ICT & Smart Money Concepts, receiving live
            Forex signals, and building consistent profits with Shafy&apos;s proven methodology.
          </Text>
          <View style={styles.ctaRow}>
            <Pressable
              style={styles.primaryBtn}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </Pressable>
            <Pressable
              style={styles.outlineBtn}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.outlineBtnText}>Sign In</Text>
            </Pressable>
          </View>
          <View style={styles.trustRow}>
            {TRUST.map((t) => (
              <Text key={t} style={styles.trustItem}>{t}</Text>
            ))}
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {STATS.map((s) => (
              <View key={s.label} style={[styles.statBox, compact && { width: '48%' }]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── How It Works ── */}
        <Section eyebrow="HOW IT WORKS" title="Start in 3 Simple Steps" sub="From registration to your first profitable trade in days, not months">
          {STEPS.map((s) => (
            <View key={s.step} style={styles.stepCard}>
              <Text style={styles.stepWatermark}>{s.step}</Text>
              <Text style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</Text>
              <Text style={styles.stepStepNum}>STEP {s.step}</Text>
              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          ))}
        </Section>

        {/* ── Meet Shafy ── */}
        <View style={styles.aboutSection}>
          <View style={styles.aboutInner}>
            <View style={styles.avatarWrap}>
              <Image source={SHAFY} style={styles.avatar} contentFit="cover" />
            </View>
            <Text style={styles.aboutName}>Shafqat Rafique</Text>
            <Text style={styles.aboutRole}>Professional Forex Trader & Mentor</Text>
            <View style={styles.tagsRow}>
              {['ICT Concepts', 'Smart Money', 'XAU/USD'].map((tag) => (
                <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
              ))}
            </View>
            <View style={styles.aboutChip}>
              <Text style={styles.aboutChipText}>MEET YOUR MENTOR</Text>
            </View>
            <Text style={styles.aboutHeadline}>
              Trading is a Skill.{'\n'}I&apos;ll Help You Master It.
            </Text>
            <Text style={styles.aboutBody}>
              Years of full-time Forex trading experience with a methodology rooted in
              <Text style={{ color: colors.primary, fontWeight: '700' }}> ICT </Text>
              and
              <Text style={{ color: colors.primary, fontWeight: '700' }}> Smart Money </Text>
              concepts — tracking institutional order flow, liquidity sweeps and market
              structure to predict high-probability moves.
            </Text>
            <View style={styles.miniStats}>
              {[{ v: '8+', l: 'Years Trading' }, { v: '80%+', l: 'Accuracy' }, { v: '5K+', l: 'Students' }].map((s) => (
                <View key={s.l} style={styles.miniStat}>
                  <Text style={styles.miniStatV}>{s.v}</Text>
                  <Text style={styles.miniStatL}>{s.l}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Sample Signal ── */}
        <Section eyebrow="WHAT YOU RECEIVE" title="This Is What a Signal Looks Like" sub="Every signal includes full trade details — no guesswork">
          <View style={styles.signalCard}>
            <View style={styles.signalHead}>
              <View>
                <Text style={styles.signalLive}>● LIVE SIGNAL</Text>
                <Text style={styles.signalPair}>XAU/USD</Text>
              </View>
              <View style={styles.buyBadge}>
                <Text style={styles.buyBadgeText}>BUY</Text>
              </View>
            </View>
            {[
              { l: 'Entry', v: '2,345.50', c: colors.ink },
              { l: 'Take Profit 1', v: '2,358.00  +125 pips', c: colors.green },
              { l: 'Take Profit 2', v: '2,372.00  +265 pips', c: colors.green },
              { l: 'Stop Loss', v: '2,335.00  -105 pips', c: colors.redText },
            ].map((row) => (
              <View key={row.l} style={styles.signalRow}>
                <Text style={styles.signalRowLabel}>{row.l}</Text>
                <Text style={[styles.signalRowValue, { color: row.c }]}>{row.v}</Text>
              </View>
            ))}
            <View style={styles.signalNote}>
              <Text style={styles.signalNoteText}>
                📊 Rationale: BOS on H4, OB retest at 2,345, LQ sweep above 2,370 expected. Risk 1% of account.
              </Text>
            </View>
          </View>
        </Section>

        {/* ── Pairs ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: 28 }}>
          <Text style={styles.pairsHead}>Pairs We Trade</Text>
          <View style={styles.pairsRow}>
            {PAIRS.map((p) => (
              <View key={p.pair} style={[styles.pairChip, p.hot && styles.pairChipHot]}>
                <Text style={{ fontSize: 14 }}>{p.flag}</Text>
                <Text style={[styles.pairText, p.hot && { color: colors.primary }]}>{p.pair}</Text>
                {p.hot ? <View style={styles.hotTag}><Text style={styles.hotTagText}>HOT</Text></View> : null}
              </View>
            ))}
          </View>
        </View>

        {/* ── Pricing — Android-only (Apple's IAP rule forbids non-IAP prices on iOS) ── */}
        {Platform.OS !== 'ios' ? (
          <Section eyebrow="PRICING PLANS" title="Choose Your Plan" sub="From beginner fundamentals to personal mentorship">
            {PLANS.map((p) => (
              <View
                key={p.name}
                style={[
                  styles.planCard,
                  p.highlight && styles.planCardHighlight,
                  p.disabled && { opacity: 0.6 },
                ]}
              >
                {p.badge ? (
                  <View style={[styles.planBadge, p.highlight && { backgroundColor: colors.bg }]}>
                    <Text style={[styles.planBadgeText, p.highlight && { color: colors.primary }]}>{p.badge}</Text>
                  </View>
                ) : null}
                {p.originalPrice ? (
                  <View style={styles.priceLine}>
                    <Text style={[styles.priceOld, p.highlight && { color: 'rgba(255,255,255,0.8)' }]}>{p.originalPrice}</Text>
                    <View style={[styles.discountTag, p.highlight && { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
                      <Text style={[styles.discountText, p.highlight && { color: colors.white }]}>20% OFF</Text>
                    </View>
                  </View>
                ) : null}
                <Text style={[styles.planName, p.highlight && { color: colors.white }]}>{p.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                  <Text style={[styles.planPrice, p.highlight && { color: colors.white }]}>{p.price}</Text>
                  <Text style={[styles.planPeriod, p.highlight && { color: 'rgba(255,255,255,0.8)' }]}>/{p.period}</Text>
                </View>
                <Text style={[styles.planDesc, p.highlight && { color: 'rgba(255,255,255,0.8)' }]}>{p.desc}</Text>
                {p.features.map((f) => (
                  <View key={f} style={styles.featureLine}>
                    <Text style={[styles.featureCheck, p.highlight && { color: colors.white }]}>✓</Text>
                    <Text style={[styles.featureText, p.highlight && { color: 'rgba(255,255,255,0.92)' }]}>{f}</Text>
                  </View>
                ))}
                {!p.disabled ? (
                  <Pressable
                    style={[styles.planCta, p.highlight && { backgroundColor: colors.bg }]}
                    onPress={() => router.push('/(auth)/register')}
                  >
                    <Text style={[styles.planCtaText, p.highlight && { color: colors.primary }]}>Get Started</Text>
                  </Pressable>
                ) : (
                  <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
              </View>
            ))}
          </Section>
        ) : null}

        {/* ── Why Choose ── */}
        <Section eyebrow="WHY CHOOSE US" title="Why Trade with Shafy?" sub="Everything you need to become a consistently profitable trader">
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <Text style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </Section>

        {/* ── Testimonials ── */}
        <Section eyebrow="TESTIMONIALS" title="What Traders Are Saying" sub="Real feedback from our community">
          {REVIEWS.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <Text style={styles.reviewQuote}>“</Text>
              <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}</Text>
              <Text style={styles.reviewContent}>“{r.content}”</Text>
              <View style={styles.reviewAuthor}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                </View>
                <View>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Text style={styles.reviewBadge}>Verified Trader</Text>
                </View>
              </View>
            </View>
          ))}
        </Section>

        {/* ── FAQ ── */}
        <Section eyebrow="FAQ" title="Frequently Asked Questions" sub="Everything you need to know before joining">
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </Section>

        {/* ── Affiliate CTA ── */}
        <View style={styles.affCta}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>💰</Text>
          <Text style={styles.affCtaTitle}>Earn While You Learn</Text>
          <Text style={styles.affCtaBody}>
            Refer traders and earn <Text style={{ color: colors.green, fontWeight: '800' }}>50% commission</Text>{' '}
            on every subscription. No limit, no minimum.
          </Text>
          <Pressable style={styles.affCtaBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.affCtaBtnText}>Become an Affiliate</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Pressable>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Image source={LOGO} style={styles.footerLogo} contentFit="contain" />
          <Text style={styles.footerBody}>
            Professional Forex education, live signals, and a thriving community of traders
            worldwide.
          </Text>
          <View style={styles.socialsRow}>
            {SOCIALS.map((s) => (
              <Pressable
                key={s.label}
                style={styles.socialBtn}
                onPress={() => WebBrowser.openBrowserAsync(s.url)}
              >
                <Ionicons name={s.icon} size={18} color={colors.primary} />
              </Pressable>
            ))}
          </View>
          <Text style={styles.disclaimer}>
            <Text style={{ color: colors.muted2 }}>Risk Disclaimer: </Text>
            Trading Forex involves significant risk of loss and is not suitable for all
            investors. Past performance is not indicative of future results. Trade with Shafy
            provides educational content for informational purposes only. We are not financial
            advisors.
          </Text>
          <Text style={styles.copyright}>© {new Date().getFullYear()} Trade with Shafy. All rights reserved.</Text>
        </View>
      </ScrollView>
    </Screen>
  )
}

// ── Section header helper ─────────────────────────────────────────────────────
function Section({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: spacing.lg, marginBottom: 28 }}>
      <View style={{ alignItems: 'center', marginBottom: 18 }}>
        <View style={styles.eyebrow}><Text style={styles.eyebrowText}>{eyebrow}</Text></View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSub}>{sub}</Text>
      </View>
      {children}
    </View>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <View style={styles.faqItem}>
      <Pressable style={styles.faqHead} onPress={() => setOpen((v) => !v)}>
        <Text style={styles.faqQ}>{q}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
      </Pressable>
      {open ? <Text style={styles.faqA}>{a}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(37,99,235,0.1)',
  },
  topLogo: { width: 130, height: 36 },
  topButtons: { flexDirection: 'row', gap: 8 },
  outlineBtnSm: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.3)',
  },
  outlineBtnSmText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  primaryBtnSm: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  primaryBtnSmText: { color: colors.white, fontSize: 13, fontWeight: '800' },

  // Hero
  hero: { paddingHorizontal: spacing.lg, paddingTop: 32, paddingBottom: 24, alignItems: 'center' },
  heroChip: {
    backgroundColor: 'rgba(37,99,235,0.1)',
    borderColor: 'rgba(37,99,235,0.2)',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  heroChipText: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: colors.ink, fontSize: 38, fontWeight: '900', textAlign: 'center', lineHeight: 44, letterSpacing: -0.5, marginBottom: 14 },
  heroTitleAccent: { color: colors.primary },
  heroSub: { color: colors.secondary, fontSize: font.body, lineHeight: 22, textAlign: 'center', marginBottom: 22 },
  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.3)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  outlineBtnText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  trustItem: { color: colors.muted2, fontSize: 12 },

  // Stats
  statsSection: {
    backgroundColor: 'rgba(37,99,235,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(37,99,235,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(37,99,235,0.08)',
    paddingVertical: 20,
    paddingHorizontal: spacing.lg,
    marginBottom: 32,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: 12 },
  statBox: { alignItems: 'center', flexBasis: '22%', minWidth: 70 },
  statValue: { color: colors.primary, fontWeight: '900', fontSize: 22 },
  statLabel: { color: colors.muted, fontSize: 11, marginTop: 2, textAlign: 'center' },

  // Section
  eyebrow: {
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderColor: 'rgba(37,99,235,0.15)',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  eyebrowText: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  sectionTitle: { color: colors.ink, fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  sectionSub: { color: colors.muted, fontSize: font.small, textAlign: 'center' },

  // Steps
  stepCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 18, marginBottom: 12, position: 'relative', overflow: 'hidden' },
  stepWatermark: { position: 'absolute', top: 8, right: 14, fontSize: 50, fontWeight: '900', color: 'rgba(37,99,235,0.06)' },
  stepStepNum: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  stepTitle: { color: colors.ink, fontWeight: '800', fontSize: 16, marginBottom: 6 },
  stepDesc: { color: colors.muted, fontSize: font.small, lineHeight: 19 },

  // About
  aboutSection: { backgroundColor: 'rgba(37,99,235,0.03)', borderTopWidth: 1, borderTopColor: 'rgba(37,99,235,0.07)', borderBottomWidth: 1, borderBottomColor: 'rgba(37,99,235,0.07)', paddingVertical: 32, paddingHorizontal: spacing.lg, marginBottom: 32 },
  aboutInner: { alignItems: 'center' },
  avatarWrap: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 6,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  avatar: { width: '100%', height: '100%' },
  aboutName: { color: colors.primary, fontWeight: '900', fontSize: 22 },
  aboutRole: { color: colors.muted, fontSize: font.small, marginTop: 4 },
  tagsRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' },
  tag: { backgroundColor: 'rgba(37,99,235,0.1)', borderColor: 'rgba(37,99,235,0.2)', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { color: colors.primary, fontSize: 10, fontWeight: '700' },
  aboutChip: { backgroundColor: 'rgba(37,99,235,0.08)', borderColor: 'rgba(37,99,235,0.15)', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4, marginTop: 24, marginBottom: 12 },
  aboutChipText: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  aboutHeadline: { color: colors.ink, fontSize: 22, fontWeight: '900', textAlign: 'center', lineHeight: 28, marginBottom: 14 },
  aboutBody: { color: colors.secondary, fontSize: font.body, lineHeight: 22, textAlign: 'center', marginBottom: 18 },
  miniStats: { flexDirection: 'row', gap: 10 },
  miniStat: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', flex: 1 },
  miniStatV: { color: colors.primary, fontWeight: '900', fontSize: 20 },
  miniStatL: { color: colors.muted, fontSize: 11, marginTop: 2 },

  // Signal card
  signalCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(22,163,74,0.2)', borderRadius: radius.lg, padding: 20 },
  signalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  signalLive: { color: colors.green, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  signalPair: { color: colors.ink, fontWeight: '900', fontSize: 22, marginTop: 2 },
  buyBadge: { backgroundColor: colors.green, paddingHorizontal: 18, paddingVertical: 7, borderRadius: 10 },
  buyBadgeText: { color: colors.white, fontWeight: '900', fontSize: 15 },
  signalRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(16,19,26,0.03)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  signalRowLabel: { color: colors.muted, fontSize: font.small },
  signalRowValue: { fontWeight: '700', fontSize: font.small },
  signalNote: { backgroundColor: 'rgba(22,163,74,0.06)', borderColor: 'rgba(22,163,74,0.12)', borderWidth: 1, borderRadius: 8, padding: 10, marginTop: 8 },
  signalNoteText: { color: colors.muted, fontSize: font.small, lineHeight: 18 },

  // Pairs
  pairsHead: { color: colors.secondary, fontSize: font.body, fontWeight: '700', textAlign: 'center', marginBottom: 14 },
  pairsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  pairChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, borderWidth: 1, borderColor: '#e5e8ee', borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8 },
  pairChipHot: { backgroundColor: 'rgba(37,99,235,0.1)', borderColor: 'rgba(37,99,235,0.3)' },
  pairText: { color: colors.secondary, fontWeight: '700', fontSize: 13 },
  hotTag: { backgroundColor: colors.primary, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 5 },
  hotTagText: { color: colors.white, fontSize: 9, fontWeight: '800' },

  // Pricing
  planCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: 18, padding: 20, marginBottom: 14, position: 'relative' },
  planCardHighlight: { backgroundColor: colors.primary, borderColor: 'transparent' },
  planBadge: { position: 'absolute', top: -11, alignSelf: 'center', backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 4, borderRadius: radius.pill },
  planBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  priceLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 4 },
  priceOld: { color: colors.muted, fontSize: 12, textDecorationLine: 'line-through' },
  discountTag: { backgroundColor: 'rgba(37,99,235,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  discountText: { color: colors.primary, fontSize: 10, fontWeight: '800' },
  planName: { color: colors.ink, fontWeight: '800', fontSize: 18, marginBottom: 4 },
  planPrice: { color: colors.ink, fontWeight: '900', fontSize: 28 },
  planPeriod: { color: colors.muted, fontSize: 12 },
  planDesc: { color: colors.muted, fontSize: font.small, lineHeight: 19, marginTop: 4, marginBottom: 14 },
  featureLine: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  featureCheck: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  featureText: { color: colors.secondary, fontSize: font.small, flex: 1 },
  planCta: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 14 },
  planCtaText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  comingSoon: { backgroundColor: colors.overlay, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 14 },
  comingSoonText: { color: colors.muted2, fontSize: font.body },

  // Features
  featureCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.lg, padding: 16, marginBottom: 10 },
  featureTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  featureDesc: { color: colors.muted, fontSize: font.small, lineHeight: 19 },

  // Reviews
  reviewCard: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.lg, padding: 18, marginBottom: 10 },
  reviewQuote: { color: 'rgba(37,99,235,0.4)', fontSize: 28, lineHeight: 28 },
  reviewStars: { color: '#f59e0b', fontSize: 14, marginTop: 4, marginBottom: 8 },
  reviewContent: { color: colors.secondary, fontSize: font.small, lineHeight: 22, marginBottom: 12 },
  reviewAuthor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  reviewName: { color: colors.primary, fontWeight: '700', fontSize: font.body },
  reviewBadge: { color: colors.muted2, fontSize: 10 },

  // FAQ
  faqItem: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: radius.md, marginBottom: 8, overflow: 'hidden' },
  faqHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  faqQ: { color: colors.ink, fontWeight: '600', fontSize: font.body, flex: 1, marginRight: 8 },
  faqA: { color: colors.muted, fontSize: font.small, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 },

  // Affiliate CTA
  affCta: {
    backgroundColor: 'rgba(37,99,235,0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(37,99,235,0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(37,99,235,0.1)',
    paddingVertical: 36,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: 32,
  },
  affCtaTitle: { color: colors.ink, fontWeight: '900', fontSize: 26, marginBottom: 8, textAlign: 'center' },
  affCtaBody: { color: colors.secondary, fontSize: font.body, lineHeight: 22, textAlign: 'center', marginBottom: 18 },
  affCtaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.green, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 10 },
  affCtaBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  // Footer
  footer: { paddingHorizontal: spacing.lg, paddingTop: 24, paddingBottom: 32, backgroundColor: colors.cardAlt, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  footerLogo: { width: 160, height: 44, marginBottom: 10 },
  footerBody: { color: colors.muted2, fontSize: font.small, lineHeight: 20, textAlign: 'center', marginBottom: 18 },
  socialsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  socialBtn: { width: 38, height: 38, borderRadius: 8, backgroundColor: colors.overlay, borderWidth: 1, borderColor: colors.borderSoft, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { color: colors.muted2, fontSize: 11, lineHeight: 17, textAlign: 'center', marginBottom: 14 },
  copyright: { color: colors.muted2, fontSize: 11 },
})
