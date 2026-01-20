'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Bell,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserWithCompany } from '@/types'
import { logout } from '@/lib/actions/auth'

interface SidebarProps {
  user: UserWithCompany
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Movements', href: '/movements', icon: ArrowLeftRight },
  { name: 'Alerts', href: '/alerts', icon: Bell },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col min-h-screen">
      {/* Logo and Company */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image
              src="/InventoryLogo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-xl"
            />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">
              {user.company?.name || 'Inventory'}
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-[#FDECEA] text-[#E85A4F] font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div className="relative">
                  <item.icon className={cn(
                    'w-5 h-5',
                    isActive ? 'text-[#E85A4F]' : 'text-gray-400'
                  )} />
                </div>
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#E85A4F] flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="p-2 text-gray-400 hover:text-[#E85A4F] hover:bg-white rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
