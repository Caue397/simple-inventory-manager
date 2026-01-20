import { syncUser } from '@/lib/actions/sync-user'
import { getMovements } from '@/lib/actions/movements'
import { getProducts } from '@/lib/actions/products'
import { MovementsTable } from '@/components/features/movements/movements-table'
import { NewMovementDialog } from '@/components/features/movements/new-movement-dialog'
import { ArrowLeftRight } from 'lucide-react'

interface MovementsPageProps {
  searchParams: Promise<{
    type?: 'IN' | 'OUT'
    productId?: string
    startDate?: string
    endDate?: string
  }>
}

export default async function MovementsPage({ searchParams }: MovementsPageProps) {
  const params = await searchParams
  const { user } = await syncUser()
  const [movements, products] = await Promise.all([
    getMovements(user!.companyId!, params),
    getProducts(user!.companyId!),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50">
              <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Movements</h1>
              <p className="text-sm text-gray-500">Stock in and out history</p>
            </div>
          </div>
        </div>
        <NewMovementDialog products={products} userId={user!.id} />
      </div>

      <MovementsTable movements={movements} products={products} />
    </div>
  )
}
