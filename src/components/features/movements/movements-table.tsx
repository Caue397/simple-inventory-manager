'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUp, ArrowDown, Filter, X, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'
import type { Product } from '@/types'

interface Movement {
  id: string
  type: 'IN' | 'OUT'
  quantity: number
  reason: string | null
  createdAt: Date
  product: { name: string; sku: string | null }
  user: { name: string | null }
}

interface MovementsTableProps {
  movements: Movement[]
  products: Product[]
}

export function MovementsTable({ movements, products }: MovementsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams()

    const type = formData.get('type') as string
    const productId = formData.get('productId') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string

    if (type) params.set('type', type)
    if (productId) params.set('productId', productId)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)

    router.push(`/movements?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/movements')
  }

  const hasFilters = searchParams.toString().length > 0

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {showFilters && (
          <form
            onSubmit={handleFilter}
            className="mt-4 pt-4 border-t border-gray-100 space-y-4"
          >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                defaultValue={searchParams.get('type') || ''}
                className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <select
                id="productId"
                name="productId"
                defaultValue={searchParams.get('productId') || ''}
                className="w-full h-10 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={searchParams.get('startDate') || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={searchParams.get('endDate') || ''}
              />
            </div>
          </div>

            <Button type="submit" size="sm">
              Apply Filters
            </Button>
          </form>
        )}
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-5 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-gray-100 mb-3">
                      <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No movements found</p>
                    <p className="text-gray-400 text-xs mt-1">Stock movements will appear here</p>
                  </div>
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">
                      {formatDateTime(movement.createdAt)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        movement.type === 'IN'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {movement.type === 'IN' ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {movement.type === 'IN' ? 'In' : 'Out'}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{movement.product.name}</p>
                      {movement.product.sku && (
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          {movement.product.sku}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`text-sm font-medium ${
                        movement.type === 'IN'
                          ? 'text-green-600'
                          : 'text-[#E85A4F]'
                      }`}
                    >
                      {movement.type === 'IN' ? '+' : '-'}
                      {movement.quantity}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">
                      {movement.reason || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">
                      {movement.user.name || 'User'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
