import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import type { DashboardStats } from '@/types'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Products',
      subtitle: 'In your inventory',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      href: '/products',
      iconBg: 'bg-[#FDECEA]',
      iconColor: 'text-[#E85A4F]',
    },
    {
      title: 'Movements',
      subtitle: 'Last 30 days',
      value: stats.totalMovements.toLocaleString(),
      icon: TrendingUp,
      href: '/movements',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Low Stock',
      subtitle: 'Products below minimum',
      value: stats.lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      href: '/alerts',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      highlight: stats.lowStockCount > 0,
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <Card className={`p-5 hover:shadow-md transition-shadow cursor-pointer ${card.highlight ? 'border-amber-200' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-2 rounded-lg ${card.iconBg}`}>
                    <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{card.title}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{card.subtitle}</p>
                <p className={`text-3xl font-bold ${card.highlight ? 'text-amber-600' : 'text-gray-900'}`}>
                  {card.value}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#E85A4F] mt-3 hover:underline">
              View details &rarr;
            </p>
          </Card>
        </Link>
      ))}
    </div>
  )
}
