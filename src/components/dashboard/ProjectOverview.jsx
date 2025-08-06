import { Link } from 'react-router-dom'
import { FolderOpen, ArrowRight, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ProjectStatus, formatStatus } from '../../types/database'
import { formatDate } from '../../types'
import { cn } from '../../lib/utils'

export function ProjectOverview({ projects, tasks }) {
  const activeProjects = projects
    .filter(project => project.status === ProjectStatus.ACTIVE)
    .slice(0, 3)

  const getProjectTaskStats = (projectId) => {
    const projectTasks = tasks.filter(task => task.project_id === projectId)
    const completedTasks = projectTasks.filter(task => task.status === 'completed')
    return {
      total: projectTasks.length,
      completed: completedTasks.length,
      progress: projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Active Projects</CardTitle>
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {activeProjects.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-secondary-400" />
            </div>
            <p className="text-secondary-600">No active projects</p>
            <Link to="/projects">
              <Button size="sm" className="mt-3">
                Create your first project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeProjects.map(project => {
              const stats = getProjectTaskStats(project.id)
              
              return (
                <div 
                  key={project.id}
                  className="p-4 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-secondary-900 mb-1">
                        {project.name}
                      </h4>
                      
                      {project.description && (
                        <p className="text-sm text-secondary-600 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    
                    <Badge variant="primary">
                      {formatStatus(project.status)}
                    </Badge>
                  </div>
                  
                  {/* Progress */}
                  {stats.total > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-secondary-600 mb-1">
                        <span>Progress</span>
                        <span>{stats.progress}% ({stats.completed}/{stats.total})</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stats.progress}%` }}
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
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due {formatDate(project.end_date)}
                      </div>
                    )}
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