import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/actions/sync-user'
import { OnboardingForm } from '@/components/features/onboarding/onboarding-form'

export default async function OnboardingPage() {
  const { user, error } = await syncUser()

  if (error || !user) {
    redirect('/login')
  }

  // If user already has a company, redirect to dashboard
  if (user.company) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome{user.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="mt-2 text-gray-600">
            Let&apos;s set up your company to get started
          </p>
        </div>
        <OnboardingForm userId={user.id} />
      </div>
    </div>
  )
}
