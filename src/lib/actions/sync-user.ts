'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function syncUser() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser || !authUser.email) {
    return { error: 'Not authenticated' }
  }

  // Try to find user by email (most reliable)
  let user = await prisma.user.findUnique({
    where: { email: authUser.email },
    include: { company: true },
  })

  if (user) {
    // Update existing user with latest info from auth
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || user.name,
        avatarUrl: authUser.user_metadata?.avatar_url || user.avatarUrl,
      },
      include: { company: true },
    })
  } else {
    // Check if user exists by Supabase ID (edge case)
    const existingById = await prisma.user.findUnique({
      where: { id: authUser.id },
    })

    if (existingById) {
      // Update the existing user's email
      user = await prisma.user.update({
        where: { id: authUser.id },
        data: {
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name,
          avatarUrl: authUser.user_metadata?.avatar_url,
        },
        include: { company: true },
      })
    } else {
      // Create new user with a new UUID (not Supabase ID to avoid conflicts)
      user = await prisma.user.create({
        data: {
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.user_metadata?.full_name,
          avatarUrl: authUser.user_metadata?.avatar_url,
        },
        include: { company: true },
      })
    }
  }

  return { user }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser || !authUser.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email },
    include: { company: true },
  })

  return user
}
