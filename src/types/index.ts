import { prisma } from '@/lib/prisma'

// Infer types from Prisma client
type PrismaUser = Awaited<ReturnType<typeof prisma.user.findFirst>> & {}
type PrismaCompany = Awaited<ReturnType<typeof prisma.company.findFirst>> & {}
type PrismaProduct = Awaited<ReturnType<typeof prisma.product.findFirst>> & {}
type PrismaStockMovement = Awaited<ReturnType<typeof prisma.stockMovement.findFirst>> & {}

// Base types
export type User = NonNullable<PrismaUser>
export type Company = NonNullable<PrismaCompany>
export type Product = NonNullable<PrismaProduct>
export type StockMovement = NonNullable<PrismaStockMovement>

export type ProductWithMovements = Product & {
  stockMovements: StockMovement[]
}

export type UserWithCompany = User & {
  company: Company | null
}

export type MovementWithDetails = StockMovement & {
  product: { name: string; sku: string | null }
  user: { name: string | null }
}

export type DashboardStats = {
  totalProducts: number
  totalMovements: number
  lowStockCount: number
}

export type LowStockProduct = {
  id: string
  name: string
  sku: string | null
  currentStock: number
  minStock: number
}

export type ProductMovement = StockMovement & {
  user: { name: string | null }
}

export type ProductWithDetails = Omit<Product, 'price'> & {
  price: number | null
  stockMovements: ProductMovement[]
}

export type SerializedProduct = Omit<Product, 'price'> & {
  price: number | null
}
