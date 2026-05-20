/**
 * Design tokens — mirrors the web app exactly.
 */
export const colors = {
  bg: '#0a0a0f',
  card: '#111118',
  cardAlt: '#0f0f15',
  gold: '#f5c518',
  goldDark: '#c9a000',
  goldAmber: '#e0a800',
  green: '#00c851',
  greenBright: '#00ff88',
  red: '#ff4444',
  redText: '#ff6666',
  redDark: '#cc0000',
  muted: '#64748b',
  muted2: '#475569',
  secondary: '#94a3b8',
  body: '#e2e8f0',
  white: '#ffffff',
  border: 'rgba(245,197,24,0.1)',
  borderSoft: 'rgba(245,197,24,0.06)',
  overlay: 'rgba(255,255,255,0.04)',
  overlay2: 'rgba(255,255,255,0.05)',
} as const

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  pill: 999,
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const

export const font = {
  h1: 22,
  h2: 18,
  h3: 15,
  body: 13,
  small: 12,
  tiny: 11,
  micro: 10,
} as const

/** Plan badge colors — matches the web plan badges. */
export const planColors: Record<string, { bg: string; color: string }> = {
  FREE: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
  BASIC: { bg: 'rgba(0,200,81,0.15)', color: '#00c851' },
  ADVANCED: { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8' },
  MASTERY: { bg: 'rgba(167,139,250,0.18)', color: '#a78bfa' },
  PREMIUM: { bg: 'rgba(245,197,24,0.18)', color: '#f5c518' },
  MENTORSHIP: { bg: 'rgba(255,68,68,0.18)', color: '#ff6666' },
}
