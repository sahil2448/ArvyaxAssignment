import { useState, useEffect } from 'react'
import { Calendar, Flag, FolderOpen } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { Modal, ModalBody, ModalFooter } from '../ui/Modal'
import { TaskStatus, TaskPriority } from '../../types/database'
import { useProjects } from '../../hooks/useProjects'
import { validateRequired } from '../../lib/utils'

export function TaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task = null,
  loading = false 
}) {
  const { projects } = useProjects()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    due_date: '',
    project_id: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TaskStatus.TODO,
        priority: task.priority || TaskPriority.MEDIUM,
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        project_id: task.project_id || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        due_date: '',
        project_id: ''
      })
    }
    setErrors({})
  }, [task, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!validateRequired(formData.title)) {
      newErrors.title = 'Title is required'
    }

    if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters'
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const taskData = {
        ...formData,
        due_date: formData.due_date || null,
        project_id: formData.project_id || null
      }
      
      await onSubmit(taskData)
      onClose()
    } catch (error) {
      setErrors({ submit: error.message })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-6">
          <Input
            name="title"
            label="Task Title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Textarea
            name="description"
            label="Description"
            placeholder="Enter task description (optional)"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              error={errors.status}
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
              <option value={TaskStatus.CANCELLED}>Cancelled</option>
            </Select>

            <Select
              name="priority"
              label="Priority"
              value={formData.priority}
              onChange={handleChange}
              error={errors.priority}
              leftIcon={<Flag className="h-4 w-4" />}
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
              <option value={TaskPriority.URGENT}>Urgent</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="due_date"
              type="date"
              label="Due Date"
              value={formData.due_date}
              onChange={handleChange}
              error={errors.due_date}
              leftIcon={<Calendar className="h-4 w-4" />}
            />

            <Select
              name="project_id"
              label="Project"
              value={formData.project_id}
              onChange={handleChange}
              error={errors.project_id}
              leftIcon={<FolderOpen className="h-4 w-4" />}
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </div>

          {errors.submit && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3">
              <p className="text-sm text-error-700">{errors.submit}</p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}