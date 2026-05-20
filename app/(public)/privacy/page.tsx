import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Trade with Shafy',
  description:
    'Privacy policy for the Trade with Shafy platform and mobile app. Learn how we collect, use, and protect your data.',
}

const SECTION_STYLE: React.CSSProperties = { marginBottom: 28 }
const H2_STYLE: React.CSSProperties = {
  color: '#f5c518',
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 10,
  marginTop: 28,
  borderBottom: '1px solid rgba(245,197,24,0.15)',
  paddingBottom: 8,
}
const PARA: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: 14,
  lineHeight: 1.8,
  marginBottom: 12,
}
const LIST: React.CSSProperties = { color: '#94a3b8', fontSize: 14, lineHeight: 1.8, marginBottom: 12, paddingLeft: 22 }

export default function PrivacyPolicy() {
  const lastUpdated = '20 May 2026'

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <Link
          href="/"
          style={{ color: '#64748b', textDecoration: 'none', fontSize: 13, display: 'inline-block', marginBottom: 24 }}
        >
          ← Back to Home
        </Link>

        <div
          style={{
            background: '#111118',
            border: '1px solid rgba(245,197,24,0.12)',
            borderRadius: 16,
            padding: '32px 28px',
          }}
        >
          <h1 style={{ color: 'white', fontSize: 32, fontWeight: 900, marginBottom: 6 }}>Privacy Policy</h1>
          <p style={{ color: '#475569', fontSize: 13, marginBottom: 24 }}>Last updated: {lastUpdated}</p>

          <p style={PARA}>
            <strong style={{ color: '#e2e8f0' }}>Trade with Shafy</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
            operates the website{' '}
            <a href="https://www.tradewithshaffy.com" style={{ color: '#f5c518' }}>
              tradewithshaffy.com
            </a>{' '}
            and the &ldquo;Trade with Shafy&rdquo; mobile application (the &ldquo;Service&rdquo;). This page informs
            you of our policies regarding the collection, use, and disclosure of personal information when you use the
            Service.
          </p>
          <p style={PARA}>
            By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>

          {/* ── Information We Collect ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>1. Information We Collect</h2>
            <p style={PARA}>
              We collect only the information needed to provide you with the Service. The categories are:
            </p>
            <ul style={LIST}>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Account data:</strong> full name, email address, phone number,
                country, username, password (stored hashed using bcrypt), payment method preference, and an optional
                social handle &mdash; collected when you register.
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Auth tokens:</strong> short-lived (15&nbsp;minutes) JWT access
                tokens and long-lived (30&nbsp;days) opaque refresh tokens are issued to authenticate your sessions on
                the mobile app. Refresh tokens are stored only as a SHA-256 hash on our servers.
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Device tokens:</strong> when you grant notification permission, we
                store the Expo push token for your device so we can deliver new-signal alerts and admin notifications.
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Payment requests:</strong> name, email, phone, country, the
                selected plan, your chosen payment method, and any transaction note you submit when ordering a plan. We
                do <strong>not</strong> handle or store credit card numbers &mdash; all payment processing is done
                outside the platform (bank transfer, USDT, etc.).
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Activity data:</strong> course progress, certificates earned,
                community posts, comments, reactions, reviews you submit, and affiliate-related records (sales,
                commissions, withdrawal requests) tied to your account.
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Technical data:</strong> IP address and basic request headers,
                used solely for rate-limiting and abuse prevention. We do not run third-party analytics or advertising
                trackers.
              </li>
            </ul>
          </section>

          {/* ── How We Use ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>2. How We Use Your Information</h2>
            <p style={PARA}>We use the information we collect to:</p>
            <ul style={LIST}>
              <li>Authenticate you and keep you signed in on the web and mobile app.</li>
              <li>Provide access to courses, signals, community posts and the affiliate dashboard.</li>
              <li>Process plan orders and affiliate commission payouts.</li>
              <li>Send you push notifications for new signals, live sessions, withdrawal updates and other
                account-related events (only after you grant permission).</li>
              <li>Prevent fraud and abuse (rate-limiting, credential stuffing detection).</li>
              <li>Communicate with you about important updates or in response to your support requests.</li>
            </ul>
          </section>

          {/* ── Sharing ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>3. How We Share Your Information</h2>
            <p style={PARA}>
              <strong style={{ color: '#e2e8f0' }}>We do not sell your personal information.</strong> We share data
              only with the limited third parties needed to operate the Service:
            </p>
            <ul style={LIST}>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Neon (PostgreSQL hosting)</strong> &mdash; stores account, content
                and activity data.
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Vercel</strong> &mdash; hosts the web application.
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Expo Push Service</strong> &mdash; receives your push token and
                the notification payload (title + short message) so it can deliver alerts to your device.
              </li>
              <li>
                <strong style={{ color: '#e2e8f0' }}>Google Play Console / Apple App Store</strong> &mdash; for crash
                reports and download analytics aggregated by the store itself; we do not transmit personal data to
                them beyond what they collect automatically as the app distribution platform.
              </li>
            </ul>
            <p style={PARA}>
              We may also disclose information if required by law or in response to a valid legal request.
            </p>
          </section>

          {/* ── Data Security ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>4. Data Security</h2>
            <p style={PARA}>
              We take security seriously. Passwords are hashed with bcrypt (cost factor 12). Refresh tokens are stored
              only as SHA-256 hashes. All traffic to and from the Service is encrypted in transit over HTTPS/TLS. On
              the mobile app, your access and refresh tokens are stored in the operating system&apos;s secure storage
              (Keychain on iOS, Keystore on Android) via expo-secure-store.
            </p>
            <p style={PARA}>
              No method of electronic transmission or storage is 100% secure. While we strive to use commercially
              acceptable means to protect your data, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* ── Push Notifications ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>5. Push Notifications</h2>
            <p style={PARA}>
              On first use, the mobile app will ask for permission to send push notifications. If you grant permission,
              we store your Expo push token and use it to send alerts about new signals, signal closures, live
              sessions, withdrawal status changes and other relevant account events.
            </p>
            <p style={PARA}>
              You can revoke notification permission at any time via your device&apos;s system settings; the app will
              continue to function without notifications.
            </p>
          </section>

          {/* ── Your Rights ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>6. Your Rights</h2>
            <p style={PARA}>You have the right to:</p>
            <ul style={LIST}>
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your account and associated personal data.</li>
              <li>Withdraw consent for processing where consent was the legal basis.</li>
              <li>Opt out of push notifications (via device settings).</li>
              <li>Export a copy of your data in a machine-readable format.</li>
            </ul>
            <p style={PARA}>
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:shafqatrafique45978@gmail.com" style={{ color: '#f5c518' }}>
                shafqatrafique45978@gmail.com
              </a>{' '}
              from the email registered with your account. We respond within 30 days.
            </p>
          </section>

          {/* ── Account Deletion ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>7. Account Deletion</h2>
            <p style={PARA}>
              To delete your account and all associated personal information, email{' '}
              <a href="mailto:shafqatrafique45978@gmail.com" style={{ color: '#f5c518' }}>
                shafqatrafique45978@gmail.com
              </a>{' '}
              from your registered email address with the subject &ldquo;Delete my account&rdquo;. We will permanently
              delete your account, profile data, course progress, community posts, and affiliate records within 30 days.
              Records we are legally required to retain (e.g. financial transaction logs for tax compliance) may be
              kept in an anonymised form.
            </p>
          </section>

          {/* ── Children ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>8. Children&apos;s Privacy</h2>
            <p style={PARA}>
              The Service is <strong>not intended for users under 18 years of age</strong>. Forex trading is a
              high-risk financial activity restricted to adults. We do not knowingly collect personal information from
              children. If you are a parent and become aware that your child has provided us with personal information,
              please contact us so we can delete it.
            </p>
          </section>

          {/* ── Risk ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>9. Trading Risk Disclaimer</h2>
            <p style={PARA}>
              Trade with Shafy provides educational content, market analysis and trading signals for
              <strong> informational purposes only</strong>. We are not licensed financial advisors. Trading Forex and
              other financial instruments carries a high level of risk and may not be suitable for all investors. Past
              performance is not indicative of future results. You should never invest money you cannot afford to lose,
              and you should consult a licensed financial professional before making any investment decision.
            </p>
          </section>

          {/* ── Changes ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>10. Changes to This Policy</h2>
            <p style={PARA}>
              We may update this Privacy Policy from time to time. Material changes will be communicated by updating
              the &ldquo;Last updated&rdquo; date at the top of this page and, where appropriate, by an in-app or email
              notice. Continued use of the Service after changes take effect constitutes acceptance of the updated
              policy.
            </p>
          </section>

          {/* ── Contact ── */}
          <section style={SECTION_STYLE}>
            <h2 style={H2_STYLE}>11. Contact</h2>
            <p style={PARA}>
              If you have questions about this Privacy Policy or our handling of your data, please contact:
            </p>
            <p style={{ ...PARA, paddingLeft: 12, borderLeft: '2px solid #f5c518' }}>
              <strong style={{ color: '#e2e8f0' }}>Trade with Shafy</strong>
              <br />
              Email:{' '}
              <a href="mailto:shafqatrafique45978@gmail.com" style={{ color: '#f5c518' }}>
                shafqatrafique45978@gmail.com
              </a>
              <br />
              Website:{' '}
              <a href="https://www.tradewithshaffy.com" style={{ color: '#f5c518' }}>
                tradewithshaffy.com
              </a>
            </p>
          </section>
        </div>

        <p style={{ color: '#334155', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
          © {new Date().getFullYear()} Trade with Shafy. All rights reserved.
        </p>
      </div>
    </div>
  )
}
