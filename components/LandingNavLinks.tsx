'use client'
import { useEffect } from 'react'

const sections = [
  ['About', 'about'],
  ['Signals', 'signals'],
  ['Pricing', 'pricing'],
  ['Reviews', 'reviews'],
  ['FAQ', 'faq'],
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    window.history.pushState(null, '', `/${id}`)
  }
}

export default function LandingNavLinks() {
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '')
    if (sections.some(([, id]) => id === path)) {
      setTimeout(() => scrollToSection(path), 100)
    }
  }, [])

  return (
    <div className="l-nav-links" style={{ gap: 20, fontSize: 13, color: '#94a3b8' }}>
      {sections.map(([label, id]) => (
        <a
          key={id}
          href={`/${id}`}
          onClick={e => { e.preventDefault(); scrollToSection(id) }}
          className="nav-link"
          style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
        >
          {label}
        </a>
      ))}
    </div>
  )
}
