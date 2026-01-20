import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  sku: z.string().max(50).optional().nullable(),
  price: z.number().positive().optional().nullable(),
  minStock: z.number().int().min(0).default(0),
  currentStock: z.number().int().min(0).default(0),
})

export type ProductInput = z.infer<typeof productSchema>
