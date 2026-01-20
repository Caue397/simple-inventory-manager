import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  document: z.string().max(20).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
})

export type CompanyInput = z.infer<typeof companySchema>
