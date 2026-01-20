'use client'

import { motion } from 'framer-motion'
import { slideUp, smoothTransition } from '@/lib/animations'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={slideUp.initial}
      animate={slideUp.animate}
      transition={smoothTransition}
    >
      {children}
    </motion.div>
  )
}
