'use server'

import { prisma } from '@/lib/prisma'
import { companySchema } from '@/lib/validations/company'
import { revalidatePath } from 'next/cache'

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

interface CreateCompanyInput {
  name: string
  document?: string | null
  phone?: string | null
  address?: string | null
  userId: string
}

export async function createCompany(input: CreateCompanyInput) {
  try {
    // Validate data
    const validated = companySchema.parse({
      name: input.name,
      document: input.document,
      phone: input.phone,
      address: input.address,
    })

    // Create company and link user in a transaction
    const company = await prisma.$transaction(async (tx: TransactionClient) => {
      const newCompany = await tx.company.create({
        data: {
          name: validated.name,
          document: validated.document,
          phone: validated.phone,
          address: validated.address,
        },
      })

      await tx.user.update({
        where: { id: input.userId },
        data: { companyId: newCompany.id },
      })

      return newCompany
    })

    revalidatePath('/dashboard')
    return { company }
  } catch (error) {
    console.error('Error creating company:', error)
    return { error: 'Failed to create company. Please try again.' }
  }
}

export async function updateCompany(companyId: string, data: Partial<CreateCompanyInput>) {
  try {
    const validated = companySchema.partial().parse(data)

    const company = await prisma.company.update({
      where: { id: companyId },
      data: validated,
    })

    revalidatePath('/dashboard')
    return { company }
  } catch (error) {
    console.error('Error updating company:', error)
    return { error: 'Failed to update company. Please try again.' }
  }
}
