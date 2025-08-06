import { Link } from 'react-router-dom'
import { CheckCircle, Circle, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { TaskStatus, formatStatus, formatPriority } from '../../types/database'
import { formatDate, isOverdue } from '../../types'
import { cn } from '../../lib/utils'

export function RecentTasks({ tasks, onToggleStatus }) {
  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  const handleToggleStatus = (taskId) => {
    onToggleStatus(taskId)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Tasks</CardTitle>
          <Link to="/tasks">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {recentTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-secondary-400" />
            </div>
            <p className="text-secondary-600">No tasks yet</p>
            <Link to="/tasks">
              <Button size="sm" className="mt-3">
                Create your first task
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map(task => {
              const isCompleted = task.status === TaskStatus.COMPLETED
              const overdue = isOverdue(task.due_date)
              
              return (
                <div 
                  key={task.id}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg border transition-colors',
                    isCompleted ? 'bg-success-50 border-success-200' : 'bg-white border-secondary-200 hover:bg-secondary-50'
                  )}
                >
                  <button
                    onClick={() => handleToggleStatus(task.id)}
                    className="text-secondary-400 hover:text-primary-600 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      'font-medium text-sm',
                      isCompleted ? 'line-through text-secondary-500' : 'text-secondary-900'
                    )}>
                      {task.title}
                    </h4>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        size="sm"
                        variant={isCompleted ? 'success' : 'default'}
                      >
                        {formatStatus(task.status)}
                      </Badge>
                      
                      <Badge 
                        size="sm"
                        variant={
                          task.priority === 'urgent' ? 'error' :
                          task.priority === 'high' ? 'warning' :
                          task.priority === 'medium' ? 'primary' : 'default'
                        }
                      >
                        {formatPriority(task.priority)}
                      </Badge>
                      
                      {task.due_date && (
                        <div className={cn(
                          'flex items-center text-xs',
                          overdue && !isCompleted ? 'text-error-600' : 'text-secondary-500'
                        )}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(task.due_date)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}