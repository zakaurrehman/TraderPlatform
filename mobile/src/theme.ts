/**
 * Design tokens — light "Clarity" theme, mirrors the web design system.
 * White surfaces, slate ink text, royal-blue #2563EB primary.
 */
export const colors = {
  /* surfaces */
  bg: '#f6f8fb',            // app canvas (soft cool white so cards pop)
  card: '#ffffff',          // cards
  cardAlt: '#fbfcfe',       // bars / headers
  /* primary (royal blue) */
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryBright: '#3b82f6',
  primaryTint: 'rgba(37,99,235,0.08)',
  /* semantic */
  green: '#16a34a',
  greenBright: '#22c55e',
  red: '#dc2626',
  redText: '#dc2626',
  redDark: '#b91c1c',
  /* text (strongest → faintest) */
  ink: '#10131a',
  body: '#2b3442',
  secondary: '#55606f',
  muted: '#7a8494',
  muted2: '#9aa3b2',
  white: '#ffffff',
  /* lines + overlays */
  border: '#e5e8ee',
  borderSoft: '#eef1f5',
  overlay: 'rgba(16,19,26,0.04)',
  overlay2: 'rgba(16,19,26,0.05)',
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

/** Soft elevation for cards on the light canvas. */
export const shadow = {
  card: {
    shadowColor: '#10131a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#10131a',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primary: {
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const

/** Plan badge colors — light-friendly tints with high-contrast text. */
export const planColors: Record<string, { bg: string; color: string }> = {
  FREE: { bg: 'rgba(85,96,111,0.10)', color: '#55606f' },
  BASIC: { bg: 'rgba(22,163,74,0.10)', color: '#15803d' },
  ADVANCED: { bg: 'rgba(2,132,199,0.10)', color: '#0369a1' },
  MASTERY: { bg: 'rgba(124,58,237,0.10)', color: '#6d28d9' },
  PREMIUM: { bg: 'rgba(37,99,235,0.10)', color: '#1d4ed8' },
  MENTORSHIP: { bg: 'rgba(220,38,38,0.10)', color: '#b91c1c' },
}
