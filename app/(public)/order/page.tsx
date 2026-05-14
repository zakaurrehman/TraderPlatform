'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SERVICES } from '@/lib/utils'

const PAYMENT_METHODS = [
  'Bank Transfer',
  'PayPal',
  'Wise',
  'Crypto (USDT/BTC)',
  'Mobile Money',
  'Other'
]

export default function OrderPage() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<typeof SERVICES[0] | null>(null)
  const [form, setForm] = useState({ clientName: '', clientEmail: '', phone: '', country: '', referralCode: '', paymentMethod: '', paymentNote: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(f: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [f]: e.target.value })) }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, service: selected.name, amount: selected.price }) })
    setSuccess(true)
  }

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: 'white', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Order Received!</h2>
        <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>Your payment is being verified. You will receive access within 24 hours.</p>
        <Link href="/" style={{ padding: '12px 28px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', textDecoration: 'none', fontWeight: 700 }}>Back to Home</Link>
      </div>
    </div>
  )

  const inputStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', padding: '10px 14px', width: '100%', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', padding: '40px 20px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ color: '#475569', textDecoration: 'none', fontSize: 13 }}>← Back</Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>Choose Your Plan</h1>
        </div>

        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
            {SERVICES.filter(s => !s.comingSoon).map(svc => (
              <button key={svc.name} onClick={() => { setSelected(svc); setStep(2) }}
                style={{ background: '#111118', border: `1px solid ${selected?.name === svc.name ? '#f5c518' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: 20, textAlign: 'left', cursor: 'pointer', color: 'white' }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{svc.name}</div>
                <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 22, marginBottom: 4 }}>${svc.price}</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>{svc.description}</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && selected && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 4 }}>Selected plan</div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{selected.name}</div>
                <div style={{ color: '#f5c518', fontWeight: 900, fontSize: 28, margin: '4px 0' }}>${selected.price}</div>
              </div>
              <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.1)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Payment Instructions</div>
                <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
                  <p>1. Transfer <strong style={{ color: '#f5c518' }}>${selected.price}</strong> to one of these methods:</p>
                  <p style={{ margin: '8px 0' }}>• Bank Transfer: Contact admin<br />• USDT (TRC20): Contact admin<br />• WhatsApp: +1 234 567 8900</p>
                  <p>2. Fill in your details and paste the transaction ID</p>
                  <p style={{ marginTop: 8 }}>3. Access granted within 24 hours</p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Full Name', f: 'clientName', ph: 'John Doe' },
                { label: 'Email', f: 'clientEmail', ph: 'you@email.com', t: 'email' },
                { label: 'Phone', f: 'phone', ph: '+1 234 567 8900' },
                { label: 'Country', f: 'country', ph: 'United States' },
                { label: 'Referral Code (if any)', f: 'referralCode', ph: 'XXXX000000' }
              ].map(({ label, f, ph, t }) => (
                <div key={f}>
                  <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 5 }}>{label}</label>
                  <input style={inputStyle} type={t || 'text'} placeholder={ph} value={form[f as keyof typeof form]} onChange={set(f)} required={f !== 'referralCode'} />
                </div>
              ))}
              <div>
                <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 5 }}>Preferred Payment Method *</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer', borderColor: form.paymentMethod ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.1)' }}
                  value={form.paymentMethod}
                  onChange={set('paymentMethod')}
                  required
                >
                  <option value="" style={{ background: '#1a1a24' }}>Select payment method</option>
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m} style={{ background: '#1a1a24' }}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: 13, display: 'block', marginBottom: 5 }}>Transaction ID / Payment Note</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} placeholder="Paste your transaction ID or proof of payment" value={form.paymentNote} onChange={set('paymentNote')} required />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '11px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer' }}>Back</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '11px', borderRadius: 8, background: 'linear-gradient(135deg,#f5c518,#c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                  {loading ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
