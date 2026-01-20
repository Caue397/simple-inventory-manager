import Link from 'next/link'
import { Package, ArrowRight, BarChart3, Bell, Building2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E85A4F] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Inventory</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-[#E85A4F] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#D64940] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FDECEA] text-[#E85A4F] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-[#E85A4F] rounded-full" />
            Simple inventory management
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Track your inventory{' '}
            <span className="text-[#E85A4F]">effortlessly</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Manage products, monitor stock movements, and get alerts when inventory runs low.
            Built for small businesses that need simplicity.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-[#E85A4F] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#D64940] transition-all shadow-lg shadow-[#E85A4F]/25 flex items-center gap-2"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-[#FDECEA] rounded-2xl flex items-center justify-center mb-5">
              <Package className="w-7 h-7 text-[#E85A4F]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Management</h3>
            <p className="text-gray-500 leading-relaxed">
              Easily manage your product catalog with SKUs, prices, and stock
              levels all in one place.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5">
              <BarChart3 className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Stock Tracking</h3>
            <p className="text-gray-500 leading-relaxed">
              Record every stock movement with full history and traceability for
              complete inventory control.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
              <Bell className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Low Stock Alerts</h3>
            <p className="text-gray-500 leading-relaxed">
              Get notified when products fall below minimum stock levels so you
              never miss a reorder.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#E85A4F] flex items-center justify-center">
              <Building2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-700 font-medium">Inventory Manager</span>
          </div>
          <p>Built with Next.js, Supabase & Prisma</p>
        </div>
      </footer>
    </div>
  )
}
