'use client'
import { useState } from 'react'

const GOLD = '#f59e0b'

export function StarDisplay({ rating, size = 15 }: { rating: number, size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          style={{ fill: i <= rating ? GOLD : 'transparent', stroke: GOLD }} strokeWidth="1.8" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export function StarPicker({ value, onChange }: { value: number, onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button"
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'transform .12s', transform: i <= (hover || value) ? 'scale(1.06)' : 'scale(1)' }}>
          <svg width={30} height={30} viewBox="0 0 24 24"
            style={{ fill: i <= (hover || value) ? GOLD : 'transparent', stroke: GOLD }} strokeWidth="1.8" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  )
}
