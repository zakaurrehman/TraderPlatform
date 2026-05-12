'use client'
import { useState } from 'react'

const FAQS = [
  { q: 'What currency pairs do you trade?', a: 'We primarily focus on XAU/USD (Gold), EUR/USD, GBP/USD, USD/JPY, GBP/JPY, and USD/CHF. Gold is our highest-performing pair with consistent signal accuracy.' },
  { q: 'What timeframes do you use for signals?', a: 'Signals are based on H1, H4 and Daily chart analysis using ICT (Inner Circle Trader) and Smart Money Concepts (SMC). We look for institutional order flow and liquidity sweeps.' },
  { q: 'How are signals delivered?', a: 'All signals are delivered instantly via our platform\'s Live Signals page and our private Telegram channel. You get Entry, TP1, TP2 and Stop Loss levels with every signal.' },
  { q: 'Do I need a specific broker?', a: 'No. Our signals work with any regulated Forex broker. We recommend brokers with low spreads on Gold and major pairs. Contact us and we can suggest options based on your country.' },
  { q: 'What is the minimum account size recommended?', a: 'We recommend a minimum of $200–$500 for signals. For course students, you can start with a demo account. Proper risk management (1–2% per trade) is taught in all our plans.' },
  { q: 'What is your trading methodology?', a: 'Shafy uses ICT (Inner Circle Trader) concepts combined with Smart Money Concepts (SMC) — including order blocks, fair value gaps, liquidity pools and market structure shifts.' },
  { q: 'How do I receive my course after payment?', a: 'Once admin confirms your payment, your account is automatically upgraded and all course content becomes accessible immediately from the Classroom and Research sections.' },
  { q: 'Can I get a refund?', a: 'Due to the digital nature of our products, we do not offer refunds once course access is granted. Signal subscriptions can be cancelled before the next billing cycle.' },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{
            background: '#111118',
            border: open === i ? '1px solid rgba(245,197,24,0.3)' : '1px solid rgba(245,197,24,0.08)',
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'border-color 0.2s'
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', padding: '16px 20px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12
            }}
          >
            <span style={{ color: 'white', fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{faq.q}</span>
            <span style={{ color: '#f5c518', fontSize: 18, flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
          </button>
          {open === i && (
            <div style={{ padding: '0 20px 16px', color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
