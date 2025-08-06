import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './Button'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const styles = {
  success: 'bg-success-50 border-success-200 text-success-800',
  error: 'bg-error-50 border-error-200 text-error-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800'
}

export function Notification({ 
  id,
  type = 'info', 
  message, 
  title,
  duration = 5000,
  onClose,
  className 
}) {
  const Icon = icons[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, id, onClose])

  return (
    <div
      className={cn(
        'relative flex items-start p-4 border rounded-lg shadow-lg animate-slide-down',
        styles[type],
        className
      )}
    >
      <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-medium mb-1">{title}</h4>
        )}
        <p className="text-sm">{message}</p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onClose(id)}
        className="h-6 w-6 p-0 ml-3 flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function NotificationContainer({ notifications, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  )
}