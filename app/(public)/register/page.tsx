'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/brand/icons'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda',
  'Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain',
  'Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada',
  'Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic',
  'Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt',
  'El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia',
  'Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana',
  'Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti',
  'Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland',
  'Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati',
  'Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya',
  'Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia',
  'Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico',
  'Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique',
  'Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua',
  'Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan',
  'Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines',
  'Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis',
  'Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
  'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles',
  'Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia',
  'South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan',
  'Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania',
  'Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia',
  'Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City',
  'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
]

const PAYMENT_METHODS = ['Bank Transfer', 'PayPal', 'Wise', 'Crypto (USDT/BTC)', 'Mobile Money', 'Other']

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', city: '', country: '',
    username: '', password: '', confirmPassword: '',
    paymentMethod: '', socialHandle: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'AFFILIATE' }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-5">
        <div className="text-center max-w-[400px]">
          <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'var(--success-tint)', border: '1px solid rgba(22,163,74,0.24)', color: 'var(--color-success)' }}>
            <Icon name="checkCircle" size={40} />
          </div>
          <h2 className="text-ink font-bold text-2xl mt-6 mb-2">Application Submitted!</h2>
          <p className="text-muted leading-relaxed mb-7">Your affiliate account is under review. You will be notified once approved.</p>
          <Button href="/login">Back to Login</Button>
        </div>
      </div>
    )
  }

  const fields = [
    { label: 'Full Name', field: 'fullName', placeholder: 'John Doe', required: true },
    { label: 'Email', field: 'email', placeholder: 'you@email.com', type: 'email', required: true },
    { label: 'Phone', field: 'phone', placeholder: '+1 234 567 8900', required: true },
    { label: 'City', field: 'city', placeholder: 'New York', required: false },
  ]

  return (
    <div className="min-h-screen bg-canvas py-10 px-5">
      <div className="max-w-[540px] mx-auto">
        <Link href="/" className="text-dim hover:text-muted text-[13px] inline-flex items-center gap-1.5 transition-colors mb-4">
          <Icon name="arrowRight" size={14} className="rotate-180" /> Back to Home
        </Link>

        <div className="text-center mb-7">
          <Link href="/" className="inline-flex"><Logo size={38} href={null} /></Link>
          <p className="text-dim mt-3">Register as an Affiliate</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ label, field, placeholder, type, required }) => (
              <div key={field}>
                <label className="field-label">{label} {required && <span className="text-primary">*</span>}</label>
                <input className="field" type={type || 'text'} placeholder={placeholder}
                  value={form[field as keyof typeof form]} onChange={set(field)} required={required} />
              </div>
            ))}

            <div>
              <label className="field-label">Country <span className="text-primary">*</span></label>
              <select className="field" value={form.country} onChange={set('country')} required>
                <option value="">Select your country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="field-label">Username <span className="text-primary">*</span></label>
              <input className="field" type="text" placeholder="johndoe" value={form.username} onChange={set('username')} required autoComplete="username" />
            </div>

            <div>
              <label className="field-label">Preferred Payment Method <span className="text-primary">*</span></label>
              <select className="field" value={form.paymentMethod} onChange={set('paymentMethod')} required>
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Password <span className="text-primary">*</span></label>
                <input className="field" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required autoComplete="new-password" />
              </div>
              <div>
                <label className="field-label">Re-enter <span className="text-primary">*</span></label>
                <input className="field" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} required autoComplete="new-password" />
              </div>
            </div>

            <div>
              <label className="field-label">Social Handle <span className="text-dim font-normal">(optional)</span></label>
              <input className="field" type="text" placeholder="@yourhandle" value={form.socialHandle} onChange={set('socialHandle')} />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg px-3.5 py-2.5 text-danger text-[13px]" style={{ background: 'var(--danger-tint)', border: '1px solid rgba(248,113,113,0.28)' }}>
                <Icon name="shield" size={16} className="shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <Button type="submit" loading={loading} block size="lg" iconRight="arrowRight" className="mt-1">
              {loading ? 'Submitting…' : 'Submit Application'}
            </Button>
          </form>

          <p className="text-center text-dim text-[13px] mt-5">
            Already registered? <Link href="/login" className="link-primary">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
