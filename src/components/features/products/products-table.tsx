'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pencil, Trash2, Eye, AlertTriangle, Search, Package } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductsTableProps {
  products: Product[]
  companyId: string
}

export function ProductsTable({ products, companyId }: ProductsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    router.push(`/products?${params.toString()}`)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return

    startTransition(async () => {
      await deleteProduct(id, companyId)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
          {searchParams.has('search') && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearch('')
                router.push('/products')
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-5 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-5 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-5 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Stock
              </th>
              <th className="px-5 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-gray-100 mb-3">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No products found</p>
                    <p className="text-gray-400 text-xs mt-1">Add your first product to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isLowStock = product.currentStock < product.minStock
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500 font-mono">
                        {product.sku || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-gray-900">
                        {product.price
                          ? formatCurrency(Number(product.price))
                          : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isLowStock && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isLowStock
                              ? 'text-[#E85A4F]'
                              : 'text-gray-900'
                          }`}
                        >
                          {product.currentStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-gray-500">{product.minStock}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Button>
                        </Link>
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          disabled={isPending}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-[#E85A4F]" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
