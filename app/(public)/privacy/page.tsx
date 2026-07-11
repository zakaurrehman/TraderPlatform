import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '@/components/brand/Logo'
import { Icon } from '@/components/brand/icons'

export const metadata: Metadata = {
  title: 'Privacy Policy — Trade with Shafy',
  description:
    'Privacy policy for the Trade with Shafy platform and mobile app. Learn how we collect, use, and protect your data.',
}

const H2 = 'text-primary font-bold text-lg md:text-xl mt-9 mb-3 pb-2 border-b'
const PARA = 'text-muted text-sm leading-[1.85] mb-3'
const LIST = 'text-muted text-sm leading-[1.85] mb-3 pl-5 list-disc space-y-1.5 marker:text-primary'
const STRONG = 'text-ink font-semibold'

export default function PrivacyPolicy() {
  const lastUpdated = '20 May 2026'

  return (
    <div className="min-h-screen bg-canvas py-10 px-5">
      <div className="max-w-[840px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex"><Logo size={30} href={null} /></Link>
          <Link href="/" className="text-dim hover:text-muted text-[13px] inline-flex items-center gap-1.5 transition-colors">
            <Icon name="arrowRight" size={14} className="rotate-180" /> Back to Home
          </Link>
        </div>

        <div className="card p-7 md:p-9">
          <h1 className="text-ink font-extrabold text-[clamp(1.6rem,4vw,2.2rem)] mb-1.5">Privacy Policy</h1>
          <p className="text-dim text-[13px] mb-6">Last updated: {lastUpdated}</p>

          <p className={PARA}>
            <strong className={STRONG}>Trade with Shafy</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website{' '}
            <a href="https://www.tradewithshaffy.com" className="link-primary">tradewithshaffy.com</a> and the &ldquo;Trade with Shafy&rdquo; mobile
            application (the &ldquo;Service&rdquo;). This page informs you of our policies regarding the collection, use, and disclosure of personal
            information when you use the Service.
          </p>
          <p className={PARA}>By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>1. Information We Collect</h2>
          <p className={PARA}>We collect only the information needed to provide you with the Service. The categories are:</p>
          <ul className={LIST}>
            <li><strong className={STRONG}>Account data:</strong> full name, email address, phone number, country, username, password (stored hashed using bcrypt), payment method preference, and an optional social handle — collected when you register.</li>
            <li><strong className={STRONG}>Auth tokens:</strong> short-lived (15&nbsp;minutes) JWT access tokens and long-lived (30&nbsp;days) opaque refresh tokens are issued to authenticate your sessions on the mobile app. Refresh tokens are stored only as a SHA-256 hash on our servers.</li>
            <li><strong className={STRONG}>Device tokens:</strong> when you grant notification permission, we store the Expo push token for your device so we can deliver new-signal alerts and admin notifications.</li>
            <li><strong className={STRONG}>Payment requests:</strong> name, email, phone, country, the selected plan, your chosen payment method, and any transaction note you submit when ordering a plan. We do <strong>not</strong> handle or store credit card numbers — all payment processing is done outside the platform (bank transfer, USDT, etc.).</li>
            <li><strong className={STRONG}>Activity data:</strong> course progress, certificates earned, community posts, comments, reactions, reviews you submit, and affiliate-related records (sales, commissions, withdrawal requests) tied to your account.</li>
            <li><strong className={STRONG}>Technical data:</strong> IP address and basic request headers, used solely for rate-limiting and abuse prevention. We do not run third-party analytics or advertising trackers.</li>
          </ul>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>2. How We Use Your Information</h2>
          <p className={PARA}>We use the information we collect to:</p>
          <ul className={LIST}>
            <li>Authenticate you and keep you signed in on the web and mobile app.</li>
            <li>Provide access to courses, signals, community posts and the affiliate dashboard.</li>
            <li>Process plan orders and affiliate commission payouts.</li>
            <li>Send you push notifications for new signals, live sessions, withdrawal updates and other account-related events (only after you grant permission).</li>
            <li>Prevent fraud and abuse (rate-limiting, credential stuffing detection).</li>
            <li>Communicate with you about important updates or in response to your support requests.</li>
          </ul>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>3. How We Share Your Information</h2>
          <p className={PARA}><strong className={STRONG}>We do not sell your personal information.</strong> We share data only with the limited third parties needed to operate the Service:</p>
          <ul className={LIST}>
            <li><strong className={STRONG}>Neon (PostgreSQL hosting)</strong> — stores account, content and activity data.</li>
            <li><strong className={STRONG}>Vercel</strong> — hosts the web application.</li>
            <li><strong className={STRONG}>Expo Push Service</strong> — receives your push token and the notification payload (title + short message) so it can deliver alerts to your device.</li>
            <li><strong className={STRONG}>Google Play Console / Apple App Store</strong> — for crash reports and download analytics aggregated by the store itself; we do not transmit personal data to them beyond what they collect automatically as the app distribution platform.</li>
          </ul>
          <p className={PARA}>We may also disclose information if required by law or in response to a valid legal request.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>4. Data Security</h2>
          <p className={PARA}>We take security seriously. Passwords are hashed with bcrypt (cost factor 12). Refresh tokens are stored only as SHA-256 hashes. All traffic to and from the Service is encrypted in transit over HTTPS/TLS. On the mobile app, your access and refresh tokens are stored in the operating system&apos;s secure storage (Keychain on iOS, Keystore on Android) via expo-secure-store.</p>
          <p className={PARA}>No method of electronic transmission or storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>5. Push Notifications</h2>
          <p className={PARA}>On first use, the mobile app will ask for permission to send push notifications. If you grant permission, we store your Expo push token and use it to send alerts about new signals, signal closures, live sessions, withdrawal status changes and other relevant account events.</p>
          <p className={PARA}>You can revoke notification permission at any time via your device&apos;s system settings; the app will continue to function without notifications.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>6. Your Rights</h2>
          <p className={PARA}>You have the right to:</p>
          <ul className={LIST}>
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and associated personal data.</li>
            <li>Withdraw consent for processing where consent was the legal basis.</li>
            <li>Opt out of push notifications (via device settings).</li>
            <li>Export a copy of your data in a machine-readable format.</li>
          </ul>
          <p className={PARA}>To exercise any of these rights, contact us at{' '}
            <a href="mailto:shafqatrafique45978@gmail.com" className="link-primary">shafqatrafique45978@gmail.com</a> from the email registered with your account. We respond within 30 days.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>7. Account Deletion</h2>
          <p className={PARA}>To delete your account and all associated personal information, email{' '}
            <a href="mailto:shafqatrafique45978@gmail.com" className="link-primary">shafqatrafique45978@gmail.com</a> from your registered email address with the subject &ldquo;Delete my account&rdquo;. We will permanently delete your account, profile data, course progress, community posts, and affiliate records within 30 days. Records we are legally required to retain (e.g. financial transaction logs for tax compliance) may be kept in an anonymised form.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>8. Children&apos;s Privacy</h2>
          <p className={PARA}>The Service is <strong>not intended for users under 18 years of age</strong>. Forex trading is a high-risk financial activity restricted to adults. We do not knowingly collect personal information from children. If you are a parent and become aware that your child has provided us with personal information, please contact us so we can delete it.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>9. Trading Risk Disclaimer</h2>
          <p className={PARA}>Trade with Shafy provides educational content, market analysis and trading signals for <strong>informational purposes only</strong>. We are not licensed financial advisors. Trading Forex and other financial instruments carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. You should never invest money you cannot afford to lose, and you should consult a licensed financial professional before making any investment decision.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>10. Changes to This Policy</h2>
          <p className={PARA}>We may update this Privacy Policy from time to time. Material changes will be communicated by updating the &ldquo;Last updated&rdquo; date at the top of this page and, where appropriate, by an in-app or email notice. Continued use of the Service after changes take effect constitutes acceptance of the updated policy.</p>

          <h2 className={H2} style={{ borderColor: 'var(--primary-line)' }}>11. Contact</h2>
          <p className={PARA}>If you have questions about this Privacy Policy or our handling of your data, please contact:</p>
          <div className="pl-4 border-l-2 text-sm text-muted leading-[1.85]" style={{ borderColor: 'var(--color-primary)' }}>
            <strong className={STRONG}>Trade with Shafy</strong><br />
            Email: <a href="mailto:shafqatrafique45978@gmail.com" className="link-primary">shafqatrafique45978@gmail.com</a><br />
            Website: <a href="https://www.tradewithshaffy.com" className="link-primary">tradewithshaffy.com</a>
          </div>
        </div>

        <p className="text-dim text-xs text-center mt-6">© {new Date().getFullYear()} Trade with Shafy. All rights reserved.</p>
      </div>
    </div>
  )
}
