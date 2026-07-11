'use client'
import { useState, useEffect } from 'react'

type Payment = {
  id: string; clientName: string; clientEmail: string; phone: string | null
  country: string | null; service: string; amount: number; status: string
  referralCode: string | null; paymentMethod: string | null; paymentNote: string | null; createdAt: string
}

function serviceToPlan(service: string) {
  const s = service.toLowerCase()
  if (s.includes('mentorship') || s.includes('mastery') || s.includes('advanced trading')) return 'PREMIUM'
  return 'BASIC'
}

const SERVICES = ['Basic Training', 'Premium Signals', 'Advanced Trading Strategies', 'Mastery Bundle', 'Personal Mentorship']
const planColors: Record<string, string> = { PREMIUM: '#7c3aed', BASIC: '#2563eb' }
const statusColors: Record<string, string> = { PENDING: '#f59e0b', CONFIRMED: '#16a34a', REJECTED: '#dc2626' }

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [serviceFilter, setServiceFilter] = useState('ALL')

  useEffect(() => { fetch('/api/admin/payments').then(r => r.json()).then(setPayments) }, [])

  async function update(id: string, status: string, rejectedNote?: string) {
    await fetch('/api/admin/payments', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, rejectedNote }) })
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  const filtered = payments.filter(p =>
    (statusFilter === 'ALL' || p.status === statusFilter) &&
    (serviceFilter === 'ALL' || p.service === serviceFilter)
  )

  const pending = payments.filter(p => p.status === 'PENDING').length

  function countByService(svc: string) {
    return payments.filter(p => p.service === svc).length
  }

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Payment Requests</h1>
      <p style={{ color: '#7a8494', marginBottom: 20 }}>
        {pending > 0
          ? <span style={{ color: '#f59e0b', fontWeight: 700 }}>{pending} awaiting confirmation</span>
          : 'All payments reviewed'}
        {' · '}{payments.length} total
      </p>

      {/* Plan/Service summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 20 }}>
        {SERVICES.map(svc => {
          const count = countByService(svc)
          const plan = serviceToPlan(svc)
          const active = serviceFilter === svc
          return (
            <button key={svc} onClick={() => setServiceFilter(active ? 'ALL' : svc)} style={{
              background: active ? 'rgba(37,99,235,0.12)' : '#ffffff',
              border: `1px solid ${active ? 'rgba(37,99,235,0.4)' : 'rgba(37,99,235,0.08)'}`,
              borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left'
            }}>
              <div style={{ color: planColors[plan], fontSize: 10, fontWeight: 700, marginBottom: 2 }}>{plan}</div>
              <div style={{ color: '#10131a', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{svc}</div>
              <div style={{ color: '#2563eb', fontWeight: 900, fontSize: 22, marginTop: 4 }}>{count}</div>
              <div style={{ color: '#7a8494', fontSize: 11 }}>payment{count !== 1 ? 's' : ''}</div>
            </button>
          )
        })}
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['PENDING', 'CONFIRMED', 'REJECTED', 'ALL'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13,
            background: statusFilter === f ? 'rgba(37,99,235,0.15)' : 'rgba(16,19,26,0.05)',
            color: statusFilter === f ? '#2563eb' : '#7a8494',
            fontWeight: statusFilter === f ? 700 : 400
          }}>
            {f}
            {f === 'PENDING' && pending > 0 && (
              <span style={{ marginLeft: 6, background: '#f59e0b', color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 800, padding: '1px 6px' }}>{pending}</span>
            )}
          </button>
        ))}
        {serviceFilter !== 'ALL' && (
          <button onClick={() => setServiceFilter('ALL')} style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(37,99,235,0.3)', background: 'transparent', color: '#2563eb', cursor: 'pointer', fontSize: 12 }}>
            × {serviceFilter}
          </button>
        )}
      </div>

      {/* Payment cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(p => {
          const plan = serviceToPlan(p.service)
          return (
            <div key={p.id} style={{
              background: '#ffffff',
              border: `1px solid ${p.status === 'PENDING' ? 'rgba(240,180,41,0.25)' : 'rgba(37,99,235,0.06)'}`,
              borderRadius: 14, padding: 18
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#10131a', fontWeight: 700, fontSize: 16 }}>{p.clientName}</div>
                  <div style={{ color: '#7a8494', fontSize: 12, marginTop: 1 }}>{p.clientEmail}</div>
                  {p.phone && <div style={{ color: '#9aa3b2', fontSize: 12 }}>{p.phone}</div>}
                  {p.country && <div style={{ color: '#9aa3b2', fontSize: 12 }}>{p.country}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#2563eb', fontWeight: 900, fontSize: 22 }}>${p.amount}</div>
                  <span style={{ color: statusColors[p.status] ?? '#7a8494', fontWeight: 700, fontSize: 12 }}>{p.status}</span>
                  <div style={{ color: '#9aa3b2', fontSize: 11, marginTop: 2 }}>{new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <span style={{ background: 'rgba(16,19,26,0.06)', color: '#2b3442', fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>
                  📦 {p.service}
                </span>
                <span style={{ background: `rgba(${plan === 'PREMIUM' ? '124,58,237' : '37,99,235'},0.12)`, color: planColors[plan], fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  → activates {plan}
                </span>
                {p.paymentMethod && (
                  <span style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>
                    {p.paymentMethod}
                  </span>
                )}
                {p.referralCode && (
                  <span style={{ background: 'rgba(148,163,184,0.08)', color: '#55606f', fontSize: 12, padding: '3px 10px', borderRadius: 20 }}>
                    Ref: {p.referralCode}
                  </span>
                )}
              </div>

              {/* Payment proof */}
              {p.paymentNote && (
                <div style={{ background: 'rgba(16,19,26,0.03)', border: '1px solid rgba(16,19,26,0.07)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                  <div style={{ color: '#7a8494', fontSize: 11, marginBottom: 3 }}>TRANSACTION ID / PAYMENT PROOF</div>
                  <div style={{ color: '#2b3442', fontSize: 13, wordBreak: 'break-all', fontFamily: 'monospace' }}>{p.paymentNote}</div>
                </div>
              )}

              {/* Actions */}
              {p.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => update(p.id, 'CONFIRMED')}
                    style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)', color: '#16a34a', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
                  >
                    ✓ Confirm — activate {plan}
                  </button>
                  <button
                    onClick={() => { const note = prompt('Reason for rejection?'); if (note !== null) update(p.id, 'REJECTED', note) }}
                    style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                  >
                    ✗ Reject
                  </button>
                </div>
              )}
              {p.status === 'CONFIRMED' && (
                <div style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>
                  ✓ Confirmed · <span style={{ color: planColors[plan] }}>{plan} plan activated</span>
                </div>
              )}
              {p.status === 'REJECTED' && (
                <div style={{ color: '#dc2626', fontSize: 13 }}>✗ Rejected</div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9aa3b2', padding: 60, background: '#ffffff', borderRadius: 14 }}>
            No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} {serviceFilter !== 'ALL' ? serviceFilter : ''} payments.
          </div>
        )}
      </div>
    </div>
  )
}
