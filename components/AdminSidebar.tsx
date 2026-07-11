'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { Logo } from '@/components/brand/Logo'
import { Icon, type IconName } from '@/components/brand/icons'

const links: { href: string; label: string; icon: IconName }[] = [
  { href: '/admin', label: 'Overview', icon: 'chart' },
  { href: '/admin/signals', label: 'Signals', icon: 'bolt' },
  { href: '/admin/research', label: 'Research Posts', icon: 'bookOpen' },
  { href: '/admin/videos', label: 'Classroom Videos', icon: 'play' },
  { href: '/admin/sessions', label: 'Live Sessions', icon: 'activity' },
  { href: '/admin/calendar', label: 'Economic Calendar', icon: 'calendar' },
  { href: '/admin/brokers', label: 'Brokers', icon: 'shieldCheck' },
  { href: '/admin/resources', label: 'Resources', icon: 'layers' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/affiliates', label: 'Affiliates', icon: 'gift' },
  { href: '/admin/payments', label: 'Payments', icon: 'dollar' },
  { href: '/admin/sales', label: 'Log Sale', icon: 'trendingUp' },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: 'arrowRight' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'star' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--color-line)' }}>
        <Logo size={28} href="/admin" />
        <div style={{ color: 'var(--color-dim)', fontSize: 12, marginTop: 6, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin Panel</div>
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {links.map(l => {
          const active = pathname === l.href
          return (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, marginBottom: 2, textDecoration: 'none',
              background: active ? 'var(--primary-tint)' : 'transparent',
              color: active ? 'var(--color-primary)' : 'var(--color-muted)',
              fontWeight: active ? 600 : 500, fontSize: 14,
              transition: 'background 0.15s, color 0.15s'
            }}>
              <Icon name={l.icon} size={17} /> {l.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--color-line)' }}>
        <button onClick={() => signOut({ callbackUrl: '/login' })} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none',
          background: 'var(--danger-tint)', color: 'var(--color-danger)', cursor: 'pointer',
          fontWeight: 600, fontSize: 14, textAlign: 'left'
        }}><Icon name="close" size={16} /> Sign Out</button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: 230, flexShrink: 0, background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-line)',
        height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
        display: 'none'
      }} className="lg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-line)',
        position: 'sticky', top: 0, zIndex: 40
      }} className="mobile-topbar">
        <Logo size={26} href="/admin" />
        <button onClick={() => setOpen(true)} aria-label="Open menu" style={{ background: 'none', border: 'none', color: 'var(--color-ink)', cursor: 'pointer', display: 'flex', padding: 6 }}>
          <Icon name="menu" size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div style={{ flex: 1, background: 'rgba(16,19,26,0.45)' }} onClick={() => setOpen(false)} />
          <div style={{ width: 260, background: 'var(--color-surface)', height: '100%', overflowY: 'auto', boxShadow: 'var(--shadow-lift)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px' }}>
              <button onClick={() => setOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', display: 'flex', padding: 6 }}>
                <Icon name="close" size={20} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: block !important; }
          .mobile-topbar { display: none !important; }
        }
      `}</style>
    </>
  )
}
