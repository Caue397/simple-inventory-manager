import { notFound } from 'next/navigation'
import Link from 'next/link'
import { syncUser } from '@/lib/actions/sync-user'
import { getProduct } from '@/lib/actions/products'
import { ProductForm } from '@/components/features/products/product-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const { user } = await syncUser()
  const product = await getProduct(id, user!.companyId!)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/products/${product.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">{product.name}</p>
        </div>
      </div>

      <ProductForm product={product} companyId={user!.companyId!} />
    </div>
  )
}
