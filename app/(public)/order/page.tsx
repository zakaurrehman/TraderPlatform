'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SERVICES } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/brand/icons'

const PAYMENT_METHODS = ['Bank Transfer', 'PayPal', 'Wise', 'Crypto (USDT/BTC)', 'Mobile Money', 'Other']

export default function OrderPage() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<typeof SERVICES[0] | null>(null)
  const [form, setForm] = useState({ clientName: '', clientEmail: '', phone: '', country: '', referralCode: '', paymentMethod: '', paymentNote: '' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(f: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [f]: e.target.value }))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, service: selected.name, amount: selected.price }) })
    setSuccess(true)
  }

  if (success) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-5">
      <div className="text-center max-w-[400px]">
        <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--success-tint)', border: '1px solid rgba(22,163,74,0.24)', color: 'var(--color-success)' }}>
          <Icon name="checkCircle" size={40} />
        </div>
        <h2 className="text-ink font-bold text-2xl mt-6 mb-2">Order Received!</h2>
        <p className="text-muted leading-relaxed mb-7">Your payment is being verified. You will receive access within 24 hours.</p>
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas text-ink py-10 px-5">
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex mb-4"><Logo size={34} href={null} /></Link>
          <div className="flex items-center justify-center gap-2 mt-2">
            <StepDot n={1} active={step >= 1} label="Select Plan" />
            <div className="w-10 h-px" style={{ background: step >= 2 ? 'var(--color-primary)' : 'var(--color-line-strong)' }} />
            <StepDot n={2} active={step >= 2} label="Payment" />
          </div>
          <h1 className="text-[clamp(1.5rem,4vw,2rem)] font-bold mt-5">{step === 1 ? 'Choose Your Plan' : 'Complete Your Order'}</h1>
        </div>

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.filter(s => !s.comingSoon).map(svc => (
              <button key={svc.name} onClick={() => { setSelected(svc); setStep(2) }}
                className="card card-hover text-left p-5 group"
                style={{ borderColor: selected?.name === svc.name ? 'var(--color-primary)' : undefined }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="text-ink font-bold text-[15px]">{svc.name}</div>
                  {svc.popular && <span className="pill text-[10px]" style={{ background: 'var(--primary-tint)', color: 'var(--color-primary)', border: '1px solid var(--primary-line)' }}>Popular</span>}
                </div>
                <div className="text-gradient font-extrabold text-2xl font-display tabular mb-1.5">${svc.price}</div>
                <div className="text-muted text-[13px] leading-relaxed mb-3">{svc.description}</div>
                <span className="inline-flex items-center gap-1 text-primary text-[13px] font-semibold">Select <Icon name="arrowRight" size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && selected && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="card p-6">
                <div className="text-muted text-[13px] mb-1">Selected plan</div>
                <div className="text-ink font-bold text-lg">{selected.name}</div>
                <div className="text-gradient font-extrabold text-3xl font-display tabular my-1">${selected.price}</div>
                {selected.features && (
                  <ul className="space-y-2 mt-3">
                    {selected.features.map((f: string) => (
                      <li key={f} className="flex items-start gap-2 text-muted text-[13px]"><Icon name="check" size={15} className="text-primary shrink-0 mt-0.5" /> {f}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card p-6">
                <div className="flex items-center gap-2 text-ink font-semibold mb-3"><Icon name="lock" size={16} className="text-primary" /> Payment Instructions</div>
                <div className="text-muted text-[13px] leading-[1.8]">
                  <p>1. Transfer <strong className="text-primary tabular">${selected.price}</strong> using one of these methods:</p>
                  <p className="my-2 pl-1">• Bank Transfer: Contact admin<br />• USDT (TRC20): Contact admin<br />• WhatsApp: +1 234 567 8900</p>
                  <p>2. Fill in your details and paste the transaction ID</p>
                  <p className="mt-2">3. Access granted within 24 hours</p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3.5">
              {[
                { label: 'Full Name', f: 'clientName', ph: 'John Doe' },
                { label: 'Email', f: 'clientEmail', ph: 'you@email.com', t: 'email' },
                { label: 'Phone', f: 'phone', ph: '+1 234 567 8900' },
                { label: 'Country', f: 'country', ph: 'United States' },
                { label: 'Referral Code (if any)', f: 'referralCode', ph: 'XXXX000000' },
              ].map(({ label, f, ph, t }) => (
                <div key={f}>
                  <label className="field-label">{label}</label>
                  <input className="field" type={t || 'text'} placeholder={ph} value={form[f as keyof typeof form]} onChange={set(f)} required={f !== 'referralCode'} />
                </div>
              ))}
              <div>
                <label className="field-label">Preferred Payment Method <span className="text-primary">*</span></label>
                <select className="field" value={form.paymentMethod} onChange={set('paymentMethod')} required>
                  <option value="">Select payment method</option>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Transaction ID / Payment Note</label>
                <textarea className="field" rows={3} placeholder="Paste your transaction ID or proof of payment" value={form.paymentNote} onChange={set('paymentNote')} required />
              </div>
              <div className="flex gap-3 mt-1">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" loading={loading} block>{loading ? 'Submitting…' : 'Submit Order'}</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function StepDot({ n, active, label }: { n: number; active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors"
        style={active ? { background: 'var(--grad-primary)', color: '#ffffff' } : { background: 'var(--color-surface-2)', color: 'var(--color-dim)', border: '1px solid var(--color-line)' }}>
        {n}
      </span>
      <span className={`text-[13px] font-medium ${active ? 'text-ink' : 'text-dim'}`}>{label}</span>
    </div>
  )
}
