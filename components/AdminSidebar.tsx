'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/signals', label: 'Signals', icon: '⚡' },
  { href: '/admin/research', label: 'Research Posts', icon: '📝' },
  { href: '/admin/videos', label: 'Classroom Videos', icon: '🎬' },
  { href: '/admin/sessions', label: 'Live Sessions', icon: '📡' },
  { href: '/admin/calendar', label: 'Economic Calendar', icon: '📅' },
  { href: '/admin/brokers', label: 'Brokers', icon: '🏦' },
  { href: '/admin/resources', label: 'Resources', icon: '📁' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/affiliates', label: 'Affiliates', icon: '🔗' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/sales', label: 'Log Sale', icon: '💰' },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: '🏧' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' }
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(245,197,24,0.1)' }}>
        <div style={{ color: '#f5c518', fontWeight: 800, fontSize: 16 }}>Trade with Shafy</div>
        <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>Admin Panel</div>
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {links.map(l => {
          const active = pathname === l.href
          return (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, marginBottom: 2, textDecoration: 'none',
              background: active ? 'rgba(245,197,24,0.12)' : 'transparent',
              color: active ? '#f5c518' : '#94a3b8',
              fontWeight: active ? 600 : 400, fontSize: 14,
              transition: 'background 0.15s'
            }}>
              <span>{l.icon}</span> {l.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(245,197,24,0.1)' }}>
        <button onClick={() => signOut({ callbackUrl: '/login' })} style={{
          width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none',
          background: 'rgba(255,68,68,0.1)', color: '#ff6666', cursor: 'pointer',
          fontWeight: 600, fontSize: 14, textAlign: 'left'
        }}>🚪 Sign Out</button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: '#111118',
        borderRight: '1px solid rgba(245,197,24,0.08)',
        height: '100vh', position: 'sticky', top: 0, overflowY: 'auto',
        display: 'none'
      }} className="lg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#111118',
        borderBottom: '1px solid rgba(245,197,24,0.1)',
        position: 'sticky', top: 0, zIndex: 40
      }} className="mobile-topbar">
        <span style={{ color: '#f5c518', fontWeight: 800, fontSize: 15 }}>Trade with Shafy — Admin</span>
        <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 22 }}>☰</button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />
          <div style={{ width: 260, background: '#111118', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px' }}>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 22 }}>✕</button>
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
