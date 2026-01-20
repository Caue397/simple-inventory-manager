import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getMonthlyMovements } from '@/lib/actions/dashboard'

interface StockChartProps {
  companyId: string
}

export async function StockChart({ companyId }: StockChartProps) {
  const monthlyData = await getMonthlyMovements(companyId)

  // Find the max value to calculate bar heights
  const maxValue = Math.max(...monthlyData.map(d => d.total), 1)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E85A4F]" />
            <CardTitle>Stock Movements</CardTitle>
          </div>
          <a href="/movements" className="text-xs text-[#E85A4F] hover:underline">
            Full Report &rarr;
          </a>
        </div>
        <CardDescription>Monthly movements overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="flex items-end justify-between h-48 gap-2">
          {monthlyData.map((item, index) => {
            const heightPercent = (item.total / maxValue) * 100
            const isCurrentMonth = index === monthlyData.length - 1

            return (
              <div key={item.month} className="flex flex-col items-center flex-1 gap-2">
                <div className="relative w-full flex justify-center" style={{ height: '180px' }}>
                  <div
                    className={`w-full max-w-8 rounded-t-lg transition-all ${
                      isCurrentMonth
                        ? 'bg-[#E85A4F]'
                        : 'bg-[#FDECEA] hover:bg-[#F5C6C2]'
                    }`}
                    style={{
                      height: `${Math.max(heightPercent, 5)}%`,
                      position: 'absolute',
                      bottom: 0,
                    }}
                  />
                  {item.total > 0 && (
                    <span className="absolute -top-5 text-xs font-medium text-gray-500">
                      {item.total}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{item.month}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
