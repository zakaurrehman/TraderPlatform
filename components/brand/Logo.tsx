import Link from 'next/link'

/* ── The mark ──────────────────────────────────────────────────────────────
   A champagne-gold squircle with a dark, upward market-structure trend line
   and arrow knocked out of it. Reads as growth + precision + analysis, and
   stays legible down to favicon size because it's built from solid shapes. */

export function LogoMark({ size = 34, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="twsBrand" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="twsSheen" x1="24" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* squircle tile */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#twsBrand)" />
      {/* subtle top-edge highlight */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#twsSheen)" />
      {/* knocked-out trend + arrow */}
      <path
        d="M12 31.5 L20.5 23 L27 28 L36 15"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 15 L36 15 L36 22"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* entry node */}
      <circle cx="12" cy="31.5" r="2.7" fill="#ffffff" />
    </svg>
  )
}

/* ── Full lockup: mark + wordmark ───────────────────────────────────────── */
export function Logo({
  size = 34,
  href = '/',
  showWord = true,
  className = '',
}: {
  size?: number
  href?: string | null
  showWord?: boolean
  className?: string
}) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showWord && (
        <span
          className="font-display tracking-tight leading-none"
          style={{ fontSize: size * 0.5, color: 'currentColor' }}
        >
          <span className="font-semibold opacity-80">Trade with </span>
          <span className="font-extrabold">Shafy</span>
        </span>
      )}
    </span>
  )

  if (href === null) return inner
  return (
    <Link href={href} aria-label="Trade with Shafy — home" className="inline-flex items-center">
      {inner}
    </Link>
  )
}

export default Logo
