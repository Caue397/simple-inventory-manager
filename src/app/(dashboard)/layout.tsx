import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/actions/sync-user'
import { Sidebar } from '@/components/features/dashboard/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, error } = await syncUser()

  if (error || !user) {
    redirect('/login')
  }

  // Redirect to onboarding if user doesn't have a company
  // But allow access to onboarding page
  if (!user.company) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
