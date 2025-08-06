import { useState, useEffect } from 'react'
import { Calendar, FolderOpen } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { Modal, ModalBody, ModalFooter } from '../ui/Modal'
import { ProjectStatus } from '../../types/database'
import { validateRequired } from '../../lib/utils'

export function ProjectForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project = null,
  loading = false 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: ProjectStatus.PLANNING,
    start_date: '',
    end_date: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || ProjectStatus.PLANNING,
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        end_date: project.end_date ? project.end_date.split('T')[0] : ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        status: ProjectStatus.PLANNING,
        start_date: '',
        end_date: ''
      })
    }
    setErrors({})
  }, [project, isOpen])

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

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Project name is required'
    }

    if (formData.name.length > 255) {
      newErrors.name = 'Project name must be less than 255 characters'
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      
      if (endDate < startDate) {
        newErrors.end_date = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const projectData = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null
      }
      
      await onSubmit(projectData)
      onClose()
    } catch (error) {
      setErrors({ submit: error.message })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-6">
          <Input
            name="name"
            label="Project Name"
            placeholder="Enter project name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            leftIcon={<FolderOpen className="h-4 w-4" />}
            required
          />

          <Textarea
            name="description"
            label="Description"
            placeholder="Enter project description (optional)"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            rows={3}
          />

          <Select
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
            error={errors.status}
          >
            <option value={ProjectStatus.PLANNING}>Planning</option>
            <option value={ProjectStatus.ACTIVE}>Active</option>
            <option value={ProjectStatus.ON_HOLD}>On Hold</option>
            <option value={ProjectStatus.COMPLETED}>Completed</option>
            <option value={ProjectStatus.CANCELLED}>Cancelled</option>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="start_date"
              type="date"
              label="Start Date"
              value={formData.start_date}
              onChange={handleChange}
              error={errors.start_date}
              leftIcon={<Calendar className="h-4 w-4" />}
            />

            <Input
              name="end_date"
              type="date"
              label="End Date"
              value={formData.end_date}
              onChange={handleChange}
              error={errors.end_date}
              leftIcon={<Calendar className="h-4 w-4" />}
            />
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
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}