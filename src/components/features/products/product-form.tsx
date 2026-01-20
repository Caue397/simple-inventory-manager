'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import type { Product } from '@/types'

interface ProductFormProps {
  product?: Product
  companyId: string
}

export function ProductForm({ product, companyId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!product

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      sku: (formData.get('sku') as string) || null,
      price: formData.get('price') ? Number(formData.get('price')) : null,
      minStock: Number(formData.get('minStock')) || 0,
      currentStock: Number(formData.get('currentStock')) || 0,
    }

    const result = isEditing
      ? await updateProduct(product.id, companyId, data)
      : await createProduct(companyId, data)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/products')
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              placeholder="e.g. Basic T-Shirt"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              defaultValue={product?.sku || ''}
              placeholder="e.g. TSH-001"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description || ''}
              placeholder="Product description..."
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price ? Number(product.price) : ''}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minStock">Minimum Stock</Label>
            <Input
              id="minStock"
              name="minStock"
              type="number"
              min="0"
              defaultValue={product?.minStock || 0}
            />
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="currentStock">Initial Stock</Label>
              <Input
                id="currentStock"
                name="currentStock"
                type="number"
                min="0"
                defaultValue={0}
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
