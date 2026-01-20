import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium',
          'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[#E85A4F] text-white hover:bg-[#D64940] focus:ring-[#E85A4F]/50 shadow-sm': variant === 'default',
            'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500/30': variant === 'secondary',
            'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500/30': variant === 'outline',
            'hover:bg-gray-100 text-gray-700 focus:ring-gray-500/30': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50': variant === 'destructive',
            'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500/50': variant === 'success',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-8 px-3 text-xs': size === 'sm',
            'h-12 px-6 text-base': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
