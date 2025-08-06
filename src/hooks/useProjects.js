import { useState, useEffect } from 'react'
import { db } from '../lib/supabase'
import { useAuth } from './useAuth'
import { ProjectStatus } from '../types/database'

export function useProjects() {
  const { user } = useAuth()
  const [state, setState] = useState({
    projects: [],
    loading: false,
    error: null
  })

  const fetchProjects = async () => {
    if (!user) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const projects = await db.getProjects(user.id)
      setState(prev => ({ ...prev, projects, loading: false }))
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
    }
  }

  const createProject = async (projectData) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const newProject = await db.createProject({
        ...projectData,
        user_id: user.id,
        status: projectData.status || ProjectStatus.PLANNING
      })
      
      setState(prev => ({
        ...prev,
        projects: [newProject, ...prev.projects],
        loading: false
      }))
      
      return newProject
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const updateProject = async (projectId, updates) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const updatedProject = await db.updateProject(projectId, updates)
      
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(project => 
          project.id === projectId ? updatedProject : project
        ),
        loading: false
      }))
      
      return updatedProject
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const deleteProject = async (projectId) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      await db.deleteProject(projectId)
      
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(project => project.id !== projectId),
        loading: false
      }))
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const getProjectsByStatus = (status) => {
    return state.projects.filter(project => project.status === status)
  }

  const getActiveProjects = () => {
    return getProjectsByStatus(ProjectStatus.ACTIVE)
  }

  const getCompletedProjects = () => {
    return getProjectsByStatus(ProjectStatus.COMPLETED)
  }

  const getProjectStats = () => {
    const total = state.projects.length
    const active = getActiveProjects().length
    const completed = getCompletedProjects().length
    const planning = getProjectsByStatus(ProjectStatus.PLANNING).length
    const onHold = getProjectsByStatus(ProjectStatus.ON_HOLD).length

    return {
      total,
      active,
      completed,
      planning,
      onHold,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [user])

  return {
    ...state,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByStatus,
    getActiveProjects,
    getCompletedProjects,
    getProjectStats,
    refetch: fetchProjects
  }
}