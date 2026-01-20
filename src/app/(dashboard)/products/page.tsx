import Link from 'next/link'
import { syncUser } from '@/lib/actions/sync-user'
import { getProducts } from '@/lib/actions/products'
import { ProductsTable } from '@/components/features/products/products-table'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'

interface ProductsPageProps {
  searchParams: Promise<{ filter?: string; search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const { user } = await syncUser()
  const products = await getProducts(user!.companyId!, params)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FDECEA]">
              <Package className="w-5 h-5 text-[#E85A4F]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">Manage your product catalog</p>
            </div>
          </div>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </Link>
      </div>

      <ProductsTable products={products} companyId={user!.companyId!} />
    </div>
  )
}
