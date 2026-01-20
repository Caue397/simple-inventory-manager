import { syncUser } from '@/lib/actions/sync-user'
import { ProductForm } from '@/components/features/products/product-form'

export default async function NewProductPage() {
  const { user } = await syncUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">New Product</h1>
        <p className="text-gray-600">Add a new product to your inventory</p>
      </div>

      <ProductForm companyId={user!.companyId!} />
    </div>
  )
}
