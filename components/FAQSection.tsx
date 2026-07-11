'use client'
import { useState } from 'react'
import { Icon } from '@/components/brand/icons'

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
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-3">
      {FAQS.map((faq, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-colors"
            style={{ background: 'var(--color-surface)', border: `1px solid ${isOpen ? 'var(--primary-line)' : 'var(--color-line)'}` }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
              aria-expanded={isOpen}
            >
              <span className="text-ink font-semibold text-[15px] leading-snug">{faq.q}</span>
              <span
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300"
                style={{ background: 'var(--primary-tint)', color: 'var(--color-primary)', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <Icon name="plus" size={16} />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-muted text-[13px] leading-[1.75]">{faq.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
