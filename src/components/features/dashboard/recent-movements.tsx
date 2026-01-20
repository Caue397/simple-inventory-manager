import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Package } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Movement {
  id: string
  type: 'IN' | 'OUT'
  quantity: number
  createdAt: Date
  product: { name: string }
  user: { name: string | null }
}

interface RecentMovementsProps {
  movements: Movement[]
}

export function RecentMovements({ movements }: RecentMovementsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <CardTitle>Recent Movements</CardTitle>
          </div>
          <Link href="/movements">
            <Button variant="ghost" size="sm" className="text-[#E85A4F] hover:text-[#D64940] hover:bg-[#FDECEA]">
              View all
            </Button>
          </Link>
        </div>
        <CardDescription>Latest stock entries and exits</CardDescription>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No movements recorded yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      movement.type === 'IN'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-[#FDECEA] text-[#E85A4F]'
                    }`}
                  >
                    {movement.type === 'IN' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {movement.user.name || 'User'}{' '}
                      <span className="text-gray-500 font-normal">
                        {movement.type === 'IN' ? 'added' : 'removed'}
                      </span>{' '}
                      <span className={movement.type === 'IN' ? 'text-emerald-600' : 'text-[#E85A4F]'}>
                        {movement.quantity} items
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">{movement.product.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {formatDateTime(movement.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
