'use server'

import { prisma } from '@/lib/prisma'
import { movementSchema } from '@/lib/validations/movement'
import { revalidatePath } from 'next/cache'

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

interface GetMovementsParams {
  type?: 'IN' | 'OUT'
  productId?: string
  startDate?: string
  endDate?: string
}

export async function getMovements(companyId: string, params: GetMovementsParams = {}) {
  const { type, productId, startDate, endDate } = params

  return prisma.stockMovement.findMany({
    where: {
      product: { companyId },
      ...(type && { type }),
      ...(productId && { productId }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(`${endDate}T23:59:59`) }),
            },
          }
        : {}),
    },
    include: {
      product: { select: { name: true, sku: true } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createMovement(data: unknown, userId: string) {
  try {
    const validated = movementSchema.parse(data)

    // Get product to validate stock
    const product = await prisma.product.findUnique({
      where: { id: validated.productId },
    })

    if (!product) {
      return { error: 'Product not found' }
    }

    // Validate stock for outgoing movements
    if (validated.type === 'OUT' && product.currentStock < validated.quantity) {
      return {
        error: `Insufficient stock. Available: ${product.currentStock}`
      }
    }

    // Calculate new stock
    const newStock =
      validated.type === 'IN'
        ? product.currentStock + validated.quantity
        : product.currentStock - validated.quantity

    // Create movement and update stock in a transaction
    const movement = await prisma.$transaction(async (tx: TransactionClient) => {
      const newMovement = await tx.stockMovement.create({
        data: {
          type: validated.type,
          quantity: validated.quantity,
          reason: validated.reason,
          productId: validated.productId,
          userId,
        },
      })

      await tx.product.update({
        where: { id: validated.productId },
        data: { currentStock: newStock },
      })

      return newMovement
    })

    revalidatePath('/movements')
    revalidatePath('/dashboard')
    revalidatePath('/products')
    revalidatePath('/alerts')

    return { movement }
  } catch (error) {
    console.error('Error creating movement:', error)
    return { error: 'Failed to register movement' }
  }
}
