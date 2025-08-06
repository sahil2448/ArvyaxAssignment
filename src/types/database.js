// Database type definitions and constants

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

export const ProjectStatus = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  MANAGER: 'manager'
}

// Validation schemas
export const taskSchema = {
  title: { required: true, minLength: 1, maxLength: 255 },
  description: { maxLength: 1000 },
  status: { required: true, enum: Object.values(TaskStatus) },
  priority: { required: true, enum: Object.values(TaskPriority) },
  due_date: { type: 'date' },
  project_id: { type: 'uuid' }
}

export const projectSchema = {
  name: { required: true, minLength: 1, maxLength: 255 },
  description: { maxLength: 1000 },
  status: { required: true, enum: Object.values(ProjectStatus) },
  start_date: { type: 'date' },
  end_date: { type: 'date' }
}

export const profileSchema = {
  full_name: { required: true, minLength: 1, maxLength: 255 },
  avatar_url: { type: 'url' },
  bio: { maxLength: 500 },
  location: { maxLength: 100 },
  website: { type: 'url' }
}

// Helper functions
export const getStatusColor = (status) => {
  const colors = {
    [TaskStatus.TODO]: 'bg-secondary-100 text-secondary-800',
    [TaskStatus.IN_PROGRESS]: 'bg-primary-100 text-primary-800',
    [TaskStatus.COMPLETED]: 'bg-success-100 text-success-800',
    [TaskStatus.CANCELLED]: 'bg-error-100 text-error-800',
    [ProjectStatus.PLANNING]: 'bg-warning-100 text-warning-800',
    [ProjectStatus.ACTIVE]: 'bg-primary-100 text-primary-800',
    [ProjectStatus.ON_HOLD]: 'bg-secondary-100 text-secondary-800',
    [ProjectStatus.COMPLETED]: 'bg-success-100 text-success-800',
    [ProjectStatus.CANCELLED]: 'bg-error-100 text-error-800'
  }
  return colors[status] || 'bg-secondary-100 text-secondary-800'
}

export const getPriorityColor = (priority) => {
  const colors = {
    [TaskPriority.LOW]: 'bg-secondary-100 text-secondary-800',
    [TaskPriority.MEDIUM]: 'bg-warning-100 text-warning-800',
    [TaskPriority.HIGH]: 'bg-accent-100 text-accent-800',
    [TaskPriority.URGENT]: 'bg-error-100 text-error-800'
  }
  return colors[priority] || 'bg-secondary-100 text-secondary-800'
}

export const formatStatus = (status) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export const formatPriority = (priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}