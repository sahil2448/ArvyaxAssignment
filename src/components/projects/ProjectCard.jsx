import { useState } from 'react'
import { 
  Calendar, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { 
  getStatusColor, 
  formatStatus,
  ProjectStatus 
} from '../../types/database'
import { formatDate, isOverdue, getDaysUntilDue } from '../../types'
import { cn } from '../../lib/utils'

export function ProjectCard({ 
  project, 
  onEdit, 
  onDelete,
  taskCount = 0,
  completedTasks = 0
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isCompleted = project.status === ProjectStatus.COMPLETED
  const overdue = isOverdue(project.end_date)
  const daysUntilDue = getDaysUntilDue(project.end_date)
  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0

  const getStatusIcon = () => {
    switch (project.status) {
      case ProjectStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-success-600" />
      case ProjectStatus.ACTIVE:
        return <Clock className="h-4 w-4 text-primary-600" />
      case ProjectStatus.ON_HOLD:
        return <AlertCircle className="h-4 w-4 text-warning-600" />
      default:
        return <Clock className="h-4 w-4 text-secondary-600" />
    }
  }

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-200',
      isCompleted && 'opacity-75',
      overdue && !isCompleted && 'border-error-200 bg-error-50/30'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {getStatusIcon()}
            <div className="flex-1 min-w-0">
              <CardTitle className={cn(
                'text-lg mb-1',
                isCompleted && 'line-through text-secondary-500'
              )}>
                {project.name}
              </CardTitle>
              
              {project.description && (
                <p className="text-sm text-secondary-600 line-clamp-2">
                  {project.description}
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
                    onEdit(project)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                >
                  <Edit className="h-4 w-4 mr-3" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(project.id)
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
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Status and Progress */}
          <div className="flex items-center justify-between">
            <Badge variant={
              project.status === ProjectStatus.COMPLETED ? 'success' :
              project.status === ProjectStatus.ACTIVE ? 'primary' :
              project.status === ProjectStatus.ON_HOLD ? 'warning' : 'default'
            }>
              {formatStatus(project.status)}
            </Badge>
            
            {taskCount > 0 && (
              <div className="text-sm text-secondary-600">
                {completedTasks}/{taskCount} tasks completed
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {taskCount > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-secondary-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-secondary-500">
            {project.start_date && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Started {formatDate(project.start_date)}
              </div>
            )}
            
            {project.end_date && (
              <div className={cn(
                'flex items-center',
                overdue && !isCompleted ? 'text-error-600 font-medium' : ''
              )}>
                <Calendar className="h-3 w-3 mr-1" />
                {overdue && !isCompleted ? (
                  <span>
                    {Math.abs(daysUntilDue)} days overdue
                  </span>
                ) : daysUntilDue === 0 ? (
                  <span className="text-warning-600 font-medium">Due today</span>
                ) : daysUntilDue === 1 ? (
                  <span className="text-warning-600 font-medium">Due tomorrow</span>
                ) : daysUntilDue > 0 ? (
                  <span>Due in {daysUntilDue} days</span>
                ) : (
                  <span>Due {formatDate(project.end_date)}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectList() {
  const { 
    projects, 
    loading, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjects()
  const { tasks } = useTasks()
  const { success, error } = useNotifications()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Filter and search projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = !debouncedSearch || 
        project.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const getProjectTaskStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.project_id === projectId)
    const completedTasks = projectTasks.filter(task => task.status === 'completed')
    return {
      total: projectTasks.length,
      completed: completedTasks.length
    }
  }

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData)
      success('Project created successfully!')
    } catch (err) {
      error('Failed to create project')
    }
  }

  const handleUpdateProject = async (projectData) => {
    try {
      await updateProject(editingProject.id, projectData)
      success('Project updated successfully!')
      setEditingProject(null)
    } catch (err) {
      error('Failed to update project')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) return
    
    try {
      await deleteProject(projectId)
      success('Project deleted successfully!')
    } catch (err) {
      error('Failed to delete project')
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProject(null)
  }

  if (loading && projects.length === 0) {
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
          <h1 className="text-2xl font-bold text-secondary-900">Projects</h1>
          <p className="text-secondary-600">
            Organize your work into projects
          </p>
        </div>
        
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            type="search"
            placeholder="Search projects..."
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
            <option value={ProjectStatus.PLANNING}>Planning</option>
            <option value={ProjectStatus.ACTIVE}>Active</option>
            <option value={ProjectStatus.ON_HOLD}>On Hold</option>
            <option value={ProjectStatus.COMPLETED}>Completed</option>
            <option value={ProjectStatus.CANCELLED}>Cancelled</option>
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

      {/* Project Count */}
      <div className="text-sm text-secondary-600">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="h-12 w-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No projects found
          </h3>
          <p className="text-secondary-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first project'
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}>
          {filteredProjects.map(project => {
            const stats = getProjectTaskStats(project.id)
            return (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                taskCount={stats.total}
                completedTasks={stats.completed}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}