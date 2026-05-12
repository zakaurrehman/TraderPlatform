'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/research',
    label: 'Research',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#f5c518' : '#64748b'} strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )
  },
  {
    href: '/community',
    label: 'Community',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#f5c518' : '#64748b'} strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    href: '/signals',
    label: 'LIVE',
    live: true,
    icon: (_active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    )
  },
  {
    href: '/classroom',
    label: 'Classroom',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#f5c518' : '#64748b'} strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    )
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#f5c518' : '#64748b'} strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )
  }
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 50,
      background: 'linear-gradient(180deg, #0f0f15 0%, #13131c 100%)',
      borderTop: '1px solid rgba(245,197,24,0.12)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '8px 0 4px' }}>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          if (item.live) {
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', marginTop: '-22px' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 0 3px rgba(255,68,68,0.25), 0 4px 15px rgba(255,68,68,0.5)',
                  animation: 'pulse-glow 1.5s infinite'
                }}>
                  {item.icon(false)}
                </div>
                <span style={{ color: '#ff6666', fontSize: 10, fontWeight: 700, marginTop: 3, letterSpacing: '0.5px' }}>SIGNALS</span>
              </Link>
            )
          }
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', padding: '4px 8px' }}>
              <div style={{ position: 'relative' }}>
                {item.icon(active)}
                {active && <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#f5c518' }} />}
              </div>
              <span style={{ color: active ? '#f5c518' : '#64748b', fontSize: 10, fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
