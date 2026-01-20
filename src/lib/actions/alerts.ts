'use server'

import { prisma } from '@/lib/prisma'
import type { LowStockProduct } from '@/types'

export async function getLowStockProducts(companyId: string): Promise<LowStockProduct[]> {
  const products = await prisma.product.findMany({
    where: { companyId },
    select: {
      id: true,
      name: true,
      sku: true,
      currentStock: true,
      minStock: true,
    },
  })

  return products.filter((p) => p.currentStock < p.minStock)
}

export async function getLowStockCount(companyId: string) {
  const products = await prisma.product.findMany({
    where: { companyId },
    select: { currentStock: true, minStock: true },
  })

  return products.filter((p) => p.currentStock < p.minStock).length
}
