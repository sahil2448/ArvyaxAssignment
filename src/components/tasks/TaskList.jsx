import { useState } from 'react'
import { Plus, Filter, Search, Grid, List } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useTasks } from '../../hooks/useTasks'
import { useNotifications } from '../../hooks/useNotifications'
import { TaskStatus, TaskPriority } from '../../types/database'
import { useDebounce } from '../../hooks/useDebounce'
import { filterBy, sortBy } from '../../types'

export function TaskList() {
  const { 
    tasks, 
    loading, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus 
  } = useTasks()
  const { success, error } = useNotifications()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Filter and search tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = !debouncedSearch || 
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData)
      success('Task created successfully!')
    } catch (err) {
      error('Failed to create task')
    }
  }

  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData)
      success('Task updated successfully!')
      setEditingTask(null)
    } catch (err) {
      error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await deleteTask(taskId)
      success('Task deleted successfully!')
    } catch (err) {
      error('Failed to delete task')
    }
  }

  const handleToggleTaskStatus = async (taskId) => {
    try {
      await toggleTaskStatus(taskId)
      success('Task status updated!')
    } catch (err) {
      error('Failed to update task status')
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Tasks</h1>
          <p className="text-secondary-600">
            Manage your tasks and stay productive
          </p>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="sm:max-w-xs"
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:max-w-xs"
          >
            <option value="all">All Status</option>
            <option value={TaskStatus.TODO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
            <option value={TaskStatus.CANCELLED}>Cancelled</option>
          </Select>
          
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="sm:max-w-xs"
          >
            <option value="all">All Priority</option>
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
            <option value={TaskPriority.URGENT}>Urgent</option>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task Count */}
      <div className="text-sm text-secondary-600">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Tasks Grid/List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
            <CheckSquare className="h-12 w-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No tasks found
          </h3>
          <p className="text-secondary-600 mb-6">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first task'
            }
          </p>
          {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          )}
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleTaskStatus}
              showProject={true}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        loading={loading}
      />
    </div>
  )
}