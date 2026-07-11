import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fb', color: '#2b3442', display: 'flex' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '24px', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
