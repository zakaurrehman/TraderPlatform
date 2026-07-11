'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Icon } from '@/components/brand/icons'

const SECTIONS: [string, string][] = [
  ['About', 'about'],
  ['Signals', 'signals'],
  ['Pricing', 'pricing'],
  ['Reviews', 'reviews'],
  ['FAQ', 'faq'],
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', `/${id}`)
    }
    setOpen(false)
  }, [])

  // shadow/blur on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // deep-link (/pricing etc. → scroll to section)
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '')
    if (SECTIONS.some(([, id]) => id === path)) {
      setTimeout(() => scrollTo(path), 120)
    }
  }, [scrollTo])

  // scroll-spy for active link
  useEffect(() => {
    const els = SECTIONS.map(([, id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-line' : 'border-b border-transparent'}`}
    >
      <nav className="container-x flex items-center justify-between h-16 md:h-[72px]">
        <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setOpen(false) }} aria-label="Trade with Shafy — top" className="shrink-0">
          <Logo size={34} href={null} />
        </button>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {SECTIONS.map(([label, id]) => (
            <a
              key={id}
              href={`/${id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(id) }}
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${active === id ? 'text-primary' : 'text-muted hover:text-ink'}`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-ink hover:bg-surface-2 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </nav>

      {/* mobile menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-40 transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'color-mix(in srgb, var(--color-canvas) 96%, transparent)', backdropFilter: 'blur(8px)' }}
      >
        <div className="container-x py-6 flex flex-col gap-1">
          {SECTIONS.map(([label, id], i) => (
            <a
              key={id}
              href={`/${id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(id) }}
              className="flex items-center justify-between py-3.5 border-b border-line text-lg font-display font-semibold text-ink"
              style={{ animation: open ? `fadeUp .4s ${i * 40}ms both` : 'none' }}
            >
              {label}
              <Icon name="arrowRight" size={18} className="text-dim" />
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-6">
            <Link href="/register" className="btn btn-primary btn-lg btn-block" onClick={() => setOpen(false)}>Get Started</Link>
            <Link href="/login" className="btn btn-secondary btn-lg btn-block" onClick={() => setOpen(false)}>Login</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
