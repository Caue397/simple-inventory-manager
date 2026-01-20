# Fase 6: Gestão de Produtos

## Visão Geral

O módulo de produtos permite:
- Listar todos os produtos com filtros
- Criar novos produtos
- Editar produtos existentes
- Visualizar detalhes e histórico

## Listagem de Produtos

```typescript
// src/app/(dashboard)/products/page.tsx
import Link from 'next/link'
import { syncUser } from '@/lib/actions/sync-user'
import { getProducts } from '@/lib/actions/products'
import { ProductsTable } from '@/components/features/products-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface ProductsPageProps {
  searchParams: { filter?: string; search?: string }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { user } = await syncUser()
  const products = await getProducts(user!.companyId!, searchParams)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
```

## Buscar Produtos

```typescript
// src/lib/actions/products.ts
'use server'

import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations/product'
import { revalidatePath } from 'next/cache'

interface GetProductsParams {
  filter?: string
  search?: string
}

export async function getProducts(companyId: string, params: GetProductsParams = {}) {
  const { filter, search } = params

  const products = await prisma.product.findMany({
    where: {
      companyId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { createdAt: 'desc' },
  })

  // Filtrar estoque baixo no código (Prisma não compara campos diretamente)
  if (filter === 'low-stock') {
    return products.filter(p => p.currentStock < p.minStock)
  }

  return products
}

export async function getProduct(id: string, companyId: string) {
  return prisma.product.findFirst({
    where: { id, companyId },
    include: {
      stockMovements: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
}

export async function createProduct(companyId: string, data: unknown) {
  try {
    const validated = productSchema.parse(data)

    const product = await prisma.product.create({
      data: {
        ...validated,
        companyId,
      },
    })

    revalidatePath('/products')
    return { product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function updateProduct(id: string, companyId: string, data: unknown) {
  try {
    const validated = productSchema.parse(data)

    const product = await prisma.product.updateMany({
      where: { id, companyId },
      data: validated,
    })

    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { error: 'Erro ao atualizar produto' }
  }
}

export async function deleteProduct(id: string, companyId: string) {
  try {
    await prisma.product.deleteMany({
      where: { id, companyId },
    })

    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: 'Erro ao deletar produto' }
  }
}
```

## Tabela de Produtos

```typescript
// src/components/features/products-table.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import { deleteProduct } from '@/lib/actions/products'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

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
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    await deleteProduct(id, '') // companyId será verificado no server
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Buscar por nome ou SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Produto
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                SKU
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                Preço
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                Estoque
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                Mínimo
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      {product.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.sku || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {product.price
                      ? `R$ ${Number(product.price).toFixed(2)}`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={
                        product.currentStock < product.minStock
                          ? 'text-red-600 font-semibold'
                          : ''
                      }
                    >
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {product.minStock}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

## Formulário de Produto

```typescript
// src/components/features/product-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
      description: formData.get('description') as string,
      sku: formData.get('sku') as string,
      price: formData.get('price') ? Number(formData.get('price')) : undefined,
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
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Produto *
            </label>
            <Input
              name="name"
              defaultValue={product?.name}
              placeholder="Ex: Camiseta Básica"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <Input
              name="sku"
              defaultValue={product?.sku || ''}
              placeholder="Ex: CAM-001"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              name="description"
              defaultValue={product?.description || ''}
              placeholder="Descrição do produto..."
              className="w-full h-24 px-3 py-2 border rounded-md resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preço (R$)</label>
            <Input
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.price ? Number(product.price) : ''}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Estoque Mínimo
            </label>
            <Input
              name="minStock"
              type="number"
              min="0"
              defaultValue={product?.minStock || 0}
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Estoque Inicial
              </label>
              <Input
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
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Produto'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
```

## Página de Novo Produto

```typescript
// src/app/(dashboard)/products/new/page.tsx
import { syncUser } from '@/lib/actions/sync-user'
import { ProductForm } from '@/components/features/product-form'

export default async function NewProductPage() {
  const { user } = await syncUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
        <p className="text-gray-600">Cadastre um novo produto no sistema</p>
      </div>

      <ProductForm companyId={user!.companyId!} />
    </div>
  )
}
```

## Página de Detalhes

```typescript
// src/app/(dashboard)/products/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { syncUser } from '@/lib/actions/sync-user'
import { getProduct } from '@/lib/actions/products'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, ArrowLeft } from 'lucide-react'

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { user } = await syncUser()
  const product = await getProduct(params.id, user!.companyId!)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.sku && (
              <p className="text-gray-600">SKU: {product.sku}</p>
            )}
          </div>
        </div>
        <Link href={`/products/${product.id}/edit`}>
          <Button>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Estoque Atual</p>
          <p className="text-3xl font-bold">{product.currentStock}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Estoque Mínimo</p>
          <p className="text-3xl font-bold">{product.minStock}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Preço</p>
          <p className="text-3xl font-bold">
            {product.price ? `R$ ${Number(product.price).toFixed(2)}` : '-'}
          </p>
        </Card>
      </div>

      {product.description && (
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Descrição</h3>
          <p className="text-gray-600">{product.description}</p>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Últimas Movimentações</h3>
        {product.stockMovements.length === 0 ? (
          <p className="text-gray-500">Nenhuma movimentação registrada</p>
        ) : (
          <div className="space-y-3">
            {product.stockMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {movement.type === 'IN' ? 'Entrada' : 'Saída'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {movement.user.name} - {movement.reason || 'Sem motivo'}
                  </p>
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
                    {new Date(movement.createdAt).toLocaleDateString('pt-BR')}
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
```

## Próximos Passos

Após implementar produtos, prossiga para a [Fase 7: Movimentações](./07-stock-movements.md).
