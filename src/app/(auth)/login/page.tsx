import { LoginForm } from '@/components/features/auth/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to manage your inventory
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#E85A4F] hover:text-[#D64940] font-medium">
          Sign up
        </Link>
      </p>
    </>
  )
}
