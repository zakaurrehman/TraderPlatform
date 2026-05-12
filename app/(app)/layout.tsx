import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import BottomNav from '@/components/BottomNav'
import SideNav from '@/components/SideNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  if (session.user.role === 'ADMIN') redirect('/admin')

  return (
    <div className="app-shell">
      {/* Desktop sidebar — hidden on mobile via CSS */}
      <SideNav />

      {/* Main content */}
      <main className="app-main">
        {children}
      </main>

      {/* Mobile bottom nav — hidden on desktop via CSS */}
      <div className="app-bottom-nav-wrap">
        <BottomNav />
      </div>
    </div>
  )
}
