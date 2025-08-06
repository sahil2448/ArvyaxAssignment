import { useState } from 'react'
import { 
  Calendar, 
  Flag, 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle,
  Circle,
  Clock
} from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { 
  getStatusColor, 
  getPriorityColor, 
  formatStatus, 
  formatPriority,
  TaskStatus 
} from '../../types/database'
import { formatDate, isOverdue, getDaysUntilDue } from '../../types'
import { cn } from '../../lib/utils'

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  showProject = false 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isCompleted = task.status === TaskStatus.COMPLETED
  const overdue = isOverdue(task.due_date)
  const daysUntilDue = getDaysUntilDue(task.due_date)

  const handleToggleStatus = () => {
    onToggleStatus(task.id)
  }

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-200',
      isCompleted && 'opacity-75',
      overdue && !isCompleted && 'border-error-200 bg-error-50/30'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={handleToggleStatus}
              className="mt-0.5 text-secondary-400 hover:text-primary-600 transition-colors"
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-success-600" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-medium text-secondary-900 mb-1',
                isCompleted && 'line-through text-secondary-500'
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-secondary-600 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit(task)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                >
                  <Edit className="h-4 w-4 mr-3" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-error-700 hover:bg-error-50"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={task.status === TaskStatus.COMPLETED ? 'success' : 'default'}>
              {formatStatus(task.status)}
            </Badge>
            
            <Badge variant={
              task.priority === 'urgent' ? 'error' :
              task.priority === 'high' ? 'warning' :
              task.priority === 'medium' ? 'primary' : 'default'
            }>
              <Flag className="h-3 w-3 mr-1" />
              {formatPriority(task.priority)}
            </Badge>

            {showProject && task.project && (
              <Badge variant="outline">
                {task.project.name}
              </Badge>
            )}
          </div>

          {task.due_date && (
            <div className={cn(
              'flex items-center text-xs',
              overdue && !isCompleted ? 'text-error-600' : 'text-secondary-500'
            )}>
              <Calendar className="h-3 w-3 mr-1" />
              {overdue && !isCompleted ? (
                <span className="font-medium">
                  {Math.abs(daysUntilDue)} days overdue
                </span>
              ) : daysUntilDue === 0 ? (
                <span className="font-medium text-warning-600">Due today</span>
              ) : daysUntilDue === 1 ? (
                <span className="font-medium text-warning-600">Due tomorrow</span>
              ) : daysUntilDue > 0 ? (
                <span>Due in {daysUntilDue} days</span>
              ) : (
                <span>{formatDate(task.due_date)}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}