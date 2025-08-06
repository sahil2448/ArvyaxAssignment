import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './useAuth'
import { TaskStatus, TaskPriority } from '../types/database'

export function useTasks() {
  const { user } = useAuth()
  const [state, setState] = useState({
    tasks: [],
    loading: false,
    error: null
  })

  const fetchTasks = async () => {
    if (!user) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const tasks = await db.getTasks(user.id)
      setState(prev => ({ ...prev, tasks, loading: false }))
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
    }
  }

  const createTask = async (taskData) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const newTask = await db.createTask({
        ...taskData,
        user_id: user.id,
        status: taskData.status || TaskStatus.TODO,
        priority: taskData.priority || TaskPriority.MEDIUM
      })
      
      setState(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
        loading: false
      }))
      
      return newTask
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const updatedTask = await db.updateTask(taskId, updates)
      
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
        loading: false
      }))
      
      return updatedTask
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const deleteTask = async (taskId) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      await db.deleteTask(taskId)
      
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId),
        loading: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const toggleTaskStatus = async (taskId) => {
    const task = state.tasks.find(t => t.id === taskId)
    if (!task) return

    const newStatus = task.status === TaskStatus.COMPLETED 
      ? TaskStatus.TODO 
      : TaskStatus.COMPLETED

    return updateTask(taskId, { status: newStatus })
  }

  const getTasksByStatus = (status) => {
    return state.tasks.filter(task => task.status === status)
  }

  const getTasksByPriority = (priority) => {
    return state.tasks.filter(task => task.priority === priority)
  }

  const getOverdueTasks = () => {
    const now = new Date()
    return state.tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < now && 
      task.status !== TaskStatus.COMPLETED
    )
  }

  const getTasksForProject = (projectId) => {
    return state.tasks.filter(task => task.project_id === projectId)
  }

  const getTaskStats = () => {
    const total = state.tasks.length
    const completed = getTasksByStatus(TaskStatus.COMPLETED).length
    const inProgress = getTasksByStatus(TaskStatus.IN_PROGRESS).length
    const todo = getTasksByStatus(TaskStatus.TODO).length
    const overdue = getOverdueTasks().length

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  return {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    getTasksForProject,
    getTaskStats,
    refetch: fetchTasks
  }
}