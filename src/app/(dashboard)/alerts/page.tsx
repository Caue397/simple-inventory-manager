import Link from 'next/link'
import { syncUser } from '@/lib/actions/sync-user'
import { getLowStockProducts } from '@/lib/actions/alerts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowRight, Bell, CheckCircle } from 'lucide-react'

export default async function AlertsPage() {
  const { user } = await syncUser()
  const products = await getLowStockProducts(user!.companyId!)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stock Alerts</h1>
            <p className="text-sm text-gray-500">
              Products with stock below the configured minimum
            </p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All good!</h3>
          <p className="text-gray-500">
            All products have adequate stock levels.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-4 border-amber-200 bg-amber-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-amber-800">
                <strong>{products.length}</strong> product{products.length > 1 ? 's' : ''} with low stock requiring attention
              </p>
            </div>
          </Card>

          <div className="grid gap-4">
            {products.map((product) => {
              const deficit = product.minStock - product.currentStock
              const percentage = Math.round(
                (product.currentStock / product.minStock) * 100
              )
              const isCritical = percentage < 25

              return (
                <Card key={product.id} className={`p-6 ${isCritical ? 'border-red-200' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${isCritical ? 'bg-red-50' : 'bg-amber-50'}`}>
                        <AlertTriangle className={`w-6 h-6 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        {product.sku && (
                          <p className="text-sm text-gray-400 font-mono">
                            SKU: {product.sku}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        View product
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current</p>
                      <p className={`text-2xl font-bold ${isCritical ? 'text-red-600' : 'text-[#E85A4F]'}`}>
                        {product.currentStock}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Minimum</p>
                      <p className="text-2xl font-bold text-gray-900">{product.minStock}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Need</p>
                      <p className="text-2xl font-bold text-amber-600">
                        +{deficit}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Stock level</span>
                      <span className={`font-medium ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentage < 25
                            ? 'bg-red-500'
                            : percentage < 50
                            ? 'bg-amber-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
