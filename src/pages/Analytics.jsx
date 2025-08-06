import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp, 
  CheckSquare, 
  FolderOpen, 
  Clock, 
  Target,
  Calendar,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { StatsCard } from '../components/dashboard/StatsCard'
import { Badge } from '../components/ui/Badge'
import { useTasks } from '../hooks/useTasks'
import { useProjects } from '../hooks/useProjects'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { formatDate, isThisWeek, isToday } from '../types'

const COLORS = {
  todo: '#64748b',
  in_progress: '#3b82f6',
  completed: '#22c55e',
  cancelled: '#ef4444',
  low: '#64748b',
  medium: '#f59e0b',
  high: '#d946ef',
  urgent: '#ef4444'
}

export function Analytics() {
  const { tasks, loading: tasksLoading, getTaskStats } = useTasks()
  const { projects, loading: projectsLoading, getProjectStats } = useProjects()

  const taskStats = getTaskStats()
  const projectStats = getProjectStats()

  // Calculate additional metrics
  const todayTasks = tasks.filter(task => isToday(task.created_at))
  const thisWeekTasks = tasks.filter(task => isThisWeek(task.created_at))
  const completedThisWeek = tasks.filter(task => 
    task.status === 'completed' && isThisWeek(task.updated_at)
  )

  // Productivity data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split('T')[0]
  })

  const productivityData = last30Days.map(date => {
    const dayTasks = tasks.filter(task => task.created_at.startsWith(date))
    const completedTasks = tasks.filter(task => 
      task.updated_at && task.updated_at.startsWith(date) && task.status === 'completed'
    )
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      created: dayTasks.length,
      completed: completedTasks.length
    }
  })

  // Task status distribution
  const statusData = [
    { name: 'To Do', value: taskStats.todo, color: COLORS.todo },
    { name: 'In Progress', value: taskStats.inProgress, color: COLORS.in_progress },
    { name: 'Completed', value: taskStats.completed, color: COLORS.completed }
  ].filter(item => item.value > 0)

  // Priority distribution
  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, fill: COLORS.low },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, fill: COLORS.medium },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, fill: COLORS.high },
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, fill: COLORS.urgent }
  ]

  // Project status distribution
  const projectStatusData = [
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length },
    { name: 'Active', value: projects.filter(p => p.status === 'active').length },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on_hold').length },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length }
  ].filter(item => item.value > 0)

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Analytics</h1>
        <p className="text-secondary-600 mt-1">
          Track your productivity and project progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={taskStats.total}
          change={`+${todayTasks.length} today`}
          changeType="positive"
          icon={CheckSquare}
          color="primary"
        />
        <StatsCard
          title="Completion Rate"
          value={`${taskStats.completionRate}%`}
          change={`${completedThisWeek.length} this week`}
          changeType="positive"
          icon={Target}
          color="success"
        />
        <StatsCard
          title="Active Projects"
          value={projectStats.active}
          change={`${projectStats.total} total`}
          changeType="neutral"
          icon={FolderOpen}
          color="primary"
        />
        <StatsCard
          title="Overdue Tasks"
          value={taskStats.overdue}
          changeType="negative"
          icon={Clock}
          color="error"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-secondary-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trend */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Productivity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="created" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Tasks Created"
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="2"
                  stroke="#22c55e" 
                  fill="#22c55e"
                  fillOpacity={0.6}
                  name="Tasks Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Project Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {projectStatusData.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
                <p className="text-secondary-600">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary-700">
                      {item.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ 
                            width: `${projectStats.total > 0 ? (item.value / projectStats.total) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm text-secondary-600 w-8 text-right">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-3">
                  <Award className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  Great Progress!
                </h3>
                <p className="text-secondary-600">
                  You've completed {taskStats.completed} tasks so far
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Tasks this week</span>
                  <Badge variant="primary">{thisWeekTasks.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Completed this week</span>
                  <Badge variant="success">{completedThisWeek.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Average completion rate</span>
                  <Badge variant="primary">{taskStats.completionRate}%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}