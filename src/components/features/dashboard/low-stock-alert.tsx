import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  sku: string | null
  currentStock: number
  minStock: number
}

interface LowStockAlertProps {
  products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <CardTitle>Low Stock Alerts</CardTitle>
          </div>
          <Link href="/alerts">
            <Button variant="ghost" size="sm" className="text-[#E85A4F] hover:text-[#D64940] hover:bg-[#FDECEA]">
              View all
            </Button>
          </Link>
        </div>
        <CardDescription>Products that need restocking</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-full mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-gray-900 font-medium">All good!</p>
            <p className="text-gray-500 text-sm">All products have adequate stock</p>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => {
              const stockPercent = (product.currentStock / product.minStock) * 100
              const isCritical = stockPercent < 50

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-50' : 'bg-amber-50'}`}>
                      <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400">
                        {product.sku ? `SKU: ${product.sku}` : 'No SKU'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.currentStock} / {product.minStock}
                      </p>
                      <p className="text-xs text-gray-400">current / min</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#E85A4F] transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
