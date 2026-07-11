'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Logo } from '@/components/brand/Logo'

const navItems = [
  {
    href: '/research', label: 'Research',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )
  },
  {
    href: '/signals', label: 'Live Signals', live: true,
    icon: (_active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    )
  },
  {
    href: '/community', label: 'Community',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    href: '/classroom', label: 'Classroom',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    )
  },
  {
    href: '/calendar', label: 'Calendar',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    )
  },
  {
    href: '/watchlist', label: 'Watchlist',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    )
  },
  {
    href: '/calculator', label: 'Calculator',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/>
      </svg>
    )
  },
  {
    href: '/resources', label: 'Resources',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    )
  },
  {
    href: '/affiliate', label: 'Affiliate',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    )
  },
  {
    href: '/profile', label: 'Profile',
    icon: (active: boolean) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#7a8494'} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )
  }
]

export default function SideNav() {
  const pathname = usePathname()

  return (
    <div className="app-side-nav">
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--color-line)' }}>
        <Logo size={30} href="/research" />
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          if (item.live) {
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, marginBottom: 2, textDecoration: 'none', background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(185,28,28,0.06))', border: '1px solid rgba(220,38,38,0.2)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'pulse-glow 1.5s infinite' }}>
                  {item.icon(false)}
                </div>
                <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 13 }}>{item.label}</span>
                <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#dc2626', animation: 'pulse-glow 1.5s infinite' }} />
              </Link>
            )
          }
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              textDecoration: 'none',
              background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
              borderLeft: active ? '3px solid #2563eb' : '3px solid transparent',
              transition: 'background 0.15s'
            }}>
              {item.icon(active)}
              <span style={{ color: active ? '#2563eb' : '#55606f', fontWeight: active ? 700 : 400, fontSize: 13 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--color-line)' }}>
        <button onClick={() => signOut({ callbackUrl: '/login' })} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: '9px 12px', borderRadius: 8, background: 'transparent',
          border: 'none', cursor: 'pointer', color: '#7a8494', fontSize: 13
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a8494" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  )
}
