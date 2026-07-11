import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Icon, type IconName } from '@/components/brand/icons'

const SOCIALS: { label: string; href: string; icon: IconName; color: string }[] = [
  { label: 'WhatsApp', href: 'https://whatsapp.com/channel/0029Vb1eRV4BPzjT2Y9X6Y0K', icon: 'whatsapp', color: '#25D366' },
  { label: 'Telegram', href: '#', icon: 'telegram', color: '#229ED9' },
  { label: 'Instagram', href: 'https://www.instagram.com/shafqatrafiquee?igsh=MXR1NXdldjh5bjdmZw==', icon: 'instagram', color: '#E1306C' },
  { label: 'YouTube', href: '#', icon: 'youtube', color: '#FF0000' },
]

const PLATFORM: [string, string][] = [
  ['Research', '/research'], ['Live Signals', '/signals'], ['Classroom', '/classroom'],
  ['Community', '/community'], ['Calculator', '/calculator'],
]
const GETSTARTED: [string, string][] = [
  ['Register as Affiliate', '/register'], ['Login', '/login'], ['Order a Plan', '/order'], ['Leave a Review', '/reviews'],
]

function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com/us/app/trade-with-shafy/id6772309277"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-black border border-line-strong hover:border-white/30 transition-colors"
    >
      <Icon name="apple" size={22} className="text-white" />
      <span className="text-left leading-tight">
        <span className="block text-[9px] text-muted">Download on the</span>
        <span className="block text-sm font-semibold text-white">App Store</span>
      </span>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="bg-canvas-2 border-t border-line">
      <div className="container-x py-14">
        <div className="grid gap-10 md:gap-8 grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size={34} />
            <p className="text-muted text-sm leading-relaxed mt-4 mb-5 max-w-xs">
              Professional Forex education, live signals, and a thriving community of traders worldwide.
            </p>
            <div className="mb-5"><AppStoreBadge /></div>
            <div className="flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-surface border border-line flex items-center justify-center text-muted hover:text-ink hover:border-line-strong transition-colors"
                >
                  <Icon name={s.icon} size={18} style={{ color: s.color }} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <div className="text-ink font-semibold text-sm mb-4">Platform</div>
            <ul className="space-y-2.5">
              {PLATFORM.map(([l, h]) => (
                <li key={l}><Link href={h} className="text-muted hover:text-primary text-sm transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Get started */}
          <div>
            <div className="text-ink font-semibold text-sm mb-4">Get Started</div>
            <ul className="space-y-2.5">
              {GETSTARTED.map(([l, h]) => (
                <li key={l}><Link href={h} className="text-muted hover:text-primary text-sm transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-ink font-semibold text-sm mb-4">Contact</div>
            <p className="text-muted text-sm leading-relaxed">
              Have questions? Reach out via Telegram or email us at{' '}
              <a href="mailto:shafqatrafique45978@gmail.com" className="link-primary break-words">shafqatrafique45978@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <div className="text-dim text-xs">© {new Date().getFullYear()} Trade with Shafy. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-dim hover:text-muted text-xs transition-colors">Privacy Policy</Link>
            <a href="#" className="text-dim hover:text-muted text-xs transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
