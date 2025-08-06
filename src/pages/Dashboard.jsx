import { 
  CheckSquare, 
  FolderOpen, 
  Clock, 
  TrendingUp,
  Plus,
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { StatsCard } from '../components/dashboard/StatsCard'
import { RecentTasks } from '../components/dashboard/RecentTasks'
import { ProjectOverview } from '../components/dashboard/ProjectOverview'
import { TaskStatusChart, ProductivityChart } from '../components/analytics/TaskChart'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useTasks } from '../hooks/useTasks'
import { useProjects } from '../hooks/useProjects'
import { useNotifications } from '../hooks/useNotifications'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { isOverdue, formatDate } from '../types'

export function Dashboard() {
  const { 
    tasks, 
    loading: tasksLoading, 
    getTaskStats, 
    toggleTaskStatus 
  } = useTasks()
  const { 
    projects, 
    loading: projectsLoading, 
    getProjectStats 
  } = useProjects()
  const { success, error } = useNotifications()

  const taskStats = getTaskStats()
  const projectStats = getProjectStats()
  
  const overdueTasks = tasks.filter(task => 
    isOverdue(task.due_date) && task.status !== 'completed'
  )
  
  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false
    const dueDate = new Date(task.due_date)
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000))
    return dueDate >= today && dueDate <= threeDaysFromNow
  })

  const handleToggleTaskStatus = async (taskId) => {
    try {
      await toggleTaskStatus(taskId)
      success('Task status updated!')
    } catch (err) {
      error('Failed to update task status')
    }
  }

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back! 👋
          </h1>
          <p className="text-secondary-600 mt-1">
            Here's what's happening with your projects and tasks today.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={taskStats.total}
          icon={CheckSquare}
          color="primary"
        />
        <StatsCard
          title="Completed Tasks"
          value={taskStats.completed}
          change={taskStats.completionRate}
          changeType="positive"
          icon={CheckSquare}
          color="success"
        />
        <StatsCard
          title="Active Projects"
          value={projectStats.active}
          icon={FolderOpen}
          color="primary"
        />
        <StatsCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          icon={AlertTriangle}
          color="error"
        />
      </div>

      {/* Quick Actions */}
      {(overdueTasks.length > 0 || upcomingTasks.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <Card className="border-error-200 bg-error-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-error-700 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Overdue Tasks ({overdueTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {overdueTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-error-800">
                        {task.title}
                      </span>
                      <span className="text-xs text-error-600">
                        {formatDate(task.due_date)}
                      </span>
                    </div>
                  ))}
                  {overdueTasks.length > 3 && (
                    <p className="text-xs text-error-600">
                      +{overdueTasks.length - 3} more overdue tasks
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Review Overdue Tasks
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <Card className="border-warning-200 bg-warning-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-warning-700 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Due Soon ({upcomingTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {upcomingTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-warning-800">
                        {task.title}
                      </span>
                      <span className="text-xs text-warning-600">
                        {formatDate(task.due_date)}
                      </span>
                    </div>
                  ))}
                  {upcomingTasks.length > 3 && (
                    <p className="text-xs text-warning-600">
                      +{upcomingTasks.length - 3} more upcoming tasks
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Upcoming Tasks
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <RecentTasks 
          tasks={tasks} 
          onToggleStatus={handleToggleTaskStatus}
        />
        
        {/* Project Overview */}
        <ProjectOverview 
          projects={projects} 
          tasks={tasks}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TaskStatusChart tasks={tasks} />
        <ProductivityChart tasks={tasks} />
      </div>
    </div>
  )
}