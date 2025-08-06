import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Textarea = forwardRef(({ 
  className, 
  error,
  label,
  hint,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        rows={rows}
        className={cn(
          'block w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm placeholder-secondary-400 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 resize-vertical',
          error && 'border-error-300 focus:border-error-500 focus:ring-error-500',
          className
        )}
        ref={ref}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-secondary-500">{hint}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }