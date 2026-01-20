import { notFound } from 'next/navigation'
import Link from 'next/link'
import { syncUser } from '@/lib/actions/sync-user'
import { getProduct } from '@/lib/actions/products'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const { user } = await syncUser()
  const product = await getProduct(id, user!.companyId!)

  if (!product) {
    notFound()
  }

  const isLowStock = product.currentStock < product.minStock

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.sku && (
              <p className="text-gray-600">SKU: {product.sku}</p>
            )}
          </div>
        </div>
        <Link href={`/products/${product.id}/edit`}>
          <Button>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Current Stock</p>
          <p className={`text-3xl font-bold ${isLowStock ? 'text-red-600' : ''}`}>
            {product.currentStock}
          </p>
          {isLowStock && (
            <p className="text-sm text-amber-600 mt-1">Below minimum</p>
          )}
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Minimum Stock</p>
          <p className="text-3xl font-bold">{product.minStock}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Price</p>
          <p className="text-3xl font-bold">
            {product.price ? formatCurrency(Number(product.price)) : '-'}
          </p>
        </Card>
      </div>

      {product.description && (
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Movements</h3>
        {product.stockMovements.length === 0 ? (
          <p className="text-gray-500">No movements recorded</p>
        ) : (
          <div className="space-y-3">
            {product.stockMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      movement.type === 'IN'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {movement.type === 'IN' ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {movement.type === 'IN' ? 'Stock In' : 'Stock Out'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {movement.user.name || 'User'} - {movement.reason || 'No reason'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      movement.type === 'IN' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(movement.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
