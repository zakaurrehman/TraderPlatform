'use client'
import { useState, useEffect } from 'react'
import { Icon } from '@/components/brand/icons'

export default function CountdownTimer() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  const [ready, setReady] = useState(false)

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
        s: Math.floor((rem % 60_000) / 1000),
      })
      setReady(true)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div
      className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5"
      style={{ background: 'var(--primary-tint)', border: '1px solid var(--primary-line)' }}
    >
      <span className="inline-flex items-center gap-1.5 text-primary text-[13px] font-semibold">
        <Icon name="clock" size={15} /> Limited offer ends in
      </span>
      <div className="flex items-center gap-1.5" style={{ visibility: ready ? 'visible' : 'hidden' }}>
        {([['HRS', time.h], ['MIN', time.m], ['SEC', time.s]] as [string, number][]).map(([label, val], i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="text-center">
              <div className="text-ink font-extrabold text-lg leading-none tabular font-display">{pad(val)}</div>
              <div className="text-dim text-[8px] tracking-widest mt-0.5">{label}</div>
            </div>
            {i < 2 && <span className="text-primary/50 font-bold pb-2.5">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
