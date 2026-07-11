'use client'
import { signOut } from 'next-auth/react'

export default function ProfileActions() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
      🚪 Sign Out
    </button>
  )
}
