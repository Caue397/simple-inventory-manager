import { z } from 'zod'

export const movementSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  reason: z.string().max(200).optional().nullable(),
  productId: z.string().uuid(),
})

export type MovementInput = z.infer<typeof movementSchema>
