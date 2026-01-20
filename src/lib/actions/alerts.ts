'use server'

import { prisma } from '@/lib/prisma'
import type { LowStockProduct } from '@/types'

export async function getLowStockProducts(companyId: string): Promise<LowStockProduct[]> {
  const products: LowStockProduct[] = await prisma.product.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      sku: true,
      currentStock: true,
      minStock: true,
    },
  })

  return products.filter((p: LowStockProduct) => p.currentStock < p.minStock)
}

export async function getLowStockCount(companyId: string): Promise<number> {
  const products: { currentStock: number; minStock: number }[] = await prisma.product.findMany({
    where: { companyId },
    select: { currentStock: true, minStock: true },
  })

  return products.filter((p: { currentStock: number; minStock: number }) => p.currentStock < p.minStock).length
}
