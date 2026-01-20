'use server'

import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validations/product'
import { revalidatePath } from 'next/cache'
import type { Product, ProductWithDetails } from '@/types'

// Helper to serialize Decimal to number for client components
function serializeProduct<T extends Product>(product: T): T & { price: number | null } {
  return {
    ...product,
    price: product.price ? Number(product.price) : null,
  }
}

function serializeProducts<T extends Product>(products: T[]): (T & { price: number | null })[] {
  return products.map(serializeProduct)
}

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

  // Filter low stock in code (Prisma doesn't compare fields directly)
  if (filter === 'low-stock') {
    return serializeProducts(products.filter(p => p.currentStock < p.minStock))
  }

  return serializeProducts(products)
}

export async function getProduct(id: string, companyId: string): Promise<ProductWithDetails | null> {
  const product = await prisma.product.findFirst({
    where: { id, companyId },
    include: {
      stockMovements: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!product) return null

  return serializeProduct(product) as ProductWithDetails
}

export async function createProduct(companyId: string, data: unknown) {
  try {
    const validated = productSchema.parse(data)

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        description: validated.description,
        sku: validated.sku,
        price: validated.price,
        minStock: validated.minStock,
        currentStock: validated.currentStock,
        companyId,
      },
    })

    revalidatePath('/products')
    revalidatePath('/dashboard')
    return { product: serializeProduct(product) }
  } catch (error) {
    console.error('Error creating product:', error)
    return { error: 'Failed to create product' }
  }
}

export async function updateProduct(id: string, companyId: string, data: unknown) {
  try {
    const validated = productSchema.partial().parse(data)

    // Verify product belongs to company
    const existing = await prisma.product.findFirst({
      where: { id, companyId },
    })

    if (!existing) {
      return { error: 'Product not found' }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
        sku: validated.sku,
        price: validated.price,
        minStock: validated.minStock,
      },
    })

    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    revalidatePath('/dashboard')
    return { product: serializeProduct(product) }
  } catch (error) {
    console.error('Error updating product:', error)
    return { error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string, companyId: string) {
  try {
    // Verify product belongs to company
    const existing = await prisma.product.findFirst({
      where: { id, companyId },
    })

    if (!existing) {
      return { error: 'Product not found' }
    }

    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/products')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: 'Failed to delete product' }
  }
}
