import { syncUser } from '@/lib/actions/sync-user'
import { getDashboardData } from '@/lib/actions/dashboard'
import { StatsCards } from '@/components/features/dashboard/stats-cards'
import { RecentMovements } from '@/components/features/dashboard/recent-movements'
import { LowStockAlert } from '@/components/features/dashboard/low-stock-alert'
import { StockChart } from '@/components/features/dashboard/stock-chart'

export default async function DashboardPage() {
  const { user } = await syncUser()
  const data = await getDashboardData(user!.companyId!)

  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Hello {firstName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {data.stats.lowStockCount > 0
            ? `${data.stats.lowStockCount} product${data.stats.lowStockCount > 1 ? 's' : ''} with low stock`
            : 'All products are well stocked'}
        </p>
      </div>

      {/* Main Stats and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <StockChart companyId={user!.companyId!} />
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <StatsCards stats={data.stats} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMovements movements={data.recentMovements} />
        <LowStockAlert products={data.lowStockProducts} />
      </div>
    </div>
  )
}
