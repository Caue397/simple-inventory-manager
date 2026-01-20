import { SignupForm } from '@/components/features/auth/signup-form'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">
          Start managing your inventory for free
        </p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-[#E85A4F] hover:text-[#D64940] font-medium">
          Sign in
        </Link>
      </p>
    </>
  )
}
