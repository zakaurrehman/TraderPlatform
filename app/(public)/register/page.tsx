'use client'
import { useState } from 'react'
import Link from 'next/link'

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
  'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
]

const PAYMENT_METHODS = [
  'Bank Transfer',
  'PayPal',
  'Wise',
  'Crypto (USDT/BTC)',
  'Mobile Money',
  'Other'
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', city: '', country: '',
    username: '', password: '', confirmPassword: '',
    paymentMethod: '', socialHandle: ''
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
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'AFFILIATE' })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Application Submitted!</h2>
          <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>Your affiliate account is under review. You will be notified once approved.</p>
          <Link href="/login" style={{ padding: '12px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #f5c518, #c9a000)', color: '#0a0a0f', textDecoration: 'none', fontWeight: 700 }}>Back to Login</Link>
        </div>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, color: 'white',
    padding: '11px 14px', width: '100%', outline: 'none',
    fontSize: 14, transition: 'border-color 0.2s'
  }

  const labelStyle: React.CSSProperties = {
    color: '#94a3b8', fontSize: 13, fontWeight: 600,
    display: 'block', marginBottom: 6
  }

  const fields = [
    { label: 'Full Name *', field: 'fullName', placeholder: 'John Doe' },
    { label: 'Email *', field: 'email', placeholder: 'you@email.com', type: 'email' },
    { label: 'Phone *', field: 'phone', placeholder: '+1 234 567 8900' },
    { label: 'City', field: 'city', placeholder: 'New York' },
  ]

  const fields2 = [
    { label: 'Username *', field: 'username', placeholder: 'johndoe' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '40px 20px' }}>
      <style>{`
        .reg-input:focus { border-color: #f5c518 !important; }
        .reg-select:focus { border-color: #f5c518 !important; outline: none; }
        .reg-select option { background: #1a1a24; color: #f0f0f0; }
      `}</style>

      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}>← Back to Home</Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/"><img src="/Trade with Shafy Png.png" alt="Trade with Shafy" style={{ height: 48, width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 4px', cursor: 'pointer' }} /></Link>
          <p style={{ color: '#64748b' }}>Register as an Affiliate</p>
        </div>

        <div style={{ background: '#111118', border: '1px solid rgba(245,197,24,0.12)', borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Full Name, Email, Phone, City */}
            {fields.map(({ label, field, placeholder, type }) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input
                  className="reg-input"
                  style={inputStyle}
                  type={type || 'text'}
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={set(field)}
                  required={!label.includes('(optional)') && !label.includes('City')}
                />
              </div>
            ))}

            {/* Country dropdown */}
            <div>
              <label style={labelStyle}>Country *</label>
              <select
                className="reg-select"
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  appearance: 'auto',
                  borderColor: form.country ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.12)'
                }}
                value={form.country}
                onChange={set('country')}
                required
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Username */}
            {fields2.map(({ label, field, placeholder }) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input
                  className="reg-input"
                  style={inputStyle}
                  type="text"
                  placeholder={placeholder}
                  value={form[field as keyof typeof form]}
                  onChange={set(field)}
                  required
                />
              </div>
            ))}

            {/* Payment Method dropdown */}
            <div>
              <label style={labelStyle}>Preferred Payment Method *</label>
              <select
                className="reg-select"
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  appearance: 'auto',
                  borderColor: form.paymentMethod ? 'rgba(245,197,24,0.4)' : 'rgba(255,255,255,0.12)'
                }}
                value={form.paymentMethod}
                onChange={set('paymentMethod')}
                required
              >
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Password fields side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Password *</label>
                <input
                  className="reg-input"
                  style={inputStyle}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Re-enter Password *</label>
                <input
                  className="reg-input"
                  style={inputStyle}
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                />
              </div>
            </div>

            {/* Social handle */}
            <div>
              <label style={labelStyle}>Social Handle (optional)</label>
              <input
                className="reg-input"
                style={inputStyle}
                type="text"
                placeholder="@yourhandle"
                value={form.socialHandle}
                onChange={set('socialHandle')}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ff6666', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4, padding: '13px', borderRadius: 8, background: 'linear-gradient(135deg, #f5c518, #c9a000)', color: '#0a0a0f', border: 'none', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Submitting...' : 'Submit Application →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: 13, marginTop: 20 }}>
            Already registered?{' '}
            <Link href="/login" style={{ color: '#f5c518', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
