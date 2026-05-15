'use client'

export default function NavbarLogo() {
  return (
    <a
      href="/"
      onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      style={{ cursor: 'pointer' }}
    >
      <img
        src="/Trade with Shafy Png.png"
        alt="Trade with Shafy"
        style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }}
      />
    </a>
  )
}
