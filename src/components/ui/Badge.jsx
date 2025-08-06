import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Badge = forwardRef(({ 
  className, 
  variant = 'default',
  size = 'md',
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors'
  
  const variants = {
    default: 'bg-secondary-100 text-secondary-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    accent: 'bg-accent-100 text-accent-800',
    outline: 'border border-secondary-300 text-secondary-700'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export { Badge }