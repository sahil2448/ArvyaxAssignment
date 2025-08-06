// Common type definitions and interfaces

export const AuthState = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated'
}

export const Theme = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

export const ViewMode = {
  GRID: 'grid',
  LIST: 'list',
  KANBAN: 'kanban'
}

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc'
}

export const FilterType = {
  ALL: 'all',
  STATUS: 'status',
  PRIORITY: 'priority',
  PROJECT: 'project',
  DATE: 'date'
}

// Utility functions
export const createInitialState = (data = null, loading = false, error = null) => ({
  data,
  loading,
  error
})

export const createAsyncState = () => ({
  data: null,
  loading: false,
  error: null
})

export const updateAsyncState = (state, updates) => ({
  ...state,
  ...updates
})

// Form validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Date utilities
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const isOverdue = (date) => {
  if (!date) return false
  return new Date(date) < new Date()
}

export const getDaysUntilDue = (date) => {
  if (!date) return null
  const today = new Date()
  const dueDate = new Date(date)
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, order = SortOrder.ASC) => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === SortOrder.ASC ? -1 : 1
    if (aVal > bVal) return order === SortOrder.ASC ? 1 : -1
    return 0
  })
}

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === FilterType.ALL || !value) return true
      return item[key] === value
    })
  })
}

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  },

  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}