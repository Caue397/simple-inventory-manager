import type { User, Company, Product, StockMovement } from '@prisma/client'

export type { User, Company, Product, StockMovement }

export type ProductWithMovements = Product & {
  stockMovements: StockMovement[]
}

export type UserWithCompany = User & {
  company: Company | null
}

export type MovementWithDetails = StockMovement & {
  product: Pick<Product, 'name' | 'sku'>
  user: Pick<User, 'name'>
}

export type DashboardStats = {
  totalProducts: number
  totalMovements: number
  lowStockCount: number
}
