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
  Line
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'

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

export function TaskStatusChart({ tasks }) {
  const statusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: COLORS.todo },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: COLORS.in_progress },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: COLORS.completed },
    { name: 'Cancelled', value: tasks.filter(t => t.status === 'cancelled').length, color: COLORS.cancelled }
  ].filter(item => item.value > 0)

  return (
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
  )
}

export function TaskPriorityChart({ tasks }) {
  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length }
  ]

  return (
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
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductivityChart({ tasks }) {
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const productivityData = last7Days.map(date => {
    const dayTasks = tasks.filter(task => 
      task.created_at.startsWith(date) || 
      (task.updated_at && task.updated_at.startsWith(date) && task.status === 'completed')
    )
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      created: dayTasks.filter(t => t.created_at.startsWith(date)).length,
      completed: dayTasks.filter(t => 
        t.updated_at && t.updated_at.startsWith(date) && t.status === 'completed'
      ).length
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Created"
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#22c55e" 
                strokeWidth={2}
                name="Completed"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}