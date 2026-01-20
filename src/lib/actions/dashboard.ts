'use server'

import { prisma } from '@/lib/prisma'

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function getMonthlyMovements(companyId: string) {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const movements = await prisma.stockMovement.findMany({
    where: {
      product: { companyId },
      createdAt: { gte: sixMonthsAgo },
    },
    select: { createdAt: true },
  })

  // Group by month
  const monthlyData: Record<string, number> = {}

  // Initialize all 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    monthlyData[key] = 0
  }

  // Count movements per month
  movements.forEach(m => {
    const date = new Date(m.createdAt)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (key in monthlyData) {
      monthlyData[key]++
    }
  })

  // Convert to array format
  return Object.entries(monthlyData).map(([key, total]) => {
    const [year, month] = key.split('-').map(Number)
    return {
      month: MONTHS_SHORT[month],
      total,
    }
  })
}

export async function getDashboardData(companyId: string) {
  const [
    totalProducts,
    recentMovements,
    products,
  ] = await Promise.all([
    // Total products
    prisma.product.count({
      where: { companyId },
    }),

    // Recent movements (last 30 days)
    prisma.stockMovement.findMany({
      where: {
        product: { companyId },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        product: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    // All products to calculate low stock
    prisma.product.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        sku: true,
        currentStock: true,
        minStock: true
      },
    }),
  ])

  // Calculate low stock products (Prisma doesn't support comparing fields directly)
  const lowStockProducts = products.filter(p => p.currentStock < p.minStock)

  // Total movements in last 30 days
  const totalMovements = await prisma.stockMovement.count({
    where: {
      product: { companyId },
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  })

  return {
    stats: {
      totalProducts,
      totalMovements,
      lowStockCount: lowStockProducts.length,
    },
    recentMovements,
    lowStockProducts: lowStockProducts.slice(0, 5),
  }
}
