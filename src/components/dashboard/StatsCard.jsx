import { Card, CardContent } from '../ui/Card'
import { cn } from '../../lib/utils'

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  color = 'primary' 
}) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    error: 'bg-error-100 text-error-600',
    secondary: 'bg-secondary-100 text-secondary-600'
  }

  const changeClasses = {
    positive: 'text-success-600',
    negative: 'text-error-600',
    neutral: 'text-secondary-600'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-secondary-900">
              {value}
            </p>
            {change !== undefined && (
              <p className={cn(
                'text-sm font-medium mt-1',
                changeClasses[changeType]
              )}>
                {changeType === 'positive' && '+'}
                {change}
                {typeof change === 'number' && '%'}
                {changeType !== 'neutral' && (
                  <span className="text-secondary-500 ml-1">
                    vs last period
                  </span>
                )}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              'h-12 w-12 rounded-lg flex items-center justify-center',
              colorClasses[color]
            )}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}