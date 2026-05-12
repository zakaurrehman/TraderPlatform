'use client'
import { useState, useEffect } from 'react'

export default function CountdownTimer() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    let end = Number(localStorage.getItem('discount_end') || 0)
    if (!end || end < Date.now()) {
      end = Date.now() + 47 * 3600_000 + 23 * 60_000 + 11_000
      localStorage.setItem('discount_end', end.toString())
    }
    const tick = () => {
      const rem = Math.max(0, end - Date.now())
      setTime({
        h: Math.floor(rem / 3600_000),
        m: Math.floor((rem % 3600_000) / 60_000),
        s: Math.floor((rem % 60_000) / 1000)
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 12, padding: '10px 18px' }}>
      <span style={{ color: '#ff6666', fontSize: 13, fontWeight: 700 }}>⏰ Offer ends in:</span>
      {[['HRS', time.h], ['MIN', time.m], ['SEC', time.s]].map(([label, val]) => (
        <div key={label as string} style={{ textAlign: 'center', minWidth: 32 }}>
          <div style={{ color: '#ff4444', fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{pad(val as number)}</div>
          <div style={{ color: '#ff6666', fontSize: 9, letterSpacing: 1, marginTop: 2 }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
