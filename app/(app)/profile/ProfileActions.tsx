'use client'
import { signOut } from 'next-auth/react'

export default function ProfileActions() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff6666', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
      🚪 Sign Out
    </button>
  )
}
