import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm',
          'placeholder:text-gray-400 text-gray-900',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#E85A4F]/20 focus:border-[#E85A4F]',
          'hover:border-gray-300',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
