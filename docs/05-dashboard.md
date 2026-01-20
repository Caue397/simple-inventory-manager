# Fase 5: Dashboard Principal

## Visão Geral

O dashboard apresenta uma visão consolidada do estoque com:
- Cards de resumo
- Gráficos de movimentação
- Produtos com estoque baixo
- Ações rápidas

## Layout Principal

```typescript
// src/app/(dashboard)/dashboard/page.tsx
import { syncUser } from '@/lib/actions/sync-user'
import { getDashboardData } from '@/lib/actions/dashboard'
import { StatsCards } from '@/components/features/stats-cards'
import { RecentMovements } from '@/components/features/recent-movements'
import { LowStockAlert } from '@/components/features/low-stock-alert'

export default async function DashboardPage() {
  const { user } = await syncUser()
  const data = await getDashboardData(user!.companyId!)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu estoque</p>
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentMovements movements={data.recentMovements} />
        <LowStockAlert products={data.lowStockProducts} />
      </div>
    </div>
  )
}
```

## Buscar Dados do Dashboard

```typescript
// src/lib/actions/dashboard.ts
'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardData(companyId: string) {
  const [
    totalProducts,
    totalMovements,
    lowStockCount,
    recentMovements,
    lowStockProducts,
  ] = await Promise.all([
    // Total de produtos
    prisma.product.count({
      where: { companyId },
    }),

    // Total de movimentações (últimos 30 dias)
    prisma.stockMovement.count({
      where: {
        product: { companyId },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    // Produtos com estoque baixo
    prisma.product.count({
      where: {
        companyId,
        currentStock: { lt: prisma.product.fields.minStock },
      },
    }),

    // Movimentações recentes
    prisma.stockMovement.findMany({
      where: { product: { companyId } },
      include: {
        product: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    // Produtos com estoque baixo
    prisma.product.findMany({
      where: {
        companyId,
        currentStock: { lt: prisma.product.fields.minStock },
      },
      orderBy: { currentStock: 'asc' },
      take: 5,
    }),
  ])

  // Corrigir query de estoque baixo (Prisma não suporta comparação entre campos diretamente)
  const allProducts = await prisma.product.findMany({
    where: { companyId },
    select: { id: true, currentStock: true, minStock: true },
  })

  const actualLowStock = allProducts.filter(p => p.currentStock < p.minStock)

  return {
    stats: {
      totalProducts,
      totalMovements,
      lowStockCount: actualLowStock.length,
    },
    recentMovements,
    lowStockProducts: await prisma.product.findMany({
      where: {
        id: { in: actualLowStock.map(p => p.id) },
      },
      orderBy: { currentStock: 'asc' },
      take: 5,
    }),
  }
}
```

## Cards de Estatísticas

```typescript
// src/components/features/stats-cards.tsx
import { Package, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StatsCardsProps {
  stats: {
    totalProducts: number
    totalMovements: number
    lowStockCount: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Movimentações (30d)',
      value: stats.totalMovements,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Estoque Baixo',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
```

## Movimentações Recentes

```typescript
// src/components/features/recent-movements.tsx
import { Card } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from 'lucide-react'
import type { MovementWithDetails } from '@/types'

interface RecentMovementsProps {
  movements: MovementWithDetails[]
}

export function RecentMovements({ movements }: RecentMovementsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Movimentações Recentes</h3>

      {movements.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhuma movimentação registrada
        </p>
      ) : (
        <div className="space-y-4">
          {movements.map((movement) => (
            <div
              key={movement.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    movement.type === 'IN'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {movement.type === 'IN' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{movement.product.name}</p>
                  <p className="text-sm text-gray-500">
                    por {movement.user.name || 'Usuário'}
                  </p>
                </div>
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
  )
}
```

## Alerta de Estoque Baixo

```typescript
// src/components/features/low-stock-alert.tsx
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import type { Product } from '@/types'

interface LowStockAlertProps {
  products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Estoque Baixo</h3>
        <Link
          href="/products?filter=low-stock"
          className="text-sm text-blue-600 hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-gray-600">Todos os produtos com estoque adequado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Mínimo: {product.minStock}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">
                  {product.currentStock}
                </p>
                <p className="text-xs text-gray-500">em estoque</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
```

## Card Component

```typescript
// src/components/ui/card.tsx
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  )
}
```

## Sidebar de Navegação

```typescript
// src/components/features/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoutButton } from './logout-button'
import type { UserWithCompany } from '@/types'

interface SidebarProps {
  user: UserWithCompany
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Movimentações', href: '/movements', icon: ArrowLeftRight },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Inventory</h1>
        <p className="text-sm text-gray-400">{user.company?.name}</p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-3 mb-4">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name || ''}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  )
}
```

## Próximos Passos

Após implementar o dashboard, prossiga para a [Fase 6: Produtos](./06-products.md).
